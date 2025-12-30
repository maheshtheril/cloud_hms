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
            name,
            updated_at: new Date()
        }

        // Handle Avatar
        if (avatarUrl) {
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

// === HMS SETTINGS LOGIC ===

export async function getHMSSettings() {
    const session = await auth();
    if (!session?.user?.companyId || !session?.user?.tenantId) return { error: "Unauthorized" };

    try {
        const companyId = session.user.companyId;
        const tenantId = session.user.tenantId;

        // 1. Fetch Registration Fee Product
        // Priority 1: Exact match logic used in updateHMSSettings ("Registration Fee")
        let regFeeProduct = await prisma.hms_product.findFirst({
            where: {
                company_id: companyId,
                name: { contains: 'Registration Fee', mode: 'insensitive' },
                is_active: true
            }
        });

        // Priority 2: Fallback to broader search
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

        // 2. Fetch HMS Specific Settings
        const hmsConfigRecord = await prisma.hms_settings.findFirst({
            where: {
                company_id: companyId,
                tenant_id: tenantId,
                key: 'registration_config'
            }
        });

        const configData = (hmsConfigRecord?.value as any) || {};

        return {
            success: true,
            settings: {
                registrationFee: finalProduct ? parseFloat(finalProduct.price?.toString() || '0') : 500,
                registrationProductId: finalProduct?.id || null,
                registrationProductName: finalProduct?.name || 'Patient Registration Fee',
                registrationProductDescription: finalProduct?.description || 'Standard Registration Service',
                registrationValidity: configData.validity || 365,
                enableCardIssuance: configData.enableCardIssuance ?? true
            }
        };
    } catch (error: any) {
        return { error: error.message };
    }
}

export async function updateHMSSettings(data: any) {
    const session = await auth();
    if (!session?.user?.companyId) return { error: "Unauthorized" };
    const companyId = session.user.companyId;
    const tenantId = session.user.tenantId;

    try {
        console.log("Saving HMS Settings...", data);

        // 1. Update/Create Registration Fee Product
        const feeAmount = parseFloat(data.registrationFee);

        let regProduct = await prisma.hms_product.findFirst({
            where: {
                company_id: companyId,
                name: { contains: 'Registration Fee', mode: 'insensitive' }
            }
        });

        if (regProduct) {
            await prisma.hms_product.update({
                where: { id: regProduct.id },
                data: { price: feeAmount, is_service: true, is_stockable: false }
            });
        } else {
            // Create if missing!
            await prisma.hms_product.create({
                data: {
                    tenant_id: tenantId!,
                    company_id: companyId,
                    name: "Patient Registration Fee",
                    sku: `REG-FEE-${companyId.slice(0, 8).toUpperCase()}`, // Ensure unique SKU per company
                    description: "Standard fee for new patient registration",
                    price: feeAmount,
                    is_service: true,
                    is_stockable: false, // User requested non-stock service
                    uom: 'each',
                    is_active: true
                }
            });
        }

        // 2. Upsert HMS Settings
        // We use findFirst + update/create pattern to avoid guessing the unique index name if uncertain,
        // although upsert is preferred. Given schema uncertainty on unique constraint naming, manual upsert is safer.

        const existingConfig = await prisma.hms_settings.findFirst({
            where: {
                company_id: companyId,
                tenant_id: tenantId!,
                key: 'registration_config'
            }
        });

        const configValue = {
            validity: parseInt(data.registrationValidity),
            enableCardIssuance: data.enableCardIssuance
        };

        if (existingConfig) {
            await prisma.hms_settings.update({
                where: { id: existingConfig.id },
                data: { value: configValue }
            });
        } else {
            await prisma.hms_settings.create({
                data: {
                    tenant_id: tenantId!,
                    company_id: companyId,
                    key: 'registration_config',
                    value: configValue,
                    scope: 'company'
                }
            });
        }

        revalidatePath('/settings/hms');
        return { success: true };

    } catch (error: any) {
        console.error("Error updating HMS settings:", error);
        return { error: error.message };
    }
}
