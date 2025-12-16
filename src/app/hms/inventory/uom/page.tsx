
import { getUOMs } from "@/app/actions/inventory"
import { Scale, X, Ruler } from "lucide-react"
import Link from "next/link"

export default async function UOMMasterPage() {
    const uoms = await getUOMs();

    return (
        <div className="max-w-5xl mx-auto pb-12 p-6">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Scale className="h-6 w-6 text-purple-600" />
                        Units of Measure (UOM)
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Standard units for inventory tracking and sales.</p>
                </div>
                <Link
                    href="/hms/inventory/products"
                    className="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 font-medium"
                >
                    <X className="h-4 w-4" />
                    Back to Products
                </Link>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                    <h2 className="text-lg font-semibold text-gray-900">Standard System Units</h2>
                    <p className="text-sm text-gray-500 mt-1">These units are globally available for all products.</p>
                </div>

                <div className="divide-y divide-gray-100">
                    {uoms.map(u => (
                        <div key={u.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600">
                                    <Ruler className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">{u.name}</h3>
                                    <p className="text-xs text-gray-400 font-mono mt-0.5">ID: {u.id}</p>
                                </div>
                            </div>
                            <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-medium">
                                System Default
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-6 flex justify-center">
                <p className="text-sm text-gray-400 italic">
                    Note: To request additional custom units, please contact your system administrator.
                </p>
            </div>
        </div>
    )
}
