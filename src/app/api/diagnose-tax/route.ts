
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const products = await prisma.hms_product.findMany({
            where: { is_service: false, is_active: true },
            take: 50
        });

        for (const p of products) {
            const line = await prisma.hms_purchase_invoice_line.findFirst({
                where: { product_id: p.id },
                orderBy: { created_at: 'desc' }
            });
            if (line) {
                const invoice = await prisma.hms_purchase_invoice.findUnique({
                    where: { id: line.invoice_id }
                });

                return NextResponse.json({
                    product_name: p.name,
                    invoice_status: invoice?.status,
                    line_tax: line.tax
                });
            }
        }
        return NextResponse.json({ error: "No purchased items found" });
    } catch (e: any) {
        return NextResponse.json({ error: e.message });
    }
}
