import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const company = await prisma.company.findFirst();
        if (!company) return NextResponse.json({ error: "No company found" });
        const companyId = company.id;

        const results: any = {
            companyId,
            countryId: company.country_id,
        };

        const { ensureGlobalTaxes } = await import("@/lib/services/tax-seed");
        const seedResult = await ensureGlobalTaxes();

        const [
            taxRatesCount,
            activeTaxRatesCount,
            countryTaxMappingsCount,
            activeCountryTaxMappingsCount,
            sampleTaxRates
        ] = await Promise.all([
            prisma.tax_rates.count(),
            prisma.tax_rates.count({ where: { is_active: true } }),
            prisma.country_tax_mappings.count(),
            prisma.country_tax_mappings.count({ where: { is_active: true } }),
            prisma.tax_rates.findMany({ take: 5 })
        ]);

        results.seedResult = seedResult;
        results.counts = {
            taxRatesCount,
            activeTaxRatesCount,
            countryTaxMappingsCount,
            activeCountryTaxMappingsCount
        };
        results.sampleTaxRates = sampleTaxRates;

        if (company.country_id) {
            results.companyCountryMappings = await prisma.country_tax_mappings.findMany({
                where: { country_id: company.country_id },
                include: { tax_rates: true }
            });
        }

        return NextResponse.json({ success: true, results });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message, stack: error.stack });
    }
}
