
import { getManufacturers, deleteManufacturer } from "@/app/actions/inventory"
import { Trash2, Factory, Globe, X } from "lucide-react"
import Link from "next/link"
import { CreateManufacturerForm } from "@/components/inventory/create-manufacturer-form"

export default async function ManufacturerMasterPage() {
    const manufacturers = await getManufacturers();

    return (
        <div className="max-w-6xl mx-auto pb-12 p-6">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Factory className="h-6 w-6 text-indigo-600" />
                        Manufacturer Master
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Manage product brands and manufacturing partners.</p>
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
                <CreateManufacturerForm />

                {/* List */}
                <div className="md:col-span-2 space-y-4">
                    <h2 className="text-lg font-semibold text-gray-900">Registered Manufacturers ({manufacturers.length})</h2>

                    {manufacturers.length === 0 ? (
                        <div className="bg-gray-50 rounded-xl p-8 text-center text-gray-500 border border-dashed border-gray-200">
                            No manufacturers found. Add your first one to get started.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {manufacturers.map(m => (
                                <div key={m.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-start justify-between group hover:border-indigo-200 transition-all">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold text-gray-900">{m.name}</h3>
                                            {m.website && (
                                                <a href={m.website} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-indigo-600 transition-colors">
                                                    <Globe className="h-3 w-3" />
                                                </a>
                                            )}
                                        </div>
                                        {m.description && (
                                            <p className="text-sm text-gray-500 line-clamp-2">{m.description}</p>
                                        )}
                                    </div>

                                    {/* Delete Form */}
                                    <form action={async () => {
                                        'use server'
                                        await deleteManufacturer(m.id)
                                    }}>
                                        <button type="submit" className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </form>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
