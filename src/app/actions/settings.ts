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

export async function getHMSSettings() {
    const session = await auth();
    if (!session?.user?.companyId || !session?.user?.tenantId) return { error: "Unauthorized" };

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

        console.log(`Fetched ${feeHistory.length} history records for company ${companyId}`);

        const activeFee = feeHistory.find(f => f.is_active);

        // 4. Finalize Fee (Priority: Active Table Entry > Config JSON Value > Product Price > Fallback 100)
        let finalFee = 100;
        if (activeFee) {
            finalFee = parseFloat(activeFee.fee_amount.toString());
        } else if (configData.fee !== undefined) {
            finalFee = parseFloat(configData.fee);
        } else if (finalProduct) {
            finalFee = parseFloat(finalProduct.price?.toString() || '100');
        }

        return {
            success: true,
            settings: {
                registrationFee: finalFee,
                registrationProductId: finalProduct?.id || configData.productId || null,
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
            }
        };
    } catch (error: any) {
        return { error: error.message };
    }
}

export async function updateHMSSettings(data: any) {
    const session = await auth();
    const companyId = session?.user?.companyId;
    const tenantId = session?.user?.tenantId;

    if (!companyId || !tenantId) {
        console.error("HMS Settings Save Rejected: Missing session context", { companyId, tenantId });
        return { error: "Session expired or unauthorized. Please login again." };
    }

    try {
        console.log("Saving HMS Settings Cluster...", { companyId, fee: data.registrationFee });

        const feeAmount = parseFloat(data.registrationFee);
        const validityDays = parseInt(data.registrationValidity);

        if (isNaN(feeAmount) || isNaN(validityDays)) {
            return { error: "Invalid fee amount or validity days." };
        }

        const result = await prisma.$transaction(async (tx) => {
            // 1. Update/Create Registration Fee Product (Master Product)
            // Search for existing active registration products
            let regProduct = await tx.hms_product.findFirst({
                where: {
                    company_id: companyId,
                    tenant_id: tenantId,
                    sku: { in: ['REG-FEE', 'REG001'] },
                    is_active: true
                }
            });

            if (!regProduct) {
                // Secondary search by name
                regProduct = await tx.hms_product.findFirst({
                    where: {
                        company_id: companyId,
                        tenant_id: tenantId,
                        name: { contains: 'Registration Fee', mode: 'insensitive' },
                        is_active: true
                    }
                });
            }

            if (regProduct) {
                await tx.hms_product.update({
                    where: { id: regProduct.id },
                    data: { price: feeAmount, is_service: true, is_stockable: false, updated_at: new Date() }
                });
            } else {
                // Create if missing
                regProduct = await tx.hms_product.create({
                    data: {
                        tenant_id: tenantId,
                        company_id: companyId,
                        name: "Patient Registration Fee",
                        sku: "REG-FEE",
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

            // 2. Manage HMS Settings (Config JSON)
            const configValue = {
                validity: validityDays,
                enableCardIssuance: data.enableCardIssuance,
                fee: feeAmount,
                productId: regProduct.id,
                updatedAt: new Date().toISOString()
            };

            // Use delete + create or find + update to ensure unique constraint [tenant_id, company_id, key]
            const existingConfig = await tx.hms_settings.findFirst({
                where: { tenant_id: tenantId, company_id: companyId, key: 'registration_config' }
            });

            if (existingConfig) {
                await tx.hms_settings.update({
                    where: { id: existingConfig.id },
                    data: { value: configValue as any, updated_at: new Date() }
                });
            } else {
                await tx.hms_settings.create({
                    data: {
                        tenant_id: tenantId,
                        company_id: companyId,
                        key: 'registration_config',
                        value: configValue as any,
                        scope: 'company',
                        created_at: new Date()
                    }
                });
            }

            // 3. Update Patient Registration Fees History (Audit Trail)
            // Deactivate existing for this COMPANY
            await tx.hms_patient_registration_fees.updateMany({
                where: { company_id: companyId, is_active: true },
                data: { is_active: false, updated_at: new Date() }
            });

            // Create new record
            const history = await tx.hms_patient_registration_fees.create({
                data: {
                    tenant_id: tenantId,
                    company_id: companyId,
                    fee_amount: feeAmount,
                    validity_days: validityDays,
                    is_active: true,
                    created_at: new Date()
                }
            });

            return { productId: regProduct.id, historyId: history.id };
        });

        console.log("HMS Settings Saved Successfully", result);

        revalidatePath('/settings/hms');
        return { success: true };

    } catch (error: any) {
        console.error("FATAL ERROR updating HMS settings:", error);
        return { error: `System Error: ${error.message || "Unknown error during transaction"}` };
    }
}

export async function createBranch(data: {
    name: string;
    code: string;
    type: string;
    phone?: string;
    email?: string;
    address?: string;
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
        where: { id, tenant_id: session.user.tenantId }
    });
}

export async function updateDesignation(id: string, data: {
    name: string;
    description?: string;
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


