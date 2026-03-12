import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const company = await prisma.company.findFirst();
        if (!company) return NextResponse.json({ error: "No company found" });
        const companyId = company.id;

        const customTaxes = await prisma.company_taxes.findMany({
            where: { company_id: companyId, is_active: true },
            select: { id: true, name: true, rate: true }
        });

        const taxMaps = await prisma.company_tax_maps.findMany({
            where: { company_id: companyId, is_active: true },
            include: { tax_rates: { select: { id: true, name: true, rate: true } } }
        });
        const mappedTaxes = taxMaps.map(tm => ({
            id: tm.tax_rates.id,
            name: tm.tax_rates.name,
            rate: Number(tm.tax_rates.rate)
        }));

        const compSettings = await prisma.company_settings.findUnique({
            where: { company_id: companyId }
        });

        const allTaxesMap = new Map();
        [...customTaxes.map(t => ({ ...t, rate: Number(t.rate) })), ...mappedTaxes].forEach(t => {
            allTaxesMap.set(t.id, t);
        });

        let countryTaxesFound = 0;
        let cId = company.country_id;

        if (allTaxesMap.size === 0 || compSettings?.auto_load_taxes_from_country !== false) {
            
            if (cId) {
                const countryTaxes = await prisma.country_tax_mappings.findMany({
                    where: { country_id: cId, is_active: true },
                    include: { tax_rates: true }
                });
                
                countryTaxesFound = countryTaxes.length;
                countryTaxes.forEach(ct => {
                    if (!allTaxesMap.has(ct.tax_rates.id)) {
                        allTaxesMap.set(ct.tax_rates.id, {
                            id: ct.tax_rates.id,
                            name: ct.tax_rates.name,
                            rate: Number(ct.tax_rates.rate)
                        });
                    }
                });
            }
        }

        let allTaxes = Array.from(allTaxesMap.values());

        return NextResponse.json({ 
            success: true, 
            companyId, 
            countryId: cId,
            autoLoad: compSettings?.auto_load_taxes_from_country,
            customTaxesCount: customTaxes.length,
            mappedTaxesCount: mappedTaxes.length,
            countryTaxesFound,
            finalTaxesCount: allTaxes.length,
            taxes: allTaxes
        });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message, stack: error.stack });
    }
}
