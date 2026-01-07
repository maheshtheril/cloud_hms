'use client'

import { useState } from "react"
import { Upload, X, FileSpreadsheet, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { importProductsCSV } from "@/app/actions/inventory"
import { toast } from "sonner"

export function ImportProductModal() {
    const [isOpen, setIsOpen] = useState(false)
    const [isPending, setIsPending] = useState(false)
    const [result, setResult] = useState<any>(null)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsPending(true)
        setResult(null)

        const formData = new FormData(e.currentTarget)
        const res = await importProductsCSV(formData)

        if (res.success) {
            toast.success(`Successfully imported ${res.count} products!`)
            setResult(res)
            router.refresh()
            // Optional: Close after delay
            setTimeout(() => setIsOpen(false), 2000)
        } else {
            toast.error(res.error || "Failed to import")
        }
        setIsPending(false)
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg font-medium shadow-sm transition-colors flex items-center gap-2"
            >
                <Upload className="h-4 w-4" />
                Import CSV
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col p-6 relative animate-in zoom-in-95 duration-200">
                        <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                            <X className="h-5 w-5" />
                        </button>

                        <div className="mb-6">
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                                <FileSpreadsheet className="h-6 w-6 text-green-600" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">Import Products</h2>
                            <p className="text-sm text-gray-500 mt-1">Upload a CSV file to bulk create products.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
                                <input type="file" name="file" accept=".csv" required className="absolute inset-0 opacity-0 cursor-pointer" />
                                <Upload className="h-8 w-8 text-gray-300 mb-3" />
                                <p className="text-sm font-medium text-gray-700">Click to upload or drag and drop</p>
                                <p className="text-xs text-gray-500 mt-1">CSV (Name, SKU, Price, Description, UOM)</p>
                            </div>

                            {/* Template Link / Instructions */}
                            <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                                <p className="font-semibold mb-1">Row Structure (Header optional but recommended):</p>
                                <code className="block bg-gray-100 p-1 rounded mt-1 overflow-x-auto">
                                    Name, SKU, Price, Description, UOM
                                </code>
                                <p className="mt-1">First row is skipped if it contains "Name" or "SKU".</p>
                            </div>

                            {result && (
                                <div className="p-3 bg-green-50 text-green-700 rounded-lg text-sm">
                                    Imported {result.count} products successfully.
                                    {result.errors?.length > 0 && (
                                        <div className="mt-1 text-xs text-red-600">
                                            {result.errors.length} skipped rows (duplicates).
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
                                <button
                                    type="submit"
                                    disabled={isPending}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 disabled:opacity-50"
                                >
                                    {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                                    Upload & Import
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}
