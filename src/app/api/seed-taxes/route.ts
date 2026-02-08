
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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
            { name: 'GST 0%', rate: 0.0 },
            { name: 'GST 5%', rate: 5.0 },
            { name: 'GST 12%', rate: 12.0 },
            { name: 'GST 18%', rate: 18.0 },
            { name: 'GST 28%', rate: 28.0 }
        ];

        const results = [];

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
                await prisma.company_tax_maps.create({
                    data: { tenant_id: tenantId, company_id: companyId, tax_rate_id: taxRate.id, is_default: r.rate === 0 }
                });
                results.push(`Linked ${r.name}`);
            } else {
                results.push(`Skipped ${r.name} (Exists)`);
            }
        }

        return NextResponse.json({ success: true, fixed: results });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
