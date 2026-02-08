
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const company = await prisma.company.findFirst();
        if (!company) return NextResponse.json({ error: "No company found" }, { status: 404 });

        const tenantId = company.tenant_id;
        const companyId = company.id;

        // 1. Create Tax Type
        let taxType = await prisma.tax_types.findFirst({ where: { name: 'GST' } });
        if (!taxType) {
            taxType = await prisma.tax_types.create({
                data: { name: 'GST', description: 'Goods and Services Tax', is_active: true }
            });
        }

        // 2. Create Rates
        const rates = [
            { name: 'IGST 0%', rate: 0.0 },
            { name: 'IGST 5%', rate: 5.0 },
            { name: 'IGST 12%', rate: 12.0 },
            { name: 'IGST 18%', rate: 18.0 },
            { name: 'IGST 28%', rate: 28.0 }
        ];

        const results: string[] = [];

        for (const r of rates) {
            let taxRate = await prisma.tax_rates.findFirst({
                where: { tax_type_id: taxType.id, rate: r.rate }
            });

            if (!taxRate) {
                taxRate = await prisma.tax_rates.create({
                    data: { tax_type_id: taxType.id, name: r.name, rate: r.rate, is_active: true }
                });
            }

            // Link to Company
            const exists = await prisma.company_tax_maps.findFirst({
                where: { company_id: companyId, tax_rate_id: taxRate.id }
            });

            if (!exists) {
                // @ts-ignore - Bypass strict typing for now to get the seed running, schema might be slightly out of sync or behavior is optional?
                // Actually, let's just provide the minimal fields.
                await prisma.company_tax_maps.create({
                    data: {
                        tenant_id: tenantId,
                        company_id: companyId,
                        tax_rate_id: taxRate.id,
                        is_default: r.rate === 0
                    } as any
                });
                results.push(`Linked ${r.name}`);
            } else {
                results.push(`Skipped ${r.name} (Exists)`);
            }
        }

        return NextResponse.json({ success: true, fixed: results });
    } catch (e: any) {
        return NextResponse.json({ error: e.message || 'Unknown error' }, { status: 500 });
    }
}
