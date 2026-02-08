'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { randomUUID } from "crypto"

export async function fixTaxConfiguration() {
    try {
        const companies = await prisma.company.findMany();
        if (companies.length === 0) return { success: false, error: "No companies found" };

        const logs: string[] = [];

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
                try {
                    // Check if schema requires any other mandatory fields by just creating with ID
                    taxType = await prisma.tax_types.create({
                        data: {
                            id: randomUUID(),
                            name: r.type,
                            description: `${r.name} Class`,
                            is_active: true
                        }
                    });
                    logs.push(`Created Tax Type: ${r.type}`);
                } catch (err: any) {
                    console.error(`Failed to create tax_type ${r.type}:`, err);
                    throw new Error(`Failed to create Tax Type ${r.type}: ${err.message}`);
                }
            }

            // Ensure we have the ID (create returns it, but findFirst might need refresh if race condition)
            const typeId = taxType.id;

            let taxRate = await prisma.tax_rates.findFirst({ where: { tax_type_id: typeId, rate: r.rate } });
            if (!taxRate) {
                try {
                    taxRate = await prisma.tax_rates.create({
                        data: {
                            id: randomUUID(),
                            tax_type_id: typeId,
                            name: r.name,
                            rate: r.rate,
                            is_active: true
                        }
                    });
                    logs.push(`Created Tax Rate: ${r.name}`);
                } catch (err: any) {
                    console.error(`Failed to create tax_rate ${r.name}:`, err);
                    throw new Error(`Failed to create Tax Rate ${r.name}: ${err.message}`);
                }
            }
        }

        // 2. Loop through ALL companies and link them
        for (const company of companies) {
            logs.push(`Processing Company: ${company.name}`);
            const tenantId = company.tenant_id;
            const companyId = company.id;

            for (const r of rates) {
                const taxType = await prisma.tax_types.findFirst({ where: { name: r.type } });
                if (!taxType) continue;

                const taxRate = await prisma.tax_rates.findFirst({ where: { tax_type_id: taxType.id, rate: r.rate } });
                if (!taxRate) continue;

                // Link to Company
                const exists = await prisma.company_tax_maps.findFirst({
                    where: { company_id: companyId, tax_rate_id: taxRate.id }
                });

                if (!exists) {
                    try {
                        // @ts-ignore
                        await prisma.company_tax_maps.create({
                            data: {
                                id: randomUUID(),
                                tenant_id: tenantId,
                                company_id: companyId,
                                tax_rate_id: taxRate.id,
                                tax_type_id: taxType.id, // REQUIRED FIELD based on previous error
                                is_default: r.rate === 0
                            } as any
                        });
                        logs.push(`  + Linked ${r.name}`);
                    } catch (err: any) {
                        console.error(`Failed to link ${r.name} to company ${company.name}:`, err);
                        // Continue to next rate instead of crashing entire process
                        logs.push(`  ! Failed to link ${r.name}: ${err.message}`);
                    }
                } else {
                    logs.push(`  . Skipped ${r.name} (Exists)`);
                }
            }
        }

        revalidatePath('/hms/billing');
        revalidatePath('/hms/billing/new');
        return { success: true, message: "Tax configuration fixed.", logs };
    } catch (e: any) {
        console.error("Fix Tax Config Error:", e);
        return { success: false, error: e.message || "Unknown error" };
    }
}
