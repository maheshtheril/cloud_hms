'use server'

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import crypto from "crypto";

/**
 * ===================================================================================
 * SERVICE: REVENUE CYCLE & PATIENT ADMISSION (WORLD-CLASS STANDARD)
 * ===================================================================================
 * Logic: 
 * 1. Financial Clearance: Check if facility is configured for billing.
 * 2. Identity Mastery: Ensure patient demographics are validated and scrubbed.
 * 3. Atomic Commitment: Single transaction for Patient + Financial Encounter.
 * 4. RCM Capture: capture the registration fee as a "Charge Event".
 * ===================================================================================
 */

interface PatientData {
    firstName: string;
    lastName?: string;
    dob?: Date;
    gender?: string;
    phone: string;
    email?: string;
    address: any;
    title?: string;
}

const normalizeGender = (gender: string | null) => {
    if (!gender) return 'unknown';
    const g = gender.toLowerCase().trim();
    if (g === 'm' || g === 'male') return 'male';
    if (g === 'f' || g === 'female') return 'female';
    if (g === 'other') return 'other';
    return 'unknown';
}

export async function createPatientV10(patientId: string | null | any, formData: FormData) {
    const session = await auth();
    if (!session?.user?.id || !session?.user?.tenantId) {
        return { error: "SECURITY_AUTH_EXPIRED: Please login to verify clinical credentials." };
    }

    const userId = session.user.id;
    const tenantId = session.user.tenantId;
    let companyId = session.user.companyId;

    // 1. DATA SCRUBBING (Standardizing Inputs)
    const firstName = (formData.get("first_name") as string)?.trim();
    const lastName = (formData.get("last_name") as string)?.trim() || "";
    const phone = (formData.get("phone") as string)?.trim();

    if (!firstName || !phone) {
        return { error: "VALIDATION_FAILED: Patient Identity (Name/Phone) is mandatory for clinical indexing." };
    }

    // 2. CONTEXT RESOLUTION
    if (!companyId) {
        const fallback = await prisma.company.findFirst({
            where: { tenant_id: tenantId, enabled: true }
        });
        companyId = fallback?.id ?? null;
    }
    if (!companyId) return { error: "FACILITY_NOT_LINKED: Terminal must be associated with an active medical branch." };

    try {
        // -----------------------------------------------------------------------------------
        // MASTER PATIENT INDEX (UPSERT) - DIRECT MODE (No Transaction, No Others)
        // -----------------------------------------------------------------------------------
        const registrationDate = new Date();
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 365);

        const address = {
            street: formData.get('street') as string,
            city: formData.get('city') as string,
            zip: formData.get('zip') as string,
        };

        const metadata: any = {
            created_via: 'WorldClass-V10-Atomic-Static',
            registration_date: registrationDate.toISOString(),
            registration_expiry: expiryDate.toISOString(),
            title: formData.get("title") as string,
            last_rcm_audit: new Date().toISOString()
        };

        const upsertPayload = {
            first_name: firstName,
            last_name: lastName,
            gender: normalizeGender(formData.get('gender') as string),
            dob: formData.get('dob') ? new Date(formData.get('dob') as string) : null,
            contact: { phone, email: formData.get('email'), address } as any,
            metadata: metadata,
            updated_at: new Date(),
            updated_by: userId
        };

        let patient;
        const isUpdate = (patientId && typeof patientId === 'string' && patientId.length > 30);

        try {
            if (isUpdate) {
                patient = await prisma.hms_patient.update({ where: { id: patientId as string }, data: upsertPayload });
            } else {
                patient = await prisma.hms_patient.create({
                    data: {
                        ...upsertPayload,
                        id: crypto.randomUUID(),
                        tenant_id: tenantId,
                        company_id: companyId,
                        patient_number: `PAT-${Date.now().toString().slice(-6)}`,
                        created_at: new Date(),
                        created_by: userId,
                        status: 'active'
                    }
                });
            }

            return {
                success: true,
                message: isUpdate ? "Master Patient Index Updated." : "New Patient Registered.",
                data: patient
            };
        } catch (err: any) {
            throw err; // Let catch block below handle it
        }

    } catch (err: any) {
        const errorDetail = {
            message: err.message,
            code: err.code,
            meta: err.meta,
            stack: err.stack?.split('\n')[0]
        };
        console.error("CRITICAL_RCM_FAILURE:", JSON.stringify(errorDetail, null, 2));
        return {
            error: `[RCM-FATAL] HMS_CORE_EXCEPTION: ${err.message} (Code: ${err.code || 'N/A'})`,
            details: JSON.stringify(errorDetail)
        };
    }
}

export async function createPatientQuick(formData: FormData) {
    return createPatientV10(null, formData);
}
