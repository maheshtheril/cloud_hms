'use server'

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

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

export async function getSuppliers() {
    const session = await auth();
    if (!session?.user?.companyId) return [];

    try {
        const suppliers = await prisma.hms_supplier.findMany({
            where: {
                company_id: session.user.companyId,
                is_active: true
            },
            select: { id: true, name: true }
        });
        return suppliers;
    } catch (error) {
        console.error("Failed to fetch suppliers:", error);
        return [];
    }
}

export async function getTaxRates() {
    const session = await auth();
    if (!session?.user?.companyId) return [];

    try {
        // Fetch active tax rates enabled for this company via company_tax_maps
        const taxMaps = await prisma.company_tax_maps.findMany({
            where: {
                company_id: session.user.companyId,
                is_active: true
            },
            include: {
                tax_rates: {
                    select: { id: true, name: true, rate: true }
                }
            }
        });

        if (taxMaps.length > 0) {
            return taxMaps.map(tm => ({
                id: tm.tax_rates.id,
                name: tm.tax_rates.name,
                rate: Number(tm.tax_rates.rate)
            }));
        }

        // Fallback: Fetch all active tax rates for the tenant (or system wide if appropriate, assuming tenant isolation)
        // Check if there are any tax rates at all
        const allTaxRates = await prisma.tax_rates.findMany({
            where: { is_active: true },
            select: { id: true, name: true, rate: true }
        });

        return allTaxRates.map(tr => ({
            id: tr.id,
            name: tr.name,
            rate: Number(tr.rate)
        }));

    } catch (error) {
        console.error("Failed to fetch tax rates:", error);
        return [];
    }
}


export async function getUOMs() {
    const session = await auth();
    if (!session?.user?.companyId) return [];
    try {
        return await prisma.hms_uom.findMany({
            where: { company_id: session.user.companyId, is_active: true },
            orderBy: { name: 'asc' },
            select: { id: true, name: true, category_id: true, ratio: true, uom_type: true }
        });
    } catch (error) {
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

        if (categories.length === 0) {
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

export async function createUOM(prevState: any, formData: FormData) {
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
    if (!session?.user?.companyId) return [];
    try {
        return await prisma.hms_product_category.findMany({
            where: { company_id: session.user.companyId },
            select: { id: true, name: true, default_tax_rate_id: true }
        });
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

export async function getProductsPremium(query?: string, page: number = 1) {
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
            where.OR = [
                { name: { contains: query, mode: 'insensitive' } },
                { sku: { contains: query, mode: 'insensitive' } },
                // Allow searching by brand if it was stored in metadata, but prisma doesn't support deep JSON search easily with contains. 
                // We'll stick to name/sku for now.
            ];
        }

        const [products, total] = await prisma.$transaction([
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
            prisma.hms_product.count({ where })
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

        return {
            success: true,
            data: processed,
            meta: {
                total,
                page,
                totalPages: Math.ceil(total / pageSize)
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

    try {
        // Construct Metadata
        const metadata: Record<string, any> = {
            brand: brand || null,
            tracking: tracking // Store tracking preference
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
                    take: 1,
                    orderBy: { priority: 'asc' }
                },
                hms_product_image: {
                    take: 1,
                    orderBy: { created_at: 'desc' }
                },
                hms_product_category_rel: true
            }
        });

        if (!product) return null;

        const metadata = product.metadata as Record<string, any> || {};

        return {
            ...product,
            price: Number(product.price || 0),
            brand: metadata.brand || '',
            tracking: metadata.tracking || 'none',
            supplierId: product.hms_product_supplier[0]?.supplier_id || '',
            taxRateId: product.product_tax_rules[0]?.tax_rate_id || '',
            imageUrl: product.hms_product_image[0]?.url || '',
            default_cost: Number(product.default_cost || 0),
            categoryId: product.hms_product_category_rel[0]?.category_id || '',
            manufacturerId: product.manufacturer_id || ''
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
        const metadata: Record<string, any> = {
            brand: brand || null,
            tracking: tracking
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
            data: suppliers.map(s => ({
                id: s.id,
                name: s.name,
                productCount: s._count.hms_product_supplier,
                orderCount: s._count.hms_purchase_order,
                createdAt: s.created_at
            })),
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

        // 2. Aggregate Stock from Ledger (Source of Truth)
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

        // 3. Map Results
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

        return {
            success: true,
            data: reportData,
            meta: {
                total,
                page,
                totalPages: Math.ceil(total / pageSize)
            }
        };

    } catch (error) {
        console.error("Failed to generate stock report:", error);
        return { error: "Failed to generate stock report" };
    }
}
