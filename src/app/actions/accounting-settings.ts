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
            default_sale_tax_id,
            // New Fields
            ap_account_id,
            purchase_account_id,
            input_tax_account_id,
            fiscal_year_start,
            fiscal_year_end,
            currency_precision,
            rounding_method
        } = data;

        // Upsert settings for this company
        await prisma.company_accounting_settings.upsert({
            where: { company_id: session.user.companyId },
            create: {
                tenant_id: session.user.tenantId!,
                company_id: session.user.companyId!,

                // Sales
                ar_account_id: ar_account_id || null,
                sales_account_id: sales_account_id || null,
                output_tax_account_id: output_tax_account_id || null,
                default_sale_tax_id: default_sale_tax_id || null,

                // Purchasing
                ap_account_id: ap_account_id || null,
                purchase_account_id: purchase_account_id || null,
                input_tax_account_id: input_tax_account_id || null,

                // General
                fiscal_year_start: fiscal_year_start ? new Date(fiscal_year_start) : undefined,
                fiscal_year_end: fiscal_year_end ? new Date(fiscal_year_end) : undefined,
                currency_precision: currency_precision ? parseInt(currency_precision) : 2,
                rounding_method: rounding_method || 'ROUND_HALF_UP'
            },
            update: {
                // Sales
                ar_account_id: ar_account_id || null,
                sales_account_id: sales_account_id || null,
                output_tax_account_id: output_tax_account_id || null,
                default_sale_tax_id: default_sale_tax_id || null,

                // Purchasing
                ap_account_id: ap_account_id || null,
                purchase_account_id: purchase_account_id || null,
                input_tax_account_id: input_tax_account_id || null,

                // General
                fiscal_year_start: fiscal_year_start ? new Date(fiscal_year_start) : undefined,
                fiscal_year_end: fiscal_year_end ? new Date(fiscal_year_end) : undefined,
                currency_precision: currency_precision ? parseInt(currency_precision) : 2,
                rounding_method: rounding_method || 'ROUND_HALF_UP',

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
