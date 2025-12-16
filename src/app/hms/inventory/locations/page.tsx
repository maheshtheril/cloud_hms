
import { getLocations, createLocation, deleteLocation } from "@/app/actions/inventory"
import { Plus, Trash2, MapPin, Warehouse, X } from "lucide-react"
import Link from "next/link"

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
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-fit sticky top-6">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        New Location
                    </h2>
                    <form action={createLocation} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Location Name <span className="text-red-500">*</span></label>
                            <input
                                name="name"
                                required
                                placeholder="e.g. Main Warehouse, Shelf A5"
                                className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Short Code</label>
                            <input
                                name="code"
                                placeholder="e.g. WH-01"
                                className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all uppercase"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                            <select
                                name="type"
                                className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all"
                            >
                                <option value="internal">Internal Warehouse</option>
                                <option value="transit">Transit</option>
                                <option value="supplier">Vendor Location</option>
                                <option value="customer">Customer Location</option>
                                <option value="scrap">Scrap / Loss</option>
                            </select>
                        </div>
                        <button
                            type="submit"
                            className="w-full py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium flex items-center justify-center gap-2"
                        >
                            <Plus className="h-4 w-4" />
                            Add Location
                        </button>
                    </form>
                </div>

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
