import { getSuppliers, getTaxRates, getUOMs, getCategories, getManufacturers, getUOMCategories } from "@/app/actions/inventory"
import { ProductForm } from "@/components/inventory/product-form"
import { X } from "lucide-react"
import Link from "next/link"

export default async function NewProductPage() {
    const suppliers = await getSuppliers();
    const taxRates = await getTaxRates();
    const uoms = await getUOMs();
    const categories = await getCategories();
    const manufacturers = await getManufacturers();
    const uomCategories = await getUOMCategories();

    return (
        <div className="max-w-5xl mx-auto pb-12">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">New Product</h1>
                    <p className="text-gray-500 text-sm">Add a new item to your inventory catalog.</p>
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
            />
        </div>
    )
}
