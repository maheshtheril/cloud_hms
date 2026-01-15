"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function upsertPurchaseInvoice(data: any) {
    try {
        const session = await auth();
        if (!session?.user) throw new Error("Unauthorized");

        const tenantId = session.user.tenantId;
        const companyId = session.user.companyId;

        if (!tenantId || !companyId) throw new Error("Missing tenant or company ID");

        return await prisma.$transaction(async (tx) => {
            const invoiceData = {
                tenant_id: tenantId,
                company_id: companyId,
                supplier_id: data.supplierId,
                name: data.invoiceNumber,
                invoice_date: data.invoiceDate ? new Date(data.invoiceDate) : new Date(),
                due_date: data.dueDate ? new Date(data.dueDate) : null,
                currency: data.currency || "INR",
                total_amount: data.totalAmount,
                subtotal: data.subtotal,
                tax_total: data.taxTotal,
                status: data.status || "draft",
                metadata: data.metadata || {},
                attachments: data.attachments || {},
            };

            let invoice;
            if (data.id) {
                // Update existing
                invoice = await tx.hms_purchase_invoice.update({
                    where: { id: data.id },
                    data: {
                        ...invoiceData,
                        hms_purchase_invoice_line: {
                            deleteMany: {},
                            create: data.items.map((item: any) => ({
                                tenant_id: tenantId,
                                company_id: companyId,
                                product_id: item.productId,
                                description: item.description,
                                qty: item.qty,
                                unit_price: item.unitPrice,
                                line_total: item.lineTotal,
                                tax: {
                                    id: item.taxId || null,
                                    rate: item.taxRate || 0
                                },
                                metadata: item.metadata || {},
                            })),
                        },
                    },
                });
            } else {
                // Create new
                invoice = await tx.hms_purchase_invoice.create({
                    data: {
                        ...invoiceData,
                        hms_purchase_invoice_line: {
                            create: data.items.map((item: any) => ({
                                tenant_id: tenantId,
                                company_id: companyId,
                                product_id: item.productId,
                                description: item.description,
                                qty: item.qty,
                                unit_price: item.unitPrice,
                                line_total: item.lineTotal,
                                tax: {
                                    id: item.taxId || null,
                                    rate: item.taxRate || 0
                                },
                                metadata: item.metadata || {},
                            })),
                        },
                    },
                });
            }

            revalidatePath("/hms/accounting/bills");
            return { success: true, data: invoice };
        });
    } catch (error: any) {
        console.error("Purchase Invoice Error:", error);
        return { success: false, error: error.message };
    }
}

export async function getPurchaseInvoices() {
    try {
        const session = await auth();
        if (!session?.user) throw new Error("Unauthorized");

        return await prisma.hms_purchase_invoice.findMany({
            where: {
                tenant_id: (session.user as any).tenantId,
                company_id: (session.user as any).companyId,
            },
            include: {
                // hms_supplier: true, // If relation exists
                hms_purchase_invoice_line: true,
            },
            orderBy: {
                created_at: "desc",
            },
        });
    } catch (error: any) {
        console.error("Fetch Purchase Invoices Error:", error);
        return [];
    }
}
