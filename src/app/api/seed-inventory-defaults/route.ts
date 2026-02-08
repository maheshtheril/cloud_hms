
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function GET() {
    try {
        const logs: string[] = [];

        // 1. Seed UOMs
        const defaultUOMs = ['PCS', 'BOX', 'KG', 'LTR', 'MTR', 'NOS', 'STRIP', 'TAB', 'PACK', 'DOSE', 'mg', 'ml', 'gm'];

        // Find existing UOMs to avoid duplicates
        const existingUOMs = await prisma.hms_uom.findMany();
        const existingNames = new Set(existingUOMs.map(u => u.name.toUpperCase()));

        for (const u of defaultUOMs) {
            if (!existingNames.has(u.toUpperCase())) {
                try {
                    await prisma.hms_uom.create({
                        data: {
                            id: crypto.randomUUID(),
                            name: u,
                            code: u,
                            description: `Standard UOM ${u}`,
                            is_active: true,
                            tenant_id: existingUOMs[0]?.tenant_id || '00000000-0000-0000-0000-000000000000', // Fallback
                            company_id: existingUOMs[0]?.company_id || '00000000-0000-0000-0000-000000000000'
                        } as any
                    });
                    logs.push(`Biult UOM: ${u}`);
                } catch (e: any) {
                    // Try without tenant if it fails (maybe global model)
                    try {
                        await prisma.hms_uom.create({
                            data: {
                                id: crypto.randomUUID(),
                                name: u,
                                code: u,
                                is_active: true
                            } as any
                        });
                        logs.push(`Built UOM (Global): ${u}`);
                    } catch (e2: any) {
                        logs.push(`Failed UOM ${u}: ${e2.message}`);
                    }
                }
            }
        }

        // 2. Seed Tax Rates (Standard GST)
        // Only if no rates exist or very few
        const rates = [
            { name: 'GST 0%', rate: 0.0, type: 'GST_0' },
            { name: 'GST 5%', rate: 5.0, type: 'GST_5' },
            { name: 'GST 12%', rate: 12.0, type: 'GST_12' },
            { name: 'GST 18%', rate: 18.0, type: 'GST_18' },
            { name: 'GST 28%', rate: 28.0, type: 'GST_28' }
        ];

        // Fetch first company to get tenant Ids
        const company = await prisma.company.findFirst();

        if (company) {
            for (const r of rates) {
                // Ensure Type
                let type = await prisma.tax_types.findFirst({ where: { name: r.type } });
                if (!type) {
                    try {
                        type = await prisma.tax_types.create({
                            data: {
                                id: crypto.randomUUID(),
                                name: r.type,
                                description: `Standard ${r.name}`,
                                is_active: true
                            }
                        });
                    } catch (e) { }
                }

                if (type) {
                    // Ensure Rate
                    let rateRow = await prisma.tax_rates.findFirst({ where: { tax_type_id: type.id, rate: r.rate } });
                    if (!rateRow) {
                        rateRow = await prisma.tax_rates.create({
                            data: {
                                id: crypto.randomUUID(),
                                tax_type_id: type.id,
                                name: r.name,
                                rate: r.rate,
                                is_active: true
                            }
                        });
                        logs.push(`Created Rate: ${r.name}`);
                    }

                    // Map to Company
                    const map = await prisma.company_tax_maps.findFirst({ where: { company_id: company.id, tax_rate_id: rateRow.id } });
                    if (!map) {
                        await prisma.company_tax_maps.create({
                            data: {
                                id: crypto.randomUUID(),
                                tenant_id: company.tenant_id,
                                company_id: company.id,
                                tax_type_id: type.id,
                                tax_rate_id: rateRow.id,
                                is_default: r.rate === 0
                            } as any
                        });
                        logs.push(`Mapped ${r.name} to Company`);
                    }
                }
            }
        }

        return NextResponse.json({ success: true, logs });
    } catch (e: any) {
        return NextResponse.json({ error: e.message });
    }
}
