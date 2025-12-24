'use server'

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

export async function getBillableItems() {
    const session = await auth();
    if (!session?.user?.companyId) return { error: "Unauthorized" };

    try {
        const items = await prisma.hms_product.findMany({
            where: {
                tenant_id: session.user.tenantId,
                company_id: session.user.companyId,
                is_active: true
                // Removed is_service filter - show all products (pharmacy + services)
            },
            select: {
                id: true,
                sku: true,
                name: true,
                description: true,
                uom: true,
                price: true, // Fetch base price
                metadata: true, // Include metadata for purchase_tax_rate
                // We'll need to join with price history to get current price
                hms_product_price_history: {
                    orderBy: { valid_from: 'desc' },
                    take: 1,
                    select: { price: true }
                },
                hms_product_category_rel: {
                    include: {
                        hms_product_category: {
                            include: {
                                tax_rates: true
                            }
                        }
                    }
                }
            }
        });

        // Flatten price for easier consumption
        const flatItems = items.map(item => {
            const priceHistory = item.hms_product_price_history?.[0];
            const categoryRel = item.hms_product_category_rel?.[0];
            const category = categoryRel?.hms_product_category;
            const taxRate = category?.tax_rates;

            // Extract UOM pricing data from metadata
            const metadata = item.metadata as any || {};
            const uomData = metadata.uom_data || {};

            return {
                id: item.id,
                sku: item.sku || '',
                label: item.name, // UI friendly
                description: item.description || '',
                uom: item.uom || 'Unit',
                price: priceHistory?.price?.toNumber() || Number(item.price) || 0,
                metadata: {
                    ...metadata,
                    // UOM Pricing (Industry Standard)
                    baseUom: uomData.base_uom || 'PCS',
                    basePrice: uomData.base_price || Number(item.price) || 0,
                    conversionFactor: uomData.conversion_factor || 1,
                    packUom: uomData.pack_uom || 'PCS',
                    packPrice: uomData.pack_price || (Number(item.price) * (uomData.conversion_factor || 1)),
                    packSize: uomData.pack_size || 1
                },
                // Extract category tax for auto-suggest
                categoryTaxId: category?.default_tax_rate_id || null,
                categoryTaxRate: taxRate?.rate ? taxRate.rate.toNumber() : 0
            };
        });

        return { success: true, data: flatItems };
    } catch (error) {
        console.error("Failed to fetch billable items:", error);
        return { error: "Failed to fetch items" };
    }
}

export async function getTaxConfiguration() {
    const session = await auth();
    if (!session?.user?.companyId) return { error: "Unauthorized" };

    try {
        // 1. Fetch Company Tax Maps
        const taxMaps = await prisma.company_tax_maps.findMany({
            where: {
                company_id: session.user.companyId,
                is_active: true
            },
            include: {
                tax_rates: true
            }
        });

        // 2. Identify Default and Active Rates
        const defaultMap = taxMaps.find(m => m.is_default);

        // Map to simpler structure
        const taxRates = taxMaps.map(m => ({
            id: m.tax_rate_id,
            name: m.tax_rates.name,
            rate: m.tax_rates.rate.toNumber(),
            isDefault: m.is_default
        }));

        return {
            success: true,
            data: {
                defaultTax: defaultMap ? {
                    id: defaultMap.tax_rate_id,
                    name: defaultMap.tax_rates.name,
                    rate: defaultMap.tax_rates.rate.toNumber()
                } : null,
                taxRates
            }
        };

    } catch (error) {
        console.error("Failed to fetch tax configuration:", error);
        return { error: "Failed to fetch taxes" };
    }
}

export async function createInvoice(data: any) {
    const session = await auth();
    if (!session?.user?.companyId) return { error: "Unauthorized" };

    const { patient_id, appointment_id, date, line_items, status = 'draft', total_discount = 0 } = data;

    if (!line_items || line_items.length === 0) {
        return { error: "At least one line item is required" };
    }

    try {
        // Generate human-readable invoice number (Simple timestamp based for MVP, can be sequence based)
        const invoiceNo = `INV-${Date.now().toString().slice(-6)}`;

        // Calculate totals
        // Subtotal (Sum of [Qty * Price - Discount])
        const subtotal = line_items.reduce((sum: number, item: any) => sum + ((item.quantity * item.unit_price) - (item.discount_amount || 0)), 0);

        // Tax Total (Sum of line item taxes)
        const totalTaxAmount = line_items.reduce((sum: number, item: any) => sum + (Number(item.tax_amount || 0)), 0);

        // Grand Total: Subtotal + Tax - Global Discount
        const total = Math.max(0, subtotal + totalTaxAmount - Number(total_discount || 0));

        // DEBUG: Check Triggers
        try {
            const triggers = await prisma.$queryRaw`SELECT trigger_name, event_manipulation, event_object_table FROM information_schema.triggers WHERE event_object_table IN ('hms_invoice', 'hms_invoice_lines')`;
            console.log("DEBUG: Active Triggers on Invoice/Lines:", triggers);
        } catch (e) {
            console.error("DEBUG: Failed to check triggers", e);
        }

        const invoicePayload = {
            tenant_id: session.user.tenantId!,
            company_id: session.user.companyId!,
            patient_id: (patient_id as string) || null,
            appointment_id: (appointment_id as string) || null,
            invoice_number: invoiceNo,
            invoice_date: new Date(date),
            currency: 'INR', // Indian Rupee
            status: status as any, // 'draft', 'posted', or 'paid'
            total: total,
            subtotal: subtotal,
            total_tax: totalTaxAmount,
            total_discount: Number(total_discount),
            outstanding_amount: (status === 'posted') ? total : 0,
            hms_invoice_lines: {
                create: line_items.map((item: any, index: number) => ({
                    tenant_id: session.user.tenantId,
                    company_id: session.user.companyId,
                    line_idx: index + 1,
                    product_id: item.product_id || null, // Convert empty string to null
                    description: item.description,
                    quantity: item.quantity,
                    unit_price: item.unit_price,
                    net_amount: (item.quantity * item.unit_price) - (item.discount_amount || 0),
                    // Tax details
                    tax_rate_id: item.tax_rate_id || null, // Convert empty string to null
                    tax_amount: item.tax_amount || 0,
                    discount_amount: item.discount_amount || 0
                }))
            }
        };
        console.log("DEBUG PAYLOAD:", JSON.stringify(invoicePayload, null, 2));

        const result = await prisma.$transaction(async (tx) => {
            const newInvoice = await tx.hms_invoice.create({
                data: invoicePayload as any
            });

            // If status is paid and appointment is linked, mark appointment as completed
            if (status === 'paid' && appointment_id) {
                await tx.hms_appointments.update({
                    where: { id: appointment_id },
                    data: { status: 'completed' }
                });
            }

            return newInvoice;
        });

        revalidatePath('/hms/billing');
        return { success: true, data: result };

    } catch (error: any) {
        console.error("Failed to create invoice:", error);
        let triggersInfo = '';
        try {
            const triggers = await prisma.$queryRaw`SELECT trigger_name, event_manipulation, event_object_table FROM information_schema.triggers WHERE event_object_table IN ('hms_invoice', 'hms_invoice_lines')`;
            triggersInfo = JSON.stringify(triggers);
        } catch (e) { triggersInfo = 'Check failed'; }

        return { error: `Failed to create invoice: ${error.message}. DB Triggers: ${triggersInfo}` }
    }
}
