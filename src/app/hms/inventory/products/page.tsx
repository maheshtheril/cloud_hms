import { getProductsPremium, getSuppliers, getTaxRates, getUOMs, getCategories, getManufacturers, getUOMCategories } from "@/app/actions/inventory"
import Link from "next/link"
import {
    Plus,
    Search,
    Filter,
    MoreHorizontal,
    Package,
    AlertCircle
} from "lucide-react"
import { CreateProductModal } from "@/components/inventory/create-product-modal"

export default async function ProductListPage({
    searchParams
}: {
    searchParams: Promise<{ query?: string; page?: string }>
}) {
    const { query, page } = await searchParams;
    const currentPage = Number(page) || 1;

    const [
        { success, data: products, meta },
        suppliers,
        taxRates,
        uoms,
        categories,
        manufacturers,
        uomCategories
    ] = await Promise.all([
        getProductsPremium(query, currentPage),
        getSuppliers(),
        getTaxRates(),
        getUOMs(),
        getCategories(),
        getManufacturers(),
        getUOMCategories()
    ]);

    return (
        <div className="space-y-6 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Product Registry</h1>
                    <p className="text-sm text-gray-500">Manage your catalog, stock levels, and pricing.</p>
                </div>
                <div className="flex gap-3">
                    <CreateProductModal
                        suppliers={suppliers}
                        taxRates={taxRates}
                        uoms={uoms}
                        categories={categories}
                        manufacturers={manufacturers}
                        uomCategories={uomCategories}
                    />
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <form action="">
                        <input
                            name="query"
                            defaultValue={query}
                            placeholder="Data search (Name, SKU, Barcode)..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        />
                    </form>
                </div>
                <div className="flex gap-2">
                    <button className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        Filter
                    </button>
                    {/* View Options could go here */}
                </div>
            </div>

            {/* Smart Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">

                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                                <th className="p-4 w-12">
                                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                </th>
                                <th className="p-4">Product Info</th>
                                <th className="p-4">Brand</th>
                                <th className="p-4">SKU / Code</th>
                                <th className="p-4">UOM</th>
                                <th className="p-4 w-48">Stock Level</th>
                                <th className="p-4">Price</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {!products || products.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="p-12 text-center text-gray-400">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="p-4 bg-gray-50 rounded-full">
                                                <Package className="h-8 w-8 opacity-40" />
                                            </div>
                                            <p>No products found matching your criteria.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                products.map((product: any) => (
                                    <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="p-4">
                                            <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                        </td>
                                        <td className="p-4">
                                            <div className="flex gap-3 items-center">
                                                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 font-bold text-xs">
                                                    {product.name.substring(0, 2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <Link href={`/hms/inventory/products/${product.id}/edit`} className="font-semibold text-gray-800 hover:text-blue-600 transition-colors">
                                                        {product.name}
                                                    </Link>
                                                    <p className="text-xs text-gray-400 truncate max-w-[200px]">{product.description}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-sm text-gray-600">{product.brand || '-'}</span>
                                        </td>
                                        <td className="p-4">
                                            <span className="font-mono text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">{product.sku}</span>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-xs font-medium text-gray-500 uppercase">{product.uom}</span>
                                        </td>
                                        <td className="p-4">
                                            <div className="space-y-1.5">
                                                <div className="flex justify-between text-xs">
                                                    <span className={`font-medium ${product.stockStatus === 'Low Stock' ? 'text-red-600' : 'text-gray-700'}`}>
                                                        {product.totalStock}
                                                    </span>
                                                    <span className="text-gray-400 text-xs scale-90">{product.stockStatus}</span>
                                                </div>
                                                {/* Visual Stock Bar */}
                                                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${product.totalStock === 0 ? 'bg-gray-300' :
                                                            product.totalStock < 10 ? 'bg-red-500' : 'bg-green-500'
                                                            }`}
                                                        style={{ width: `${Math.min((product.totalStock / 50) * 100, 100)}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="font-medium text-gray-900">{product.currency || '₹'} {product.price.toFixed(2)}</span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link href={`/hms/inventory/products/${product.id}/edit`} className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 shadow-sm transition-all">
                                                    Edit
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer / Pagination */}
                {meta && meta.totalPages > 1 && (
                    <div className="p-4 border-t border-gray-100 flex items-center justify-between">
                        <p className="text-xs text-gray-500">Page {meta.page} of {meta.totalPages}</p>
                        <div className="flex gap-2">
                            <Link
                                href={currentPage > 1 ? `?page=${currentPage - 1}&query=${query || ''}` : '#'}
                                className={`px-3 py-1 text-sm border rounded hover:bg-gray-50 ${currentPage <= 1 ? 'opacity-50 pointer-events-none' : ''}`}
                            >
                                Previous
                            </Link>
                            <Link
                                href={currentPage < meta.totalPages ? `?page=${currentPage + 1}&query=${query || ''}` : '#'}
                                className={`px-3 py-1 text-sm border rounded hover:bg-gray-50 ${currentPage >= meta.totalPages ? 'opacity-50 pointer-events-none' : ''}`}
                            >
                                Next
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
