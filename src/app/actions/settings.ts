'use server'

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

export type ProfileFormState = {
    message?: string
    error?: string
    success?: boolean
}

export async function updateProfile(prevState: ProfileFormState, formData: FormData): Promise<ProfileFormState> {
    const session = await auth();
    if (!session?.user?.id) {
        return { error: "Not authenticated" }
    }

    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const avatarUrl = formData.get('avatar_url') as string

    // Basic Validation
    if (!name || name.length < 2) {
        return { error: "Name must be at least 2 characters" }
    }

    try {
        // Update user
        // We might want to update email, but that usually requires verification. 
        // For now, let's allow updating name and avatar (metadata).
        // If email is changed, we should probably check uniqueness, but let's stick to name/avatar for MVP "production ready" visual.

        const updateData: any = {
            name
        }

        // Handle Avatar
        if (avatarUrl) {
            // SECURITY: Prevent massive base64 strings from bloating DB and Cookies
            if (avatarUrl.length > 1000000) {
                return { error: "Image is too large. Please use a smaller photo (max 1MB)" }
            }

            // Fetch current metadata to merge
            const currentUser = await prisma.app_user.findUnique({
                where: { id: session.user.id },
                select: { metadata: true }
            });

            const currentMeta = (currentUser?.metadata as any) || {};
            updateData.metadata = {
                ...currentMeta,
                avatar_url: avatarUrl
            };
        }

        await prisma.app_user.update({
            where: { id: session.user.id },
            data: updateData
        })

        revalidatePath('/settings/profile')
        revalidatePath('/', 'layout') // Update sidebar avatar

        return { success: true, message: "Profile updated successfully" }

    } catch (error) {
        console.error("Profile update error:", error)
        return { error: "Failed to update profile" }
    }
}

export async function getUserProfile() {
    const session = await auth();
    if (!session?.user?.id) return null;

    const user = await prisma.app_user.findUnique({
        where: { id: session.user.id },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            metadata: true,
            created_at: true
        }
    });

    return user;
}


export async function updateGlobalSettings(data: {
    companyId: string,
    name: string,
    industry: string,
    logoUrl: string,
    currencyId: string,
    address?: string,
    phone?: string,
    email?: string,
    gstin?: string,
    invoicePrefix?: string
}) {

    const session = await auth();
    if (!session?.user?.id) return { error: "Not authenticated" };

    // Basic RBAC check
    if (!session.user.isAdmin && !session.user.isTenantAdmin) {
        // return { error: "Unauthorized" }
    }

    try {
        await prisma.$transaction(async (tx) => {
            // Fetch current metadata to merge
            const currentCompany = await tx.company.findUnique({
                where: { id: data.companyId },
                select: { metadata: true }
            });
            const currentMeta = (currentCompany?.metadata as any) || {};

            // Update Company Basics & Metadata
            await tx.company.update({
                where: { id: data.companyId },
                data: {
                    name: data.name,
                    industry: data.industry,
                    logo_url: data.logoUrl,
                    metadata: {
                        ...currentMeta,
                        address: data.address,
                        phone: data.phone,
                        email: data.email,
                        gstin: data.gstin
                    }
                }
            });

            // Update Company Settings (Currency)
            // Upsert because it might not exist
            // Update Company Settings (Currency & Invoice Prefix)
            // Upsert because it might not exist
            const existingSettings = await tx.company_settings.findUnique({
                where: { company_id: data.companyId }
            });

            if (existingSettings) {
                await tx.company_settings.update({
                    where: { id: existingSettings.id },
                    data: {
                        currency_id: data.currencyId,
                        numbering_prefix: data.invoicePrefix
                    }
                });
            } else {
                // Should exist ideally, but fallback create
                await tx.company_settings.create({
                    data: {
                        tenant_id: session.user.tenantId!,
                        company_id: data.companyId,
                        currency_id: data.currencyId,
                        numbering_prefix: data.invoicePrefix || 'INV'
                    }
                });
            }
        });

        revalidatePath('/settings/global');
        revalidatePath('/', 'layout'); // Update logo in sidebar

        return { success: true };
    } catch (error) {
        console.error("Failed to update global settings:", error);
        return { error: "Failed to update settings" };
    }
}

export async function updateTenantSettings(data: {
    tenantId: string,
    appName: string,
    logoUrl?: string,
    dbUrl?: string,
    registrationEnabled?: boolean
}) {
    const session = await auth();
    if (!session?.user?.id || !session.user.isTenantAdmin) {
        return { error: "Unauthorized. Tenant Admin access required." };
    }

    try {
        // Fetch current tenant for metadata
        const currentTenant = await prisma.tenant.findUnique({
            where: { id: data.tenantId }
        });

        const currentMeta = (currentTenant?.metadata as any) || {};

        // Only allow updating registration_enabled if the user is a Global Admin (Developer)
        const updatedMeta = { ...currentMeta };
        if (session.user.isAdmin && data.registrationEnabled !== undefined) {
            updatedMeta.registration_enabled = data.registrationEnabled;
        }

        await prisma.tenant.update({
            where: { id: data.tenantId },
            data: {
                app_name: data.appName,
                logo_url: data.logoUrl,
                db_url: data.dbUrl,
                metadata: updatedMeta
            }
        });

        revalidatePath('/settings/global');
        revalidatePath('/', 'layout');

        return { success: true };
    } catch (error) {
        console.error("Failed to update tenant settings:", error);
        return { error: "Failed to update tenant settings. Please check your DB connection string format." };
    }
}

// === HMS SETTINGS LOGIC ===

import { checkPermission } from "./rbac"

export async function getHMSSettings() {
    const session = await auth();
    if (!session?.user?.companyId || !session?.user?.tenantId) return { error: "Unauthorized" };

    const isAdmin = await checkPermission('hms:admin');
    if (!isAdmin) {
        return { error: "Access Denied: You need 'hms:admin' permission to manage clinical settings." };
    }

    try {
        const companyId = session.user.companyId;
        const tenantId = session.user.tenantId;

        // 1. Fetch Registration Fee Product (Master definition)
        let regFeeProduct = await prisma.hms_product.findFirst({
            where: {
                company_id: companyId,
                name: { contains: 'Registration Fee', mode: 'insensitive' },
                is_active: true
            }
        });

        if (!regFeeProduct) {
            regFeeProduct = await prisma.hms_product.findFirst({
                where: {
                    company_id: companyId,
                    name: { contains: 'Registration', mode: 'insensitive' },
                    description: { contains: 'fee', mode: 'insensitive' },
                    is_active: true
                }
            });
        }

        const finalProduct = regFeeProduct;

        // 2. Fetch HMS Specific Settings (Config JSON)
        const hmsConfigRecord = await prisma.hms_settings.findFirst({
            where: {
                company_id: companyId,
                tenant_id: tenantId,
                key: 'registration_config'
            }
        });

        const configData = (hmsConfigRecord?.value as any) || {};

        // 3. Fetch Registration Fee History (The "Amount and Date" part)
        const feeHistory = await prisma.hms_patient_registration_fees.findMany({
            where: { tenant_id: tenantId, company_id: companyId },
            orderBy: { created_at: 'desc' },
            take: 20
        });

        const activeFee = feeHistory.find(f => f.is_active);

        console.log(`HMS Settings Audit [${companyId}]: Found ${feeHistory.length} history records, active=${!!activeFee}`);

        // 4. Finalize Fee (Priority: Active Table Entry > Config JSON Value > Product Price > Fallback 100)
        let finalFee = 100;
        if (activeFee) {
            finalFee = parseFloat(activeFee.fee_amount.toString());
        } else if (configData.fee !== undefined) {
            finalFee = parseFloat(configData.fee);
        } else if (finalProduct) {
            finalFee = parseFloat(finalProduct.price?.toString() || '100');
        }

        // 4. Fetch All Available Service Products (for mapping)
        const availableProducts = await prisma.hms_product.findMany({
            where: {
                company_id: companyId,
                is_service: true,
                is_active: true
            },
            select: {
                id: true,
                name: true,
                sku: true,
                price: true
            },
            orderBy: { name: 'asc' }
        });

        return {
            success: true,
            settings: {
                registrationFee: finalFee,
                registrationProductId: configData.productId || finalProduct?.id || null,
                registrationProductName: finalProduct?.name || 'Patient Registration Fee',
                registrationProductDescription: finalProduct?.description || 'Standard Registration Service',
                registrationValidity: activeFee?.validity_days || configData.validity || 365,
                enableCardIssuance: configData.enableCardIssuance ?? true,
                feeHistory: feeHistory.map(f => ({
                    id: f.id,
                    amount: f.fee_amount,
                    validity: f.validity_days,
                    active: f.is_active,
                    date: f.created_at
                }))
            },
            availableProducts
        };
    } catch (error: any) {
        return { error: error.message };
    }
}

export async function updateHMSSettings(data: any) {
    const session = await auth();
    const companyId = session?.user?.companyId;
    const tenantId = session?.user?.tenantId;
    const userId = session?.user?.id;

    if (!companyId || !tenantId) {
        return { error: "Session expired. Please log in again." };
    }

    // Permission Check
    const canManage = await checkPermission('hms:admin');
    if (!canManage) {
        return { error: "Unauthorized: You do not have permission to manage clinical settings." };
    }

    try {
        const feeAmount = parseFloat(String(data.registrationFee || '0'));
        const validityDays = parseInt(String(data.registrationValidity || '365'));

        console.log(`[HMS SAVE DIAGNOSTIC] User: ${userId} | Co: ${companyId} | Ten: ${tenantId}`);
        console.log(`[HMS SAVE DIAGNOSTIC] Types: Co=${typeof companyId} | Ten=${typeof tenantId} | User=${typeof userId}`);
        console.log(`[HMS SAVE DIAGNOSTIC] Data: Fee=${feeAmount} | Valid=${validityDays}`);

        if (isNaN(feeAmount) || isNaN(validityDays)) {
            return { error: "Invalid registration fee or validity period." };
        }

        const result = await prisma.$transaction(async (tx) => {
            // STEP 1: Manage the Registration Fee Product
            let regProduct = null;

            // 1a. Check if an explicit product was selected in the UI
            if (data.productId && data.productId.length > 20) {
                console.log(`[HMS SETTINGS SAVE] Using explicitly selected product: ${data.productId}`);
                regProduct = await tx.hms_product.findUnique({
                    where: { id: data.productId }
                });
            }

            // 1b. If no explicit product (or not found), find/create standard SKU
            if (!regProduct) {
                const branchSuffix = companyId.slice(-6).toUpperCase();
                const targetSku = `REG-FEE-${branchSuffix}`;

                regProduct = await tx.hms_product.findFirst({
                    where: {
                        company_id: companyId,
                        OR: [
                            { sku: targetSku },
                            { sku: { startsWith: 'REG-FEE' } },
                            { name: { contains: 'Registration Fee', mode: 'insensitive' } }
                        ]
                    }
                });

                if (regProduct) {
                    console.log(`[HMS SETTINGS SAVE] Updating existing product: ${regProduct.id} (${regProduct.sku})`);
                    regProduct = await tx.hms_product.update({
                        where: { id: regProduct.id },
                        data: {
                            price: feeAmount,
                            sku: targetSku,
                            is_service: true,
                            is_stockable: false,
                            is_active: true,
                            updated_at: new Date()
                        }
                    });
                } else {
                    console.log(`[HMS SETTINGS SAVE] Creating new Registration Fee product for company ${companyId}`);
                    regProduct = await tx.hms_product.create({
                        data: {
                            tenant_id: tenantId,
                            company_id: companyId,
                            name: "Patient Registration Fee",
                            sku: targetSku,
                            description: "Standard fee for new patient registration",
                            price: feeAmount,
                            is_service: true,
                            is_stockable: false,
                            uom: 'unit',
                            is_active: true,
                            created_at: new Date()
                        }
                    });
                }
            } else {
                // UPDATE EXPLICIT PRODUCT price to match the setting
                regProduct = await tx.hms_product.update({
                    where: { id: regProduct.id },
                    data: {
                        price: feeAmount,
                        is_service: true,
                        is_active: true,
                        updated_at: new Date()
                    }
                });
            }

            // STEP 2: Manage HMS Configuration JSON (Reset & Create Pattern)
            const configValue = JSON.stringify({
                validity: validityDays,
                enableCardIssuance: !!data.enableCardIssuance,
                fee: feeAmount,
                productId: regProduct.id,
                lastUpdated: new Date().toISOString()
            });

            console.log(`[HMS SETTINGS SAVE] Wiping old config for ${companyId}`);

            // Delete any existing config for this company to avoid unique constraint issues
            await tx.hms_settings.deleteMany({
                where: { tenant_id: tenantId, company_id: companyId, key: 'registration_config' }
            });

            console.log(`[HMS SETTINGS SAVE] Creating fresh config via Raw SQL for ${companyId}`);

            // USE RAW SQL to bypass any Prisma mapping bugs or null constraint false-positives
            const configId = (await tx.$queryRaw`SELECT gen_random_uuid()` as any)[0].gen_random_uuid;

            await tx.$executeRaw`
                INSERT INTO hms_settings (
                    id, tenant_id, company_id, key, value, scope, version, is_active, created_at, updated_at, created_by, updated_by
                ) VALUES (
                    ${configId}::uuid, ${tenantId}::uuid, ${companyId}::uuid, 'registration_config', ${configValue}::jsonb, 'company', 1, true, now(), now(), ${userId}::uuid, ${userId}::uuid
                )
            `;
            console.log(`[HMS SETTINGS SAVE] Created config ID: ${configId}`);

            // STEP 3: Log Fee History (Audit Trail)
            // Deactivate all old fees for this branch
            await tx.hms_patient_registration_fees.updateMany({
                where: { company_id: companyId, is_active: true },
                data: { is_active: false, updated_at: new Date() }
            });

            // Create new audit record with explicit UUID
            const historyId = (await tx.$queryRaw`SELECT gen_random_uuid()` as any)[0].gen_random_uuid;
            await tx.$executeRaw`
                INSERT INTO hms_patient_registration_fees (
                    id, tenant_id, company_id, fee_amount, validity_days, is_active, created_at, updated_at
                ) VALUES (
                    ${historyId}::uuid, ${tenantId}::uuid, ${companyId}::uuid, ${feeAmount}, ${validityDays}, true, now(), now()
                )
            `;

            return { success: true, productId: regProduct.id };
        }, { timeout: 15000 }); // High timeout for concurrent production writes

        console.log(`[HMS SETTINGS SAVE] COMPLETED SUCCESSFULLY for ${companyId}`);

        // Flush all relevant caches
        revalidatePath('/settings/hms');
        revalidatePath('/hms/patients/new');
        revalidatePath('/hms/reception/dashboard');

        return { success: true };

    } catch (error: any) {
        console.error("CRITICAL PERSISTENCE ERROR in HMS Settings:", error);

        let userMessage = "Database error while saving. Please try again in 30 seconds.";
        if (error.code === 'P2002') userMessage = "Data collision error (SKU/Key already exists). Retrying might fix this.";

        return { error: userMessage, debug: error.message };
    }
}

export async function createBranch(data: {
    name: string;
    code: string;
    type: string;
    phone?: string;
    email?: string;
    address?: string;
    city?: string;
    state?: string;
    district?: string;
    country?: string;
    pincode?: string;
}) {
    const session = await auth();
    if (!session?.user?.id || !session.user.companyId || !session.user.tenantId) {
        return { error: "Unauthorized" };
    }

    try {
        const branch = await prisma.hms_branch.create({
            data: {
                id: crypto.randomUUID(),
                tenant_id: session.user.tenantId,
                company_id: session.user.companyId,
                name: data.name,
                code: data.code.toUpperCase(),
                type: data.type,
                phone: data.phone,
                email: data.email,
                address: data.address,
                city: data.city,
                state: data.state,
                country: data.country,
                district: data.district,
                pincode: data.pincode,
                is_active: true
            }
        });

        revalidatePath('/settings/branches');
        return { success: true, branchId: branch.id };
    } catch (error) {
        console.error("Failed to create branch:", error);
        return { error: "Failed to create branch. Branch code must be unique within company." };
    }
}

export async function updateBranch(id: string, data: {
    name: string;
    code: string;
    type: string;
    phone?: string;
    email?: string;
    address?: string;
    city?: string;
    state?: string;
    district?: string;
    country?: string;
    pincode?: string;
    is_active?: boolean;
}) {
    const session = await auth();
    if (!session?.user?.id || !session.user.companyId || !session.user.tenantId) {
        return { error: "Unauthorized" };
    }

    try {
        await prisma.hms_branch.update({
            where: {
                id,
                company_id: session.user.companyId // Security: Ensure it belongs to current company
            },
            data: {
                name: data.name,
                code: data.code.toUpperCase(),
                type: data.type,
                phone: data.phone,
                email: data.email,
                address: data.address,
                city: data.city,
                state: data.state,
                country: data.country,
                district: data.district,
                pincode: data.pincode,
                is_active: data.is_active ?? true
            }
        });

        revalidatePath('/settings/branches');
        return { success: true };
    } catch (error) {
        console.error("Failed to update branch:", error);
        return { error: "Failed to update branch." };
    }
}

export async function createDesignation(data: {
    name: string;
    description?: string;
    department_id?: string;
    parent_id?: string;
}) {
    const session = await auth();
    if (!session?.user?.id || !session.user.tenantId) {
        return { error: "Unauthorized" };
    }

    try {
        const designation = await prisma.crm_designation.create({
            data: {
                tenant_id: session.user.tenantId,
                name: data.name,
                description: data.description,
                department_id: data.department_id || null,
                parent_id: data.parent_id || null,
                is_active: true
            }
        });

        revalidatePath('/settings/designations');
        return { success: true, designationId: designation.id };
    } catch (error) {
        console.error("Failed to create designation:", error);
        return { error: "Failed to create designation. Name must be unique." };
    }
}

export async function getDesignation(id: string) {
    const session = await auth();
    if (!session?.user?.id || !session.user.tenantId) return null;

    return prisma.crm_designation.findUnique({
        where: { id, tenant_id: session.user.tenantId },
        include: { department: true, parent: true }
    });
}

export async function updateDesignation(id: string, data: {
    name: string;
    description?: string;
    department_id?: string;
    parent_id?: string;
    is_active?: boolean;
}) {
    const session = await auth();
    if (!session?.user?.id || !session.user.tenantId) {
        return { error: "Unauthorized" };
    }

    try {
        await prisma.crm_designation.update({
            where: { id, tenant_id: session.user.tenantId },
            data: {
                name: data.name,
                description: data.description,
                department_id: data.department_id || null,
                parent_id: data.parent_id || null,
                is_active: data.is_active ?? true
            }
        });

        revalidatePath('/settings/designations');
        return { success: true };
    } catch (error) {
        console.error("Failed to update designation:", error);
        return { error: "Failed to update designation." };
    }
}

export async function deleteDesignation(id: string) {
    const session = await auth();
    if (!session?.user?.id || !session.user.tenantId) {
        return { error: "Unauthorized" };
    }

    try {
        await prisma.crm_designation.delete({
            where: { id, tenant_id: session.user.tenantId }
        });

        revalidatePath('/settings/designations');
        return { success: true };
    } catch (error) {
        console.error("Failed to delete designation:", error);
        return { error: "Failed to delete designation. It might be in use by employees." };
    }
}


