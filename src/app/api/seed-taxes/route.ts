
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const company = await prisma.company.findFirst();
        if (!company) return NextResponse.json({ error: "No company found" }, { status: 404 });

        const tenantId = company.tenant_id;
        const companyId = company.id;

        const results: string[] = [];

        // Define Rates with dedicated Types to bypass unique constraint [company_id, tax_type_id]
        const rates = [
            { name: 'IGST 0%', rate: 0.0, type: 'GST_0' }, // Use dedicated types
            { name: 'IGST 5%', rate: 5.0, type: 'GST_5' },
            { name: 'IGST 12%', rate: 12.0, type: 'GST_12' },
            { name: 'IGST 18%', rate: 18.0, type: 'GST_18' },
            { name: 'IGST 28%', rate: 28.0, type: 'GST_28' }
        ];

        for (const r of rates) {
            // 1. Create/Find Tax Type
            let taxType = await prisma.tax_types.findFirst({ where: { name: r.type } });
            if (!taxType) {
                taxType = await prisma.tax_types.create({
                    data: { name: r.type, description: `${r.name} Class`, is_active: true }
                });
            }

            // 2. Create/Find Tax Rate
            let taxRate = await prisma.tax_rates.findFirst({
                where: { tax_type_id: taxType.id, rate: r.rate }
            });

            if (!taxRate) {
                taxRate = await prisma.tax_rates.create({
                    data: { tax_type_id: taxType.id, name: r.name, rate: r.rate, is_active: true }
                });
            }

            // 3. Link to Company (company_tax_maps)
            // Note: Schema requires tax_type_id in company_tax_maps
            const exists = await prisma.company_tax_maps.findFirst({
                where: { company_id: companyId, tax_rate_id: taxRate.id }
            });

            if (!exists) {
                // @ts-ignore - Bypass strict typing for missing optional fields
                await prisma.company_tax_maps.create({
                    data: {
                        tenant_id: tenantId,
                        company_id: companyId,
                        tax_rate_id: taxRate.id,
                        tax_type_id: taxType.id, // REQUIRED FIELD
                        is_default: r.rate === 0
                    } as any
                });
                results.push(`Linked ${r.name} (Type: ${r.type})`);
            } else {
                results.push(`Skipped ${r.name} (Exists)`);
            }
        }

        return NextResponse.json({ success: true, fixed: results });
    } catch (e: any) {
        return NextResponse.json({ error: e.message || 'Unknown error', stack: e.stack }, { status: 500 });
    }
}
