
import { getProduct, getSuppliers, getTaxRates, getUOMs, getCategories, getManufacturers, getUOMCategories, getProductBatches } from "@/app/actions/inventory"
import { ProductForm } from "@/components/inventory/product-form"
import { X } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

export default async function EditProductPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;
    const product = await getProduct(id);

    if (!product) {
        notFound();
    }

    const [
        suppliers,
        taxRates,
        uoms,
        categories,
        manufacturers,
        uomCategories,
        batches
    ] = await Promise.all([
        getSuppliers(),
        getTaxRates(),
        getUOMs(),
        getCategories(),
        getManufacturers(),
        getUOMCategories(),
        getProductBatches(id)
    ]);

    return (
        <div className="max-w-5xl mx-auto pb-12">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
                    <p className="text-gray-500 text-sm">Update product details and settings.</p>
                </div>
                <Link
                    href="/hms/inventory/products"
                    className="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 font-medium"
                >
                    <X className="h-4 w-4" />
                    Close
                </Link>
            </div>

            <ProductForm
                suppliers={suppliers}
                taxRates={taxRates}
                uoms={uoms}
                categories={categories}
                manufacturers={manufacturers}
                uomCategories={uomCategories}
                initialData={product}
                batches={batches}
            />
        </div>
    )
}
