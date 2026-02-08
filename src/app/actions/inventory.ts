'use server'

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import crypto from 'crypto';
import { receiveStock } from "@/app/actions/inventory-operations";

// --- Dashboard Stats ---

export async function getInventoryDashboardStats() {
    const session = await auth();
    if (!session?.user?.companyId) return { error: "Unauthorized" };

    try {
        const companyId = session.user.companyId;

        // 1. Total Products
        const totalProducts = await prisma.hms_product.count({
            where: { company_id: companyId, is_active: true }
        });

        // 2. Low Stock Alerts (Concept: stock < 10)
        // Since stock is in hms_stock_levels, we need to aggregate.
        // For simplicity in this version, we will check products that have any stock level entry < 10
        // A better approach would be to have 'min_stock_level' on the product itself.
        // Let's assume a global threshold of 10 for now.
        const lowStockCount = await prisma.hms_stock_levels.count({
            where: {
                company_id: companyId,
                quantity: { lt: 10 }
            }
        });

        // 3. Inventory Value (Sum of Stock * Unit Cost)
        // We'll approximate this by summing hms_stock_ledger current value or
        // by summing stock_levels.quantity * product.price (if cost not available)
        // Let's use hms_stock_levels * product.price (assuming price ~ value for now if cost is missing)
        const stockItems = await prisma.hms_stock_levels.findMany({
            where: { company_id: companyId },
            include: {
                hms_product: {
                    select: { price: true } // Using selling price as proxy if cost is null
                }
            }
        });

        let totalValue = 0;
        stockItems.forEach(item => {
            const qty = Number(item.quantity || 0);
            const price = Number(item.hms_product?.price || 0); // fallback to 0
            totalValue += qty * price;
        });

        // 4. Recent Activity (Stock Moves)
        const recentMoves = await prisma.hms_stock_ledger.findMany({
            where: { company_id: companyId },
            take: 5,
            orderBy: { created_at: 'desc' },
            include: {
                hms_product: { select: { name: true, sku: true } }
            }
        });

        return {
            success: true,
            data: {
                totalProducts,
                lowStockCount,
                totalValue,
                recentMoves: recentMoves.map(m => ({
                    id: m.id,
                    product: m.hms_product?.name || 'Unknown',
                    sku: m.hms_product?.sku,
                    type: m.movement_type,
                    qty: Number(m.qty),
                    date: m.created_at
                }))
            }
        };

    } catch (error) {
        console.error("Failed to fetch inventory stats:", error);
        return { error: "Failed to load dashboard data" };
    }
}

// --- Product Management ---


// -- Helpers for Dropdowns --

import fs from 'fs';
import path from 'path';

function logDebug(message: string) {
    try {
        const logPath = path.join(process.cwd(), 'inventory_debug.log');
        fs.appendFileSync(logPath, new Date().toISOString() + ': ' + message + '\n');
    } catch (e) {
        // ignore
    }
}

// -- Helpers for Dropdowns --

export async function getSuppliers() {
    const session = await auth();

    // Debug logging
    logDebug(`getSuppliers: companyId=${session?.user?.companyId}, tenantId=${session?.user?.tenantId}`);

    if (!session?.user?.companyId) return [];

    try {
        let suppliers = await prisma.hms_supplier.findMany({
            where: {
                company_id: session.user.companyId,
                is_active: true
            },
            select: { id: true, name: true }
        });

        if (suppliers.length === 0) {
            logDebug('getSuppliers: Seeding default supplier');
            if (session.user.tenantId) {
                await prisma.hms_supplier.create({
                    data: {
                        tenant_id: session.user.tenantId,
                        company_id: session.user.companyId,
                        name: 'General Vendor',
                        is_active: true
                    }
                });
                suppliers = await prisma.hms_supplier.findMany({
                    where: { company_id: session.user.companyId, is_active: true },
                    select: { id: true, name: true }
                });
            } else {
                logDebug('getSuppliers: Missing tenantId, cannot seed');
            }
        }
        return suppliers;
    } catch (error) {
        logDebug(`getSuppliers Error: ${error}`);
        console.error("Failed to fetch suppliers:", error);
        return [];
    }
}

export async function getTaxRates() {
    const session = await auth();
    logDebug(`getTaxRates: companyId=${session?.user?.companyId}`);

    if (!session?.user?.companyId) return [];

    try {
        const companyId = session.user.companyId;

        // 1. Fetch Company Specific Taxes (Custom Definition)
        const customTaxes = await prisma.company_taxes.findMany({
            where: { company_id: companyId, is_active: true },
            select: { id: true, name: true, rate: true }
        });

        // 2. Fetch Global Mapped Taxes (Map Table)
        const taxMaps = await prisma.company_tax_maps.findMany({
            where: {
                company_id: companyId,
                is_active: true
            },
            include: {
                tax_rates: {
                    select: { id: true, name: true, rate: true }
                }
            }
        });
        const mappedTaxes = taxMaps.map(tm => ({
            id: tm.tax_rates.id,
            name: tm.tax_rates.name,
            rate: Number(tm.tax_rates.rate)
        }));

        // 3. Fetch Accounting Settings Defaults (Company Settings)
        const settings = await prisma.company_accounting_settings.findFirst({
            where: { company_id: companyId },
            include: {
                tax_rates_company_accounting_settings_default_sale_tax_idTotax_rates: true,
                tax_rates_company_accounting_settings_default_purchase_tax_idTotax_rates: true
            }
        });

        const settingTaxes = [];
        if (settings?.tax_rates_company_accounting_settings_default_sale_tax_idTotax_rates) {
            const t = settings.tax_rates_company_accounting_settings_default_sale_tax_idTotax_rates;
            settingTaxes.push({ id: t.id, name: t.name, rate: Number(t.rate) });
        }
        if (settings?.tax_rates_company_accounting_settings_default_purchase_tax_idTotax_rates) {
            const t = settings.tax_rates_company_accounting_settings_default_purchase_tax_idTotax_rates;
            settingTaxes.push({ id: t.id, name: t.name, rate: Number(t.rate) });
        }

        // Combine and Deduplicate
        const allTaxesMap = new Map();
        [...customTaxes.map(t => ({ ...t, rate: Number(t.rate) })), ...mappedTaxes, ...settingTaxes].forEach(t => {
            allTaxesMap.set(t.id, t);
        });
        let allTaxes = Array.from(allTaxesMap.values());

        logDebug(`getTaxRates: Found ${allTaxes.length} taxes before seeding`);

        // Seeding if Empty
        if (allTaxes.length === 0) {
            const gstRates = [0, 5, 12, 18, 28];
            const created = [];

            logDebug('getTaxRates: Seeding Standard GST Rates');

            for (const r of gstRates) {
                const typeName = `GST_${r}`;
                // Find or Create Tax Type
                let type = await prisma.tax_types.findFirst({ where: { name: typeName } });
                if (!type) {
                    try {
                        type = await prisma.tax_types.create({
                            data: {
                                name: typeName,
                                description: `IGST ${r}%`,
                                is_active: true
                            }
                        });
                    } catch (e) {
                        console.error(`Failed to create tax type ${typeName}:`, e);
                        continue;
                    }
                }

                if (type) {
                    // Find or Create Rate
                    let rateRow = await prisma.tax_rates.findFirst({ where: { tax_type_id: type.id, rate: r } });
                    if (!rateRow) {
                        rateRow = await prisma.tax_rates.create({
                            data: {
                                tax_type_id: type.id,
                                name: `GST ${r}%`,
                                rate: r,
                                is_active: true
                            }
                        });
                    }

                    // Map to Company
                    try {
                        await prisma.company_tax_maps.create({
                            data: {
                                tenant_id: session.user.tenantId,
                                company_id: companyId,
                                tax_type_id: type.id,
                                tax_rate_id: rateRow.id,
                                is_default: r === 0
                            }
                        });
                    } catch (e) {
                        // Ignore duplicate mapping error
                    }

                    created.push({ id: rateRow.id, name: rateRow.name, rate: r });
                }
            }
            return created;
        }

        return allTaxes;

    } catch (error) {
        logDebug(`getTaxRates Error: ${error}`);
        console.error("Failed to fetch tax rates:", error);

        // Return a mock fallback to prove UI works if DB fails
        return [{ id: 'fallback-error', name: 'System Error Tax', rate: 0 }];
    }
}


export async function getUOMs() {
    const session = await auth();
    logDebug(`getUOMs: companyId=${session?.user?.companyId}`);

    if (!session?.user?.companyId || !session?.user?.tenantId) return [];

    try {
        let uoms = await prisma.hms_uom.findMany({
            where: { company_id: session.user.companyId, is_active: true },
            orderBy: { name: 'asc' },
            select: { id: true, name: true, category_id: true, ratio: true, uom_type: true }
        });

        // Enrich if we have very few UOMs (e.g. only 'Each')
        if (uoms.length < 10) {
            logDebug('getUOMs: Count is low (<10), ensuring comprehensive defaults exist');

            const standardCategories = [
                {
                    name: 'Unit',
                    uoms: [
                        { name: 'Each', type: 'reference', ratio: 1 },
                        { name: 'Dozen', type: 'bigger', ratio: 12 },
                        { name: 'Box', type: 'bigger', ratio: 10 }
                    ]
                },
                {
                    name: 'Weight',
                    uoms: [
                        { name: 'kg', type: 'reference', ratio: 1 },
                        { name: 'g', type: 'smaller', ratio: 0.001 },
                        { name: 'mg', type: 'smaller', ratio: 0.000001 },
                        { name: 'lb', type: 'smaller', ratio: 0.453592 }
                    ]
                },
                {
                    name: 'Volume',
                    uoms: [
                        { name: 'L', type: 'reference', ratio: 1 },
                        { name: 'ml', type: 'smaller', ratio: 0.001 }
                    ]
                },
                {
                    name: 'Length',
                    uoms: [
                        { name: 'm', type: 'reference', ratio: 1 },
                        { name: 'cm', type: 'smaller', ratio: 0.01 },
                        { name: 'mm', type: 'smaller', ratio: 0.001 }
                    ]
                }
            ];

            for (const catDef of standardCategories) {
                // Find or Create Category
                let category = await prisma.hms_uom_category.findFirst({
                    where: { company_id: session.user.companyId, name: catDef.name }
                });

                if (!category) {
                    category = await prisma.hms_uom_category.create({
                        data: {
                            tenant_id: session.user.tenantId,
                            company_id: session.user.companyId,
                            name: catDef.name
                        }
                    });
                }

                // Create UOMs
                if (category) {
                    for (const u of catDef.uoms) {
                        // Check if UOM exists
                        const existing = await prisma.hms_uom.findFirst({
                            where: { company_id: session.user.companyId, category_id: category.id, name: u.name }
                        });

                        if (!existing) {
                            await prisma.hms_uom.create({
                                data: {
                                    tenant_id: session.user.tenantId,
                                    company_id: session.user.companyId,
                                    category_id: category.id,
                                    name: u.name,
                                    uom_type: u.type,
                                    ratio: u.ratio
                                }
                            });
                        }
                    }
                }
            }

            // Re-fetch
            uoms = await prisma.hms_uom.findMany({
                where: { company_id: session.user.companyId, is_active: true },
                orderBy: { name: 'asc' },
                select: { id: true, name: true, category_id: true, ratio: true, uom_type: true }
            });
        }
        return uoms;
    } catch (error) {
        logDebug(`getUOMs Error: ${error}`);
        console.error("Failed to fetch UOMs:", error);
        return [];
    }
}

export async function getUOMCategories() {
    const session = await auth();
    if (!session?.user?.companyId) return [];
    try {
        const categories = await prisma.hms_uom_category.findMany({
            where: { company_id: session.user.companyId },
            include: { hms_uom: true }
        });

        if (categories.length === 0 && session.user.tenantId) {
            // Seed defaults
            const defaults = ['Unit', 'Weight', 'Working Time', 'Volume', 'Length'];
            await prisma.hms_uom_category.createMany({
                data: defaults.map(name => ({
                    tenant_id: session.user.tenantId!,
                    company_id: session.user.companyId!,
                    name
                }))
            });
            // Re-fetch
            return await prisma.hms_uom_category.findMany({
                where: { company_id: session.user.companyId },
                include: { hms_uom: true }
            });
        }

        return categories;
    } catch (error) {
        console.error("Failed to fetch UOM categories:", error);
        return [];
    }
}

export async function createUOMCategory(prevState: any, formData: FormData) {
    const session = await auth();
    if (!session?.user?.companyId || !session?.user?.tenantId) return { error: "Unauthorized" };
    const name = formData.get("name") as string;
    if (!name) return { error: "Name is required" };
    try {
        await prisma.hms_uom_category.create({
            data: {
                tenant_id: session.user.tenantId,
                company_id: session.user.companyId,
                name
            }
        });
        revalidatePath('/hms/inventory/uom');
        return { success: true };
    } catch (error) {
        return { error: "Failed to create category" };
    }
}

export async function createUOM(prevState: any, formData: FormData): Promise<{ error: string } | { success: boolean }> {
    const session = await auth();
    if (!session?.user?.companyId || !session?.user?.tenantId) return { error: "Unauthorized" };

    const name = formData.get("name") as string;
    const categoryId = formData.get("categoryId") as string;
    const type = formData.get("type") as string || 'reference';
    const ratio = Number(formData.get("ratio") || 1);

    if (!name || !categoryId) return { error: "Name and Category are required" };

    try {
        // If type is reference, force ratio to 1
        const uomRatio = type === 'reference' ? 1 : ratio;

        await prisma.hms_uom.create({
            data: {
                tenant_id: session.user.tenantId,
                company_id: session.user.companyId,
                category_id: categoryId,
                name,
                uom_type: type,
                ratio: uomRatio
            }
        });
        revalidatePath('/hms/inventory/uom');
        revalidatePath('/hms/inventory/products/new');
        return { success: true };
    } catch (error) {
        console.error("Failed to create UOM:", error);
        return { error: "Failed to create UOM: " + (error as Error).message };
    }
}

export async function getCategories() {
    const session = await auth();
    if (!session?.user?.companyId || !session?.user?.tenantId) return [];
    try {
        let categories = await prisma.hms_product_category.findMany({
            where: { company_id: session.user.companyId },
            select: { id: true, name: true, default_tax_rate_id: true }
        });

        if (categories.length === 0) {
            await prisma.hms_product_category.create({
                data: {
                    tenant_id: session.user.tenantId,
                    company_id: session.user.companyId,
                    name: "General"
                }
            });
            categories = await prisma.hms_product_category.findMany({
                where: { company_id: session.user.companyId },
                select: { id: true, name: true, default_tax_rate_id: true }
            });
        }
        return categories;
    } catch (error) {
        console.error("Failed to fetch categories:", error);
        return [];
    }
}

export async function createCategory(prevState: any, formData: FormData): Promise<{ error: string } | { success: boolean }> {
    const session = await auth();
    if (!session?.user?.companyId || !session?.user?.tenantId) return { error: "Unauthorized" };

    const name = formData.get("name") as string;
    const taxRateId = formData.get("taxRateId") as string;

    if (!name) return { error: "Name is required" };

    try {
        await prisma.hms_product_category.create({
            data: {
                tenant_id: session.user.tenantId,
                company_id: session.user.companyId,
                name,
                default_tax_rate_id: taxRateId || null
            }
        });
        revalidatePath('/hms/inventory/categories');
        revalidatePath('/hms/inventory/products/new');
        return { success: true };
    } catch (error) {
        console.error("Failed to create category:", error);
        return { error: "Failed to create category" };
    }
}

export async function updateCategory(formData: FormData) {
    const session = await auth();
    if (!session?.user?.companyId) return { error: "Unauthorized" };

    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const taxRateId = formData.get("taxRateId") as string;

    if (!id || !name) return { error: "ID and Name are required" };

    try {
        await prisma.hms_product_category.update({
            where: { id, company_id: session.user.companyId },
            data: {
                name,
                default_tax_rate_id: taxRateId || null
            }
        });
        revalidatePath('/hms/inventory/categories');
        revalidatePath('/hms/inventory/products/new');
        return { success: true };
    } catch (error) {
        console.error("Failed to update category:", error);
        return { error: "Failed to update category" };
    }
}

export async function deleteCategory(id: string) {
    const session = await auth();
    if (!session?.user?.companyId) return { error: "Unauthorized" };

    try {
        await prisma.hms_product_category.delete({
            where: { id, company_id: session.user.companyId }
        });
        revalidatePath('/hms/inventory/categories');
        return { success: true };
    } catch (error) {
        console.error("Failed to delete category:", error);
        return { error: "Failed to delete category" };
    }
}

export async function getManufacturers() {
    const session = await auth();
    if (!session?.user?.companyId) return [];
    try {
        return await prisma.hms_manufacturer.findMany({
            where: { company_id: session.user.companyId, is_active: true },
            orderBy: { name: 'asc' },
            select: { id: true, name: true, description: true, website: true }
        });
    } catch (error) {
        console.error("Failed to fetch manufacturers:", error);
        return [];
    }
}

export async function createManufacturer(prevState: any, formData: FormData): Promise<{ error: string } | { success: boolean }> {
    const session = await auth();
    if (!session?.user?.companyId || !session?.user?.tenantId) return { error: "Unauthorized" };

    const name = formData.get("name") as string;
    const website = formData.get("website") as string;
    const description = formData.get("description") as string;

    if (!name) return { error: "Name is required" };

    try {
        await prisma.hms_manufacturer.create({
            data: {
                tenant_id: session.user.tenantId,
                company_id: session.user.companyId,
                name,
                website: website || null,
                description: description || null
            }
        });
        revalidatePath('/hms/inventory/manufacturers');
        revalidatePath('/hms/inventory/products/new');
        revalidatePath('/hms/inventory/products/[id]', 'page');
        return { success: true };
    } catch (error) {
        console.error("Failed to create manufacturer:", error);
        return { error: "Failed to create manufacturer: " + (error as Error).message };
    }
}

export async function updateManufacturer(formData: FormData) {
    const session = await auth();
    if (!session?.user?.companyId) return { error: "Unauthorized" };

    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const website = formData.get("website") as string;
    const description = formData.get("description") as string;

    if (!id || !name) return { error: "ID and Name are required" };

    try {
        await prisma.hms_manufacturer.update({
            where: { id, company_id: session.user.companyId },
            data: { name, website, description }
        });
        revalidatePath('/hms/inventory/manufacturers');
        revalidatePath('/hms/inventory/products/new');
        return { success: true };
    } catch (error) {
        console.error("Failed to update manufacturer:", error);
        return { error: "Failed to update manufacturer" };
    }
}

export async function deleteManufacturer(id: string) {
    const session = await auth();
    if (!session?.user?.companyId) return { error: "Unauthorized" };

    try {
        await prisma.hms_manufacturer.update({
            where: { id, company_id: session.user.companyId },
            data: { is_active: false }
        });
        revalidatePath('/hms/inventory/manufacturers');
        return { success: true };
    } catch (error) {
        console.error("Failed to delete manufacturer:", error);
        return { error: "Failed to delete manufacturer" };
    }
}



export async function getLocations() {
    const session = await auth();
    if (!session?.user?.companyId) return [];
    try {
        return await prisma.global_stock_location.findMany({
            where: { company_id: session.user.companyId, is_active: true },
            orderBy: { name: 'asc' },
            select: { id: true, name: true, location_type: true, code: true }
        });
    } catch (error) {
        console.error("Failed to fetch locations:", error);
        return [];
    }
}

export async function createLocation(prevState: any, formData: FormData): Promise<{ error: string } | { success: boolean }> {
    const session = await auth();
    if (!session?.user?.companyId || !session?.user?.tenantId) return { error: "Unauthorized" };

    const name = formData.get("name") as string;
    const code = formData.get("code") as string;
    const type = formData.get("type") as string || 'internal';

    if (!name) return { error: "Name is required" };

    try {
        await prisma.global_stock_location.create({
            data: {
                tenant_id: session.user.tenantId,
                company_id: session.user.companyId,
                name,
                code,
                location_type: type
            }
        });
        revalidatePath('/hms/inventory/locations');
        return { success: true };
    } catch (error) {
        console.error("Failed to create location:", error);
        return { error: "Failed to create location" };
    }
}

export async function updateLocation(formData: FormData) {
    const session = await auth();
    if (!session?.user?.companyId) return { error: "Unauthorized" };

    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const code = formData.get("code") as string;
    const type = formData.get("type") as string;

    if (!id || !name) return { error: "ID and Name are required" };

    try {
        await prisma.global_stock_location.update({
            where: { id, company_id: session.user.companyId },
            data: { name, code, location_type: type }
        });
        revalidatePath('/hms/inventory/locations');
        return { success: true };
    } catch (error) {
        console.error("Failed to update location:", error);
        return { error: "Failed to update location" };
    }
}

export async function deleteLocation(id: string) {
    const session = await auth();
    if (!session?.user?.companyId) return { error: "Unauthorized" };

    try {
        await prisma.global_stock_location.update({
            where: { id, company_id: session.user.companyId },
            data: { is_active: false }
        });
        revalidatePath('/hms/inventory/locations');
        return { success: true };
    } catch (error) {
        console.error("Failed to delete location:", error);
        return { error: "Failed to delete location" };
    }
}

// --- Product Management ---

export async function getProductsPremium(query?: string, page: number = 1, supplierId?: string) {
    const session = await auth();
    if (!session?.user?.companyId) return { error: "Unauthorized" };

    const pageSize = 10;
    const skip = (page - 1) * pageSize;

    try {
        const where: any = {
            company_id: session.user.companyId,
            is_active: true
        };

        // If supplierId is provided, filter products to only those bought from this supplier before
        if (supplierId) {
            const supplierProductIds = await prisma.hms_purchase_receipt_line.findMany({
                where: {
                    hms_purchase_receipt: {
                        supplier_id: supplierId,
                        company_id: session.user.companyId
                    }
                },
                select: { product_id: true }
            });

            const uniqueIds = Array.from(new Set(supplierProductIds.map(sp => sp.product_id)));
            if (uniqueIds.length > 0) {
                where.id = { in: uniqueIds };
            } else {
                // If no items found for this supplier, we don't apply the filter strictly 
                // but we could. User asked to "filter", but if 0 items, search yields 0.
                // Let's stick to the request: filter.
                where.id = "NOT_FOUND"; // Force zero results if strictly filtering and no purchase history
            }
        }

        if (query) {
            where.OR = [
                { name: { contains: query, mode: 'insensitive' } },
                { sku: { contains: query, mode: 'insensitive' } },
                // Allow searching by brand if it was stored in metadata, but prisma doesn't support deep JSON search easily with contains. 
                // We'll stick to name/sku for now.
            ];
        }

        const [products, total, companySettings] = await prisma.$transaction([
            prisma.hms_product.findMany({
                where,
                skip,
                take: pageSize,
                orderBy: { created_at: 'desc' },
                include: {
                    hms_stock_levels: {
                        select: { quantity: true }
                    },
                    hms_product_category_rel: {
                        include: { hms_product_category: true }
                    }
                }
            }),
            prisma.hms_product.count({ where }),
            prisma.company_settings.findUnique({
                where: { company_id: session.user.companyId },
                select: { currencies: { select: { symbol: true } } }
            })
        ]);

        const processed = products.map(p => {
            const totalStock = p.hms_stock_levels.reduce((sum, lvl) => sum + Number(lvl.quantity || 0), 0);
            let status = 'In Stock';
            if (totalStock === 0) status = 'Out of Stock';
            else if (totalStock < 10) status = 'Low Stock';

            // Extract brand from metadata if exists
            const metadata = p.metadata as Record<string, any> || {};

            return {
                ...p,
                price: Number(p.price || 0),
                totalStock,
                stockStatus: status,
                category: p.hms_product_category_rel[0]?.hms_product_category?.name || 'Uncategorized',
                brand: metadata.brand || '',
                uom: p.uom,
                default_cost: Number(p.default_cost || 0)
            };
        });

        // Default to ₹ if not set, as user context implies India
        const currencySymbol = companySettings?.currencies?.symbol || '$';

        return {
            success: true,
            data: processed,
            meta: {
                total,
                page,
                totalPages: Math.ceil(total / pageSize),
                currencySymbol
            }
        };

    } catch (error) {
        console.error("Failed to fetch products:", error);
        return { error: "Failed to fetch products" };
    }
}

export async function createProduct(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id || !session.user.companyId || !session.user.tenantId) {
        return { error: "Unauthorized" };
    }

    // Essential Fields
    const name = formData.get("name") as string;
    const sku = formData.get("sku") as string;
    const price = parseFloat(formData.get("price") as string) || 0;
    const type = formData.get("type") as string || 'goods';
    const description = formData.get("description") as string;

    // New Fields
    const brand = formData.get("brand") as string;
    const barcode = formData.get("barcode") as string;
    const uomId = formData.get("uomId") as string;
    const supplierId = formData.get("supplierId") as string;
    const taxRateId = formData.get("taxRateId") as string;
    const categoryId = formData.get("categoryId") as string;
    const tracking = formData.get("tracking") as string || 'none'; // none, batch, serial
    const imageUrl = formData.get("image_url") as string;
    const manufacturerId = formData.get("manufacturerId") as string;

    if (!name || !sku) {
        return { error: "Name and SKU are required" };
    }

    const costPrice = parseFloat(formData.get("costPrice") as string) || 0;
    const mrp = parseFloat(formData.get("mrp") as string) || 0;
    const openingStock = parseFloat(formData.get("openingStock") as string) || 0;

    try {
        // Construct Metadata
        const metadata: Record<string, any> = {
            brand: brand || null,
            tracking: tracking, // Store tracking preference
            cost_price: costPrice,
            mrp: mrp
        };

        const newProduct = await prisma.hms_product.create({
            data: {
                tenant_id: session.user.tenantId,
                company_id: session.user.companyId,
                name,
                sku,
                is_stockable: type === 'goods',
                is_service: type === 'service',
                price,
                description,
                uom_id: uomId || null,
                manufacturer_id: manufacturerId || null,
                default_barcode: barcode || null,
                metadata,
                created_by: session.user.id,
                is_active: true
            }
        });

        // Link Supplier if provided
        if (supplierId) {
            await prisma.hms_product_supplier.create({
                data: {
                    tenant_id: session.user.tenantId,
                    company_id: session.user.companyId,
                    product_id: newProduct.id,
                    supplier_id: supplierId,
                    is_primary: true
                }
            });
        }

        // Link Tax Rate if provided
        if (taxRateId) {
            // Check complexity of product_tax_rules, usually it needs more fields but let's try minimal
            // Based on previous schema reading: tenant_id, company_id, product_id, tax_rate_id are key
            await prisma.product_tax_rules.create({
                data: {
                    tenant_id: session.user.tenantId,
                    company_id: session.user.companyId,
                    product_id: newProduct.id,
                    tax_rate_id: taxRateId,
                    priority: 1
                }
            });
        }

        // Link Image if provided
        if (imageUrl) {
            await prisma.hms_product_image.create({
                data: {
                    tenant_id: session.user.tenantId,
                    company_id: session.user.companyId,
                    product_id: newProduct.id,
                    url: imageUrl,
                    created_by: session.user.id
                }
            });
        }

        // Link Category if provided
        if (categoryId) {
            await prisma.hms_product_category_rel.create({
                data: {
                    product_id: newProduct.id,
                    category_id: categoryId
                }
            });
        }

        // Handle Opening Stock
        if (openingStock > 0) {
            await receiveStock({
                date: new Date(),
                items: [{
                    productId: newProduct.id,
                    quantity: openingStock,
                    unitCost: costPrice || price, // Use cost or selling price as fallback
                }],
                reference: 'OPENING-STOCK',
                notes: 'Initial Opening Stock from Product Master'
            });
        }


        revalidatePath('/hms/inventory/products');
        return { success: true };
    } catch (error) {
        console.error("Failed to create product:", error);
        return { error: "Failed to create product" };
    }
}

export async function getProduct(id: string) {
    const session = await auth();
    if (!session?.user?.companyId) return null;

    try {
        const product = await prisma.hms_product.findUnique({
            where: {
                id,
                company_id: session.user.companyId
            },
            include: {
                hms_product_supplier: {
                    where: { is_primary: true },
                    take: 1
                },
                product_tax_rules: {
                    include: { tax_rates: true },
                    take: 1,
                    orderBy: { priority: 'asc' }
                },
                hms_product_image: {
                    take: 1,
                    orderBy: { created_at: 'desc' }
                },
                hms_product_category_rel: true,
                hms_stock_levels: true
            }
        });

        if (!product) return null;

        const metadata = product.metadata as Record<string, any> || {};

        return {
            ...product,
            price: Number(product.price || 0),
            mrp: Number(product.price || 0),
            hsn: (metadata.hsn as string) || '',
            packing: (metadata.packing as string) || '',
            brand: metadata.brand || '',
            tracking: metadata.tracking || 'none',
            supplierId: product.hms_product_supplier[0]?.supplier_id || '',
            taxRateId: product.product_tax_rules[0]?.tax_rate_id || '',
            taxRate: Number(product.product_tax_rules[0]?.tax_rates?.rate || 0),
            imageUrl: product.hms_product_image[0]?.url || '',
            default_cost: Number(product.default_cost || 0),
            categoryId: product.hms_product_category_rel[0]?.category_id || '',
            manufacturerId: product.manufacturer_id || '',
            stock_levels: product.hms_stock_levels
        };
    } catch (error) {
        console.error("Failed to fetch product:", error);
        return null;
    }
}

export async function updateProduct(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id || !session.user.companyId) {
        return { error: "Unauthorized" };
    }

    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const sku = formData.get("sku") as string;
    const price = parseFloat(formData.get("price") as string) || 0;
    const description = formData.get("description") as string;

    const brand = formData.get("brand") as string;
    const barcode = formData.get("barcode") as string;
    const uom = formData.get("uom") as string || 'each';
    const supplierId = formData.get("supplierId") as string;
    const taxRateId = formData.get("taxRateId") as string;
    const categoryId = formData.get("categoryId") as string;
    const tracking = formData.get("tracking") as string || 'none';
    const imageUrl = formData.get("image_url") as string;
    const manufacturerId = formData.get("manufacturerId") as string;

    if (!id || !name || !sku) {
        return { error: "Missing required fields" };
    }

    try {
        const existingProduct = await prisma.hms_product.findUnique({
            where: { id, company_id: session.user.companyId },
            select: { metadata: true }
        });

        const currentMetadata = (existingProduct?.metadata as Record<string, any>) || {};

        const costPrice = parseFloat(formData.get("costPrice") as string) || 0;
        const mrp = parseFloat(formData.get("mrp") as string) || 0;

        const metadata: Record<string, any> = {
            ...currentMetadata,
            brand: brand || null,
            tracking: tracking,
            cost_price: costPrice,
            mrp: mrp
        };

        await prisma.hms_product.update({
            where: {
                id,
                company_id: session.user.companyId
            },
            data: {
                name,
                sku,
                price,
                description,
                uom,
                manufacturer_id: manufacturerId || null,
                default_barcode: barcode || null,
                metadata,
                updated_by: session.user.id,
                updated_at: new Date()
            }
        });

        // Update Supplier Link
        // First delete existing primary link (simplification)
        await prisma.hms_product_supplier.deleteMany({
            where: { product_id: id, is_primary: true }
        });

        if (supplierId) {
            await prisma.hms_product_supplier.create({
                data: {
                    tenant_id: session.user.tenantId,
                    company_id: session.user.companyId,
                    product_id: id,
                    supplier_id: supplierId,
                    is_primary: true
                }
            });
        }

        // Update Tax Rule
        // Delete existing rule
        await prisma.product_tax_rules.deleteMany({
            where: { product_id: id }
        });

        if (taxRateId) {
            await prisma.product_tax_rules.create({
                data: {
                    tenant_id: session.user.tenantId,
                    company_id: session.user.companyId,
                    product_id: id,
                    tax_rate_id: taxRateId,
                    priority: 1
                }
            });
        }

        // Add New Image if provided
        if (imageUrl) {
            await prisma.hms_product_image.create({
                data: {
                    tenant_id: session.user.tenantId,
                    company_id: session.user.companyId,
                    product_id: id,
                    url: imageUrl,
                    created_by: session.user.id
                }
            });
        }

        // Update Category
        if (categoryId) {
            await prisma.hms_product_category_rel.deleteMany({
                where: { product_id: id }
            });
            await prisma.hms_product_category_rel.create({
                data: {
                    product_id: id,
                    category_id: categoryId
                }
            });
        }

        revalidatePath('/hms/inventory/products');
        revalidatePath(`/hms/inventory/products/${id}`);
        return { success: true };
    } catch (error) {
        console.error("Failed to update product:", error);
        return { error: "Failed to update product" };
    }
}

export async function getSuppliersList(query?: string, page: number = 1) {
    const session = await auth();
    if (!session?.user?.companyId) return { error: "Unauthorized" };

    const pageSize = 10;
    const skip = (page - 1) * pageSize;

    try {
        const where: any = {
            company_id: session.user.companyId,
            is_active: true
        };
        if (query) {
            where.name = { contains: query, mode: 'insensitive' };
        }

        const [suppliers, total] = await prisma.$transaction([
            prisma.hms_supplier.findMany({
                where,
                skip,
                take: pageSize,
                orderBy: { created_at: 'desc' },
                include: {
                    _count: { select: { hms_product_supplier: true, hms_purchase_order: true } }
                }
            }),
            prisma.hms_supplier.count({ where })
        ]);

        return {
            success: true,
            data: suppliers.map(s => {
                const meta = s.metadata as any || {};
                return {
                    id: s.id,
                    name: s.name,
                    gstin: meta.gstin || '',
                    address: meta.address || '',
                    productCount: s._count.hms_product_supplier,
                    orderCount: s._count.hms_purchase_order,
                    createdAt: s.created_at
                };
            }),
            meta: { total, page, totalPages: Math.ceil(total / pageSize) }
        };
    } catch (error) {
        console.error("Failed to fetch suppliers list:", error);
        return { error: "Failed to fetch suppliers" };
    }
}

export async function getStockMoves(query?: string, page: number = 1) {
    const session = await auth();
    if (!session?.user?.companyId) return { error: "Unauthorized" };

    const pageSize = 20;
    const skip = (page - 1) * pageSize;

    try {
        const where: any = {
            company_id: session.user.companyId
        };

        if (query) {
            const products = await prisma.hms_product.findMany({
                where: {
                    company_id: session.user.companyId,
                    name: { contains: query, mode: 'insensitive' }
                },
                select: { id: true }
            });
            const productIds = products.map(p => p.id);
            where.product_id = { in: productIds };
        }

        const [moves, total] = await prisma.$transaction([
            prisma.hms_stock_ledger.findMany({
                where,
                skip,
                take: pageSize,
                orderBy: { created_at: 'desc' },
                include: {
                    hms_product: { select: { name: true, sku: true, uom: true } }
                }
            }),
            prisma.hms_stock_ledger.count({ where })
        ]);

        return {
            success: true,
            data: moves.map(m => ({
                id: m.id,
                date: m.created_at,
                productName: m.hms_product?.name,
                sku: m.hms_product?.sku,
                type: m.movement_type,
                qty: Number(m.qty),
                uom: m.uom || m.hms_product?.uom,
                reference: m.reference
            })),
            meta: { total, page, totalPages: Math.ceil(total / pageSize) }
        };

    } catch (error) {
        console.error("Failed to fetch stock moves:", error);
        return { error: "Failed to fetch stock moves" };
    }
}

export async function getStockReport(query?: string, page: number = 1) {
    const session = await auth();
    if (!session?.user?.companyId) return { error: "Unauthorized" };

    const pageSize = 50;
    const skip = (page - 1) * pageSize;

    try {
        const where: any = {
            company_id: session.user.companyId,
            is_active: true
        };

        if (query) {
            where.OR = [
                { name: { contains: query, mode: 'insensitive' } },
                { sku: { contains: query, mode: 'insensitive' } }
            ];
        }

        // 1. Fetch Products
        const [products, total] = await prisma.$transaction([
            prisma.hms_product.findMany({
                where,
                select: {
                    id: true,
                    name: true,
                    sku: true,
                    default_cost: true,
                    uom: true,
                    hms_product_category_rel: {
                        include: { hms_product_category: { select: { name: true } } }
                    }
                },
                take: pageSize,
                skip,
                orderBy: { name: 'asc' }
            }),
            prisma.hms_product.count({ where })
        ]);

        if (products.length === 0) {
            return { success: true, data: [], meta: { total: 0, page, totalPages: 0 } };
        }

        // 3. Aggregate Stock from Ledger (Source of Truth) for the current page
        const productIds = products.map(p => p.id);
        const aggregates = await prisma.hms_product_stock_ledger.groupBy({
            by: ['product_id'],
            where: {
                product_id: { in: productIds },
                company_id: session.user.companyId
            },
            _sum: {
                change_qty: true
            }
        });

        const stockMap = new Map<string, number>();
        aggregates.forEach(agg => {
            stockMap.set(agg.product_id, Number(agg._sum.change_qty || 0));
        });

        // 4. Map Results
        const reportData = products.map(p => {
            const stock = stockMap.get(p.id) || 0;
            const cost = Number(p.default_cost || 0);
            return {
                id: p.id,
                sku: p.sku,
                name: p.name,
                category: p.hms_product_category_rel[0]?.hms_product_category?.name || 'Uncategorized',
                uom: p.uom,
                stockOnHand: stock,
                stockValue: stock * cost,
                status: stock <= 0 ? 'Out of Stock' : (stock < 10 ? 'Low Stock' : 'In Stock')
            };
        });

        // 5. Calculate Global Totals (across all pages)
        // We use hms_stock_levels for global aggregation as it's more efficient than aggregating the entire ledger
        let totalStockOnHand = 0;
        let totalValue = 0;

        try {
            const allMatchingStock = await prisma.hms_stock_levels.findMany({
                where: {
                    company_id: session.user.companyId,
                    hms_product: {
                        is_active: true,
                        ...(query ? {
                            OR: [
                                { name: { contains: query, mode: 'insensitive' } },
                                { sku: { contains: query, mode: 'insensitive' } }
                            ]
                        } : {})
                    }
                },
                include: {
                    hms_product: {
                        select: { default_cost: true }
                    }
                }
            });

            allMatchingStock.forEach(item => {
                const qty = Number(item.quantity || 0);
                const cost = Number(item.hms_product?.default_cost || 0);
                totalStockOnHand += qty;
                totalValue += qty * cost;
            });
        } catch (e) {
            console.error("Failed to calculate global totals:", e);
            // Fail silently on totals if optimization fails
        }

        return {
            success: true,
            data: reportData,
            meta: {
                total,
                page,
                totalPages: Math.ceil(total / pageSize),
                summary: {
                    totalStockOnHand,
                    totalValue
                }
            }
        };

    } catch (error) {
        console.error("Failed to generate stock report:", error);
        return { error: "Failed to generate stock report" };
    }
}

// --- Smart Product Matching & Auto-Creation ---

export async function findOrCreateProduct(productName: string, additionalData?: {
    mrp?: number;
    hsn?: string;
    packing?: string;
    taxRate?: number;
}) {
    const session = await auth();
    if (!session?.user?.companyId || !session?.user?.tenantId) {
        return { error: "Unauthorized" };
    }

    try {
        const companyId = session.user.companyId;
        const tenantId = session.user.tenantId;

        // 1. Try to find existing product by exact name match
        let product = await prisma.hms_product.findFirst({
            where: {
                company_id: companyId,
                name: {
                    equals: productName,
                    mode: 'insensitive'
                }
            }
        });

        if (product) {
            // CRITICAL: Even if product exists, ensure it has a Tax Rule if the scan provided one
            if (additionalData?.taxRate) {
                const taxRateVal = Number(additionalData.taxRate);
                if (taxRateVal > 0) {
                    const existingRule = await prisma.product_tax_rules.findFirst({
                        where: { product_id: product.id, is_active: true }
                    });

                    if (!existingRule) {
                        const taxMaps = await prisma.company_tax_maps.findMany({
                            where: { company_id: companyId },
                            include: { tax_rates: true }
                        });
                        const match = taxMaps.find(m => Math.abs(Number(m.tax_rates.rate) - taxRateVal) < 0.1);

                        if (match) {
                            await prisma.product_tax_rules.create({
                                data: {
                                    id: crypto.randomUUID(),
                                    tenant_id: tenantId,
                                    company_id: companyId,
                                    product_id: product.id,
                                    tax_rate_id: match.tax_rate_id,
                                    priority: 1,
                                    is_active: true
                                }
                            });
                            console.log(`✅ UPDATE: Auto-created tax rule for EXISTING product (Exact Match): ${product.name}, Rate: ${taxRateVal}%`);
                        }
                    }
                }
            }

            return {
                productId: product.id,
                productName: product.name,
                created: false
            };
        }

        // 2. If not found, try fuzzy match
        const similarProducts = await prisma.hms_product.findMany({
            where: {
                company_id: companyId,
                name: {
                    contains: productName,
                    mode: 'insensitive'
                }
            },
            take: 1
        });

        if (similarProducts.length > 0) {
            product = similarProducts[0];

            // CRITICAL: Even if product exists, ensure it has a Tax Rule if the scan provided one
            if (additionalData?.taxRate) {
                const taxRateVal = Number(additionalData.taxRate);
                if (taxRateVal > 0) {
                    const existingRule = await prisma.product_tax_rules.findFirst({
                        where: { product_id: product.id, is_active: true }
                    });

                    if (!existingRule) {
                        const taxMaps = await prisma.company_tax_maps.findMany({
                            where: { company_id: companyId },
                            include: { tax_rates: true }
                        });
                        const match = taxMaps.find(m => Math.abs(Number(m.tax_rates.rate) - taxRateVal) < 0.1);

                        if (match) {
                            await prisma.product_tax_rules.create({
                                data: {
                                    id: crypto.randomUUID(),
                                    tenant_id: tenantId,
                                    company_id: companyId,
                                    product_id: product.id,
                                    tax_rate_id: match.tax_rate_id,
                                    priority: 1,
                                    is_active: true
                                }
                            });
                            console.log(`✅ UPDATE: Auto-created tax rule for EXISTING product: ${product.name}, Rate: ${taxRateVal}%`);
                        }
                    }
                }
            }

            return {
                productId: product.id,
                productName: product.name,
                created: false,
                fuzzyMatch: true
            };
        }

        // 3. Auto-create new product
        const newProduct = await prisma.hms_product.create({
            data: {
                tenant_id: tenantId,
                company_id: companyId,
                name: productName,
                description: productName, // Use actual name for description
                price: additionalData?.mrp || 0,
                default_cost: 0,
                sku: `AUTO-${Date.now()}`,
                is_active: true,
                is_service: false,
                is_stockable: true,
                metadata: {
                    ...(additionalData?.hsn && { hsn: additionalData.hsn }),
                    ...(additionalData?.packing && { packing: additionalData.packing }),
                    tax_rate: additionalData?.taxRate, // Proactive tax capture
                    autoCreated: true,
                    created_from: 'invoice_scan',
                    scan_details: additionalData
                }
            }
        });

        // 4. IMMEDIATE TAX RULE CREATION (Critical for Billing)
        if (additionalData?.taxRate) {
            const taxRateVal = Number(additionalData.taxRate);
            if (taxRateVal > 0) {
                // Find matching tax ID in company settings
                const taxMaps = await prisma.company_tax_maps.findMany({
                    where: { company_id: companyId },
                    include: { tax_rates: true }
                });
                const match = taxMaps.find(m => Math.abs(Number(m.tax_rates.rate) - taxRateVal) < 0.1);

                if (match) {
                    await prisma.product_tax_rules.create({
                        data: {
                            id: crypto.randomUUID(),
                            tenant_id: tenantId,
                            company_id: companyId,
                            product_id: newProduct.id,
                            tax_rate_id: match.tax_rate_id,
                            priority: 1,
                            is_active: true
                        }
                    });
                    console.log(`✅ Auto-created tax rule for product: ${productName}, Rate: ${taxRateVal}%`);
                }
            }
        }

        console.log(`✅ Auto-created product: ${productName}`);

        return {
            productId: newProduct.id,
            productName: newProduct.name,
            created: true
        };

    } catch (error) {
        console.error("Failed to find/create product:", error);
        return { error: "Failed to process product" };
    }
}

export async function findOrCreateProductsBatch(items: { productName: string, mrp?: number, hsn?: string, packing?: string, taxRate?: number }[]) {
    const session = await auth();
    if (!session?.user?.companyId || !session?.user?.tenantId) return { error: "Unauthorized" };

    const results: any[] = [];
    const companyId = session.user.companyId;

    // Process sequentially but in a single server call from the UI
    for (const item of items) {
        const res = await findOrCreateProduct(item.productName, item);
        results.push({ ...res, originalName: item.productName });
    }

    return { success: true, data: results };
}

// Helper for CSV Parsing
function parseCSVLine(line: string): string[] {
    const result = [];
    let start = 0;
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
        if (line[i] === '"') {
            inQuotes = !inQuotes;
        } else if (line[i] === ',' && !inQuotes) {
            let val = line.substring(start, i).trim();
            if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
            result.push(val.replace(/""/g, '"'));
            start = i + 1;
        }
    }
    let lastVal = line.substring(start).trim();
    if (lastVal.startsWith('"') && lastVal.endsWith('"')) lastVal = lastVal.slice(1, -1);
    result.push(lastVal.replace(/""/g, '"'));
    return result;
}

export async function importProductsCSV(formData: FormData) {
    const session = await auth();
    if (!session?.user?.companyId || !session?.user?.tenantId) return { error: "Unauthorized" };
    const companyId = session.user.companyId;
    const tenantId = session.user.tenantId;

    const file = formData.get("file") as File;
    if (!file) return { error: "No file uploaded" };

    const text = await file.text();
    const lines = text.split(/\r?\n/);
    if (lines.length < 2) return { error: "Empty or invalid CSV" };

    // 1. Parse Headers
    const headers = parseCSVLine(lines[0]).map(h => h.toLowerCase().trim());

    const getIdx = (patterns: string[]) => headers.findIndex(h => patterns.some(p => h.includes(p)));

    const idxName = getIdx(['name', 'product name']);
    const idxSku = getIdx(['sku', 'code']);
    const idxBarcode = getIdx(['barcode', 'ean', 'upc']);
    const idxPrice = getIdx(['sale price', 'selling price', 'price']);
    const idxMrp = getIdx(['mrp', 'max retail price']);
    const idxPurchase = getIdx(['purchase price', 'cost', 'buy price']);
    const idxTax = getIdx(['tax', 'gst', 'vat']);
    const idxCat = getIdx(['category', 'group']);
    const idxUom = getIdx(['uom', 'unit']);
    const idxBrand = getIdx(['brand']);
    const idxDesc = getIdx(['description', 'desc', 'details']);
    const idxStock = getIdx(['stock', 'quantity', 'qty', 'opening']);
    const idxBatch = getIdx(['batch']);
    const idxExpiry = getIdx(['expiry', 'exp']);
    const idxManufacturer = getIdx(['manufacturer', 'mfg']);

    if (idxName === -1 || idxSku === -1) {
        return { error: "CSV must contain 'Name' and 'SKU' columns." };
    }

    // 2. Pre-fetch Data for mapping
    const [existingCats, existingTaxes] = await Promise.all([
        prisma.hms_product_category.findMany({ where: { company_id: companyId }, select: { id: true, name: true } }),
        prisma.company_taxes.findMany({ where: { company_id: companyId }, select: { id: true, rate: true } })
    ]);

    let count = 0;
    const errors = [];

    // 3. Process Rows
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        try {
            const row = parseCSVLine(line);

            // Check row length matches roughly or reuse logic
            // Just access safely
            const name = idxName !== -1 ? row[idxName] : null;
            const sku = idxSku !== -1 ? row[idxSku] : null;
            if (!name || !sku) continue;

            const salePrice = idxPrice !== -1 ? parseFloat(row[idxPrice]) || 0 : 0;
            const mrp = idxMrp !== -1 ? parseFloat(row[idxMrp]) || 0 : 0;
            const purchaseCost = idxPurchase !== -1 ? parseFloat(row[idxPurchase]) || 0 : 0;
            const taxRateVal = idxTax !== -1 ? parseFloat(row[idxTax]) : NaN;
            const openingStock = idxStock !== -1 ? parseFloat(row[idxStock]) || 0 : 0;
            const uomStr = (idxUom !== -1 && row[idxUom]) ? row[idxUom] : 'UNIT';

            // Resolve Category
            let categoryId = null;
            if (idxCat !== -1 && row[idxCat]) {
                const catName = row[idxCat];
                const existing = existingCats.find(c => c.name.toLowerCase() === catName.toLowerCase());
                if (existing) categoryId = existing.id;
                else {
                    const newCat = await prisma.hms_product_category.create({
                        data: { tenant_id: tenantId, company_id: companyId, name: catName }
                    });
                    existingCats.push(newCat);
                    categoryId = newCat.id;
                }
            }

            // Upsert Product Logic
            const existingProduct = await prisma.hms_product.findFirst({
                where: { company_id: companyId, sku: sku }
            });

            let productId: string;
            const metadata: any = {
                brand: idxBrand !== -1 ? row[idxBrand] : undefined,
                manufacturer: idxManufacturer !== -1 ? row[idxManufacturer] : undefined,
                mrp: mrp > 0 ? mrp : undefined,
                purchase_price: purchaseCost > 0 ? purchaseCost : undefined
            };

            if (existingProduct) {
                // Update
                const updated = await prisma.hms_product.update({
                    where: { id: existingProduct.id },
                    data: {
                        name,
                        price: salePrice > 0 ? salePrice : existingProduct.price,
                        description: idxDesc !== -1 && row[idxDesc] ? row[idxDesc] : existingProduct.description,
                        metadata: { ...(existingProduct.metadata as object), ...metadata }
                    }
                });
                productId = updated.id;
            } else {
                // Create
                const created = await prisma.hms_product.create({
                    data: {
                        tenant_id: tenantId,
                        company_id: companyId,
                        name,
                        sku,
                        price: salePrice,
                        description: idxDesc !== -1 ? row[idxDesc] : '',
                        uom: uomStr,
                        is_active: true,
                        is_stockable: true,
                        is_service: false,
                        created_by: session.user.id,
                        default_barcode: idxBarcode !== -1 ? row[idxBarcode] : null,
                        metadata
                    }
                });
                productId = created.id;

                if (categoryId) {
                    await prisma.hms_product_category_rel.create({
                        data: { product_id: productId, category_id: categoryId }
                    });
                }
            }

            // 4. Handle Tax Rule
            if (!isNaN(taxRateVal)) {
                const match = existingTaxes.find(t => Math.abs(Number(t.rate) - taxRateVal) < 0.1);
                if (match) {
                    const existingRule = await prisma.product_tax_rules.findFirst({
                        where: { product_id: productId }
                    });
                    if (!existingRule) {
                        await prisma.product_tax_rules.create({
                            data: {
                                tenant_id: tenantId,
                                company_id: companyId,
                                product_id: productId,
                                tax_rate_id: match.id,
                                priority: 1
                            }
                        });
                    }
                }
            }

            // 5. Handle Opening Stock
            if (openingStock > 0) {
                // Handle Batch
                let batchId: string | null = null;
                if (idxBatch !== -1 && row[idxBatch]) {
                    const batchNo = row[idxBatch];
                    const expiry = idxExpiry !== -1 && row[idxExpiry] ? new Date(row[idxExpiry]) : null;

                    // Upsert Batch
                    const batch = await prisma.hms_product_batch.upsert({
                        where: {
                            tenant_id_company_id_product_id_batch_no: {
                                tenant_id: tenantId,
                                company_id: companyId,
                                product_id: productId,
                                batch_no: batchNo
                            }
                        },
                        create: {
                            tenant_id: tenantId,
                            company_id: companyId,
                            product_id: productId,
                            batch_no: batchNo,
                            expiry_date: expiry,
                            qty_on_hand: openingStock
                        },
                        update: {
                            qty_on_hand: { increment: openingStock }
                        }
                    });
                    batchId = batch.id;
                }

                // Get Last Balance
                let currentBalance = 0;
                const lastLedger = await prisma.hms_product_stock_ledger.findFirst({
                    where: { product_id: productId },
                    orderBy: { created_at: 'desc' }
                });
                if (lastLedger) currentBalance = Number(lastLedger.balance_qty);

                const newBalance = currentBalance + openingStock;

                // Create Ledger Entry
                await prisma.hms_product_stock_ledger.create({
                    data: {
                        tenant_id: tenantId,
                        company_id: companyId,
                        product_id: productId,
                        movement_type: 'OPENING', // ensure enum or string matches
                        change_qty: openingStock,
                        balance_qty: newBalance,
                        batch_id: batchId,
                        reference: `IMPORT-${Date.now()}-${i}`,
                        cost: purchaseCost > 0 ? purchaseCost : undefined
                    }
                });
            }

            count++;

        } catch (e) {
            const msg = (e as Error).message;
            errors.push({ row: i + 1, error: msg });
        }
    }

    revalidatePath('/hms/inventory/products');
    return { success: true, count, errors };
}
