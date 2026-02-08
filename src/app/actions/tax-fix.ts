'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { randomUUID } from "crypto"

export async function fixTaxConfiguration() {
    try {
        const companies = await prisma.company.findMany();
        if (companies.length === 0) return { success: false, error: "No companies found" };

        const logs: string[] = [];

        // DIAGNOSTIC: Check columns of tax_types table
        try {
            const columns = await prisma.$queryRaw`
                SELECT column_name, is_nullable, data_type 
                FROM information_schema.columns 
                WHERE table_name = 'tax_types';
            `;
            console.log("Tax Types Table Schema:", JSON.stringify(columns));
            logs.push("Schema Check: " + JSON.stringify(columns));
        } catch (e) {
            console.error("Failed to check schema:", e);
        }

        const rates = [
            { name: 'IGST 0%', rate: 0.0, type: 'GST_0' },
            { name: 'IGST 5%', rate: 5.0, type: 'GST_5' },
            { name: 'IGST 12%', rate: 12.0, type: 'GST_12' },
            { name: 'IGST 18%', rate: 18.0, type: 'GST_18' },
            { name: 'IGST 28%', rate: 28.0, type: 'GST_28' }
        ];

        for (const r of rates) {
            let taxType = await prisma.tax_types.findFirst({ where: { name: r.type } });
            if (!taxType) {
                try {
                    // Try creating with additional plausible fields if schema reveals them
                    // For now, retry with just standard fields + ID
                    const typeData: any = {
                        id: randomUUID(),
                        name: r.type,
                        description: `${r.name} Class`,
                        is_active: true
                    };

                    taxType = await prisma.tax_types.create({ data: typeData });
                    logs.push(`Created Tax Type: ${r.type}`);
                } catch (err: any) {
                    console.error(`Failed to create tax_type ${r.type}:`, err);
                    throw new Error(`Failed to create Tax Type ${r.type}: ${err.message}`);
                }
            }

            const typeId = taxType.id;

            let taxRate = await prisma.tax_rates.findFirst({ where: { tax_type_id: typeId, rate: r.rate } });
            if (!taxRate) {
                try {
                    const rateData: any = {
                        id: randomUUID(),
                        tax_type_id: typeId,
                        name: r.name,
                        rate: r.rate,
                        is_active: true
                    };
                    taxRate = await prisma.tax_rates.create({ data: rateData });
                    logs.push(`Created Tax Rate: ${r.name}`);
                } catch (err: any) {
                    console.error(`Failed to create tax_rate ${r.name}:`, err);
                    throw new Error(`Failed to create Tax Rate ${r.name}: ${err.message}`);
                }
            }

            // Link to All Companies
            for (const company of companies) {
                const tenantId = company.tenant_id;
                const companyId = company.id;

                const exists = await prisma.company_tax_maps.findFirst({
                    where: { company_id: companyId, tax_rate_id: taxRate.id }
                });

                if (!exists) {
                    try {
                        const defaultMapData: any = {
                            id: randomUUID(),
                            tenant_id: tenantId,
                            company_id: companyId,
                            tax_rate_id: taxRate.id,
                            is_default: r.rate === 0,
                            tax_type_id: typeId // Force include based on diagnostic
                        };

                        // @ts-ignore
                        await prisma.company_tax_maps.create({ data: defaultMapData });
                        logs.push(`  + Linked ${r.name} to ${company.name}`);
                    } catch (err: any) {
                        console.error(`Failed to link ${r.name} to company ${company.name}:`, err);
                        logs.push(`  ! Failed to link ${r.name}: ${err.message}`);
                    }
                }
            }
        }

        revalidatePath('/hms/billing');
        return { success: true, message: "Tax configuration fixed.", logs };
    } catch (e: any) {
        console.error("Fix Tax Config Error:", e);
        return { success: false, error: e.message || "Unknown error" };
    }
}
