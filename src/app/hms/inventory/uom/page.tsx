import { getUOMs, deleteUOM } from "@/app/actions/inventory"
import { Scale, X, Ruler, Trash2, Box, Edit2, PackageOpen, HelpCircle } from "lucide-react"
import Link from "next/link"
import { CreateUOMForm } from "@/components/inventory/create-uom-form"
import { seedPharmacyUOMs } from "@/app/actions/uom"
import { revalidatePath } from "next/cache"

export default async function UOMMasterPage({
    searchParams
}: {
    searchParams: Promise<{ edit?: string }>
}) {
    const { edit } = await searchParams;
    const uoms = await getUOMs();

    const editInitialData = edit ? uoms.find(u => u.id === edit) : undefined;

    return (
        <div className="min-h-screen bg-gray-50/40 pb-20">
            {/* Ultra Premium Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="absolute inset-0 h-[300px] bg-gradient-to-b from-purple-50/50 to-transparent pointer-events-none" />
                <div className="max-w-7xl mx-auto px-6 py-10 relative z-10">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div className="space-y-2 max-w-2xl">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl shadow-purple-500/20 shadow-lg">
                                    <Scale className="h-7 w-7 text-white" />
                                </div>
                                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                                    Units of Measure
                                </h1>
                            </div>
                            <p className="text-gray-500 text-lg font-medium leading-relaxed pl-[3.25rem]">
                                Define standard packaging dimensions and units for your inventory tracking.
                            </p>
                        </div>
                        <div className="flex items-center gap-3 w-full md:w-auto pl-[3.25rem] md:pl-0">
                            <form action={async () => {
                                'use server'
                                await seedPharmacyUOMs()
                                revalidatePath('/hms/inventory/uom')
                            }}>
                                <button type="submit" className="group flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 hover:text-indigo-800 rounded-xl font-bold transition-all w-full md:w-auto min-w-[200px] shadow-sm">
                                    <PackageOpen className="h-5 w-5" />
                                    Seed Pharmacy Defaults
                                </button>
                            </form>
                            <Link
                                href="/hms/inventory/products"
                                className="group flex justify-center items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 hover:border-gray-300 hover:text-gray-900 transition-all font-bold shadow-sm"
                            >
                                <X className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
                                <span className="hidden sm:inline">Close</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

                    {/* Left Column: Create Form */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="sticky top-8">
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
                                        {editInitialData ? 'Edit Unit' : 'New Unit'}
                                    </h3>
                                    {editInitialData && (
                                        <Link href="/hms/inventory/uom" className="text-sm text-blue-600 hover:text-blue-800 font-bold px-3 py-1.5 bg-blue-50 rounded-lg transition-colors">
                                            Cancel Edit
                                        </Link>
                                    )}
                                </div>
                                <CreateUOMForm initialData={editInitialData} />
                            </div>

                            {/* Info Card */}
                            <div className="mt-8 p-6 bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl border border-gray-700 text-gray-300 shadow-xl">
                                <h4 className="font-bold text-white mb-4 flex items-center gap-2 text-lg">
                                    <HelpCircle className="h-5 w-5 text-purple-400" />
                                    How Dimensions Work
                                </h4>
                                <div className="space-y-4 text-sm font-medium">
                                    <div className="flex gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 shrink-0" />
                                        <p><strong>Base Unit:</strong> The smallest standard form (e.g. PCS). All stock is ultimately counted in Base Units.</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                                        <p><strong>Derived Units:</strong> E.g. "Box of 100". Acts purely as a multiplier against the base.</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                                        <p><strong>Transactions:</strong> You can purchase/sell using ANY unit linked to a dimension.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: List */}
                    <div className="lg:col-span-7">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
                                Configured Units
                                <span className="bg-purple-100 text-purple-700 text-sm font-bold px-3 py-1 rounded-full border border-purple-200 shadow-sm">
                                    {uoms.length}
                                </span>
                            </h2>
                        </div>

                        {uoms.length === 0 ? (
                            <div className="bg-white rounded-3xl border-2 border-dashed border-gray-200 p-16 text-center shadow-sm">
                                <div className="mx-auto h-20 w-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
                                    <Box className="h-10 w-10 text-gray-400/80" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">No Units Found</h3>
                                <p className="text-gray-500 text-lg max-w-md mx-auto font-medium">
                                    Configuration is empty. You can build your own units on the left or seed defaults.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                {uoms.map((u: any, i: number) => {
                                    return (
                                        <div
                                            key={u.id}
                                            className="group bg-white rounded-3xl border border-gray-200 p-6 hover:shadow-xl hover:-translate-y-1 hover:border-purple-300 transition-all duration-300 flex flex-col justify-between h-full relative overflow-hidden"
                                            style={{ animationDelay: `${i * 50}ms` }}
                                        >
                                            {/* Decorative background element */}
                                            <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-gray-50 to-gray-100 rounded-full opacity-50 group-hover:scale-150 group-hover:from-purple-50 group-hover:to-purple-100/50 transition-transform duration-700 ease-out z-0" />

                                            <div className="relative z-10 flex items-start justify-between mb-8">
                                                <div className="h-12 w-12 rounded-2xl flex items-center justify-center transition-colors shadow-sm bg-purple-100 text-purple-600 border border-purple-200">
                                                    <Ruler className="h-6 w-6" />
                                                </div>
                                                <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                                                    <Link
                                                        href={`/hms/inventory/uom?edit=${u.id}`}
                                                        className="p-2.5 bg-gray-50 text-gray-600 hover:text-blue-700 hover:bg-blue-50/80 rounded-xl transition-all shadow-sm"
                                                        title="Edit Unit"
                                                    >
                                                        <Edit2 className="h-4 w-4" />
                                                    </Link>
                                                    <form action={async () => {
                                                        'use server'
                                                        await deleteUOM(u.id)
                                                    }}>
                                                        <button
                                                            type="submit"
                                                            className="p-2.5 bg-gray-50 text-gray-600 hover:text-red-700 hover:bg-red-50/80 rounded-xl transition-all shadow-sm"
                                                            title="Delete Unit"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </form>
                                                </div>
                                            </div>

                                            <div className="relative z-10">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="font-extrabold text-gray-900 text-xl tracking-tight">
                                                        {u.name}
                                                    </h3>
                                                    {u.uom_type === 'reference' ? (
                                                        <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-purple-100 text-purple-700 uppercase tracking-widest shadow-sm border border-purple-200">
                                                            Base Unit
                                                        </span>
                                                    ) : (
                                                        <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-blue-100 text-blue-700 uppercase tracking-widest shadow-sm border border-blue-200">
                                                            {`1 ${u.name} = ${Number(u.ratio)} Base Units`}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
