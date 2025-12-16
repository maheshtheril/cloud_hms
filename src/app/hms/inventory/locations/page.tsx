
import { getLocations, deleteLocation } from "@/app/actions/inventory"
import { Trash2, MapPin, Warehouse, X } from "lucide-react"
import Link from "next/link"
import { CreateLocationForm } from "@/components/inventory/create-location-form"

export default async function LocationMasterPage() {
    const locations = await getLocations();

    return (
        <div className="max-w-6xl mx-auto pb-12 p-6">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Warehouse className="h-6 w-6 text-green-600" />
                        Godown / Locations
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Manage warehouses, shelves, and storage locations.</p>
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
                {/* Create Form */}
                <CreateLocationForm />

                {/* List */}
                <div className="md:col-span-2 space-y-4">
                    <h2 className="text-lg font-semibold text-gray-900">Active Locations ({locations.length})</h2>

                    {locations.length === 0 ? (
                        <div className="bg-gray-50 rounded-xl p-8 text-center text-gray-500 border border-dashed border-gray-200">
                            No locations found. Add your first godown to get started.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {locations.map(l => (
                                <div key={l.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between group hover:border-green-200 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 bg-green-50 rounded-full flex items-center justify-center text-green-600">
                                            <MapPin className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold text-gray-900">{l.name}</h3>
                                                {l.code && (
                                                    <span className="text-xs font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-600 border border-gray-200">
                                                        {l.code}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-500 capitalize">{l.location_type} Location</p>
                                        </div>
                                    </div>

                                    {/* Delete Form */}
                                    <form action={async () => {
                                        'use server'
                                        await deleteLocation(l.id)
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
