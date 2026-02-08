'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function fixTaxConfiguration() {
    try {
        const companies = await prisma.company.findMany();
        if (companies.length === 0) return { success: false, error: "No companies found" };

        const results: string[] = [];

        // Define Rates with dedicated Types to bypass unique constraint
        const rates = [
            { name: 'IGST 0%', rate: 0.0, type: 'GST_0' },
            { name: 'IGST 5%', rate: 5.0, type: 'GST_5' },
            { name: 'IGST 12%', rate: 12.0, type: 'GST_12' },
            { name: 'IGST 18%', rate: 18.0, type: 'GST_18' },
            { name: 'IGST 28%', rate: 28.0, type: 'GST_28' }
        ];

        // 1. Ensure Tax Types and Rates exist globally first
        for (const r of rates) {
            let taxType = await prisma.tax_types.findFirst({ where: { name: r.type } });
            if (!taxType) {
                await prisma.tax_types.create({
                    data: { name: r.type, description: `${r.name} Class`, is_active: true }
                });
            }

            const typeId = (await prisma.tax_types.findFirst({ where: { name: r.type } }))?.id;
            if (!typeId) continue;

            let taxRate = await prisma.tax_rates.findFirst({ where: { tax_type_id: typeId, rate: r.rate } });
            if (!taxRate) {
                await prisma.tax_rates.create({
                    data: { tax_type_id: typeId, name: r.name, rate: r.rate, is_active: true }
                });
            }
        }

        // 2. Loop through ALL companies and link them
        for (const company of companies) {
            results.push(`Processing Company: ${company.name}`);
            const tenantId = company.tenant_id;
            const companyId = company.id;

            for (const r of rates) {
                const typeId = (await prisma.tax_types.findFirst({ where: { name: r.type } }))?.id;
                if (!typeId) continue;

                const taxRate = await prisma.tax_rates.findFirst({ where: { tax_type_id: typeId, rate: r.rate } });
                if (!taxRate) continue;

                // Link to Company
                const exists = await prisma.company_tax_maps.findFirst({
                    where: { company_id: companyId, tax_rate_id: taxRate.id }
                });

                if (!exists) {
                    // @ts-ignore
                    await prisma.company_tax_maps.create({
                        data: {
                            tenant_id: tenantId,
                            company_id: companyId,
                            tax_rate_id: taxRate.id,
                            tax_type_id: typeId, // REQUIRED FIELD
                            is_default: r.rate === 0
                        } as any
                    });
                    results.push(`  + Linked ${r.name}`);
                }
            }
        }

        revalidatePath('/hms/billing');
        revalidatePath('/hms/billing/new');
        return { success: true, message: "Tax configuration fixed.", results };
    } catch (e: any) {
        console.error("Fix Tax Config Error:", e);
        return { success: false, error: e.message || "Unknown error" };
    }
}
