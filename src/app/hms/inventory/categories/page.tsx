
import { getCategories, getTaxRates, deleteCategory } from "@/app/actions/inventory"
import { Trash2, Tag, X } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { CreateCategoryForm } from "@/components/inventory/create-category-form"

export default async function CategoryMasterPage() {
    const categories = await getCategories();
    const taxRates = await getTaxRates();

    return (
        <div className="max-w-5xl mx-auto pb-12 p-6">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Tag className="h-6 w-6 text-blue-600" />
                        Category Master
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Manage product categories and their default tax configurations.</p>
                </div>
                <Link
                    href="/hms/inventory/products"
                    className="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 font-medium"
                >
                    <X className="h-4 w-4" />
                    Back to Products
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Create Form */}
                <CreateCategoryForm taxRates={taxRates} />

                {/* List */}
                <div className="md:col-span-2 space-y-4">
                    <h2 className="text-lg font-semibold text-gray-900">Existing Categories ({categories.length})</h2>

                    {categories.length === 0 ? (
                        <div className="bg-gray-50 rounded-xl p-8 text-center text-gray-500 border border-dashed border-gray-200">
                            No categories found. Create your first one to get started.
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm divide-y divide-gray-100 overflow-hidden">
                            {categories.map(category => {
                                const taxRate = taxRates.find(t => t.id === category.default_tax_rate_id);
                                return (
                                    <div key={category.id} className="p-4 flex items-center justify-between group hover:bg-gray-50 transition-colors">
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{category.name}</h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                                                    {taxRate ? `Tax: ${taxRate.name} (${taxRate.rate}%)` : 'No Default Tax'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {/* Delete Form */}
                                            <form action={async () => {
                                                'use server'
                                                await deleteCategory(category.id)
                                            }}>
                                                <button type="submit" className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
