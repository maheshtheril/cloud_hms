'use server'

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

export async function updateAccountingSettings(data: any) {
    const session = await auth();
    if (!session?.user?.companyId) return { error: "Unauthorized" };

    try {
        const {
            ar_account_id,
            sales_account_id,
            output_tax_account_id,
            default_sale_tax_id
        } = data;

        // Upsert settings for this company
        await prisma.company_accounting_settings.upsert({
            where: { company_id: session.user.companyId },
            create: {
                tenant_id: session.user.tenantId!,
                company_id: session.user.companyId!,
                ar_account_id: ar_account_id || null,
                sales_account_id: sales_account_id || null,
                output_tax_account_id: output_tax_account_id || null,
                default_sale_tax_id: default_sale_tax_id || null,
                // Defaults
                currency_precision: 2,
                rounding_method: 'ROUND_HALF_UP'
            },
            update: {
                ar_account_id: ar_account_id || null,
                sales_account_id: sales_account_id || null,
                output_tax_account_id: output_tax_account_id || null,
                default_sale_tax_id: default_sale_tax_id || null,
                updated_at: new Date()
            }
        });

        revalidatePath('/settings/accounting');
        return { success: true, message: "Accounting settings saved successfully." };

    } catch (error: any) {
        console.error("Failed to update accounting settings:", error);
        return { error: error.message || "Failed to save settings." };
    }
}
