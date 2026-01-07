'use client'

import { useState } from "react"
import { Upload, X, FileSpreadsheet, Loader2, Download, AlertTriangle, CheckCircle, Info } from "lucide-react"
import { useRouter } from "next/navigation"
import { importProductsCSV } from "@/app/actions/inventory"
import { toast } from "sonner"

export function ImportProductModal() {
    const [isOpen, setIsOpen] = useState(false)
    const [isPending, setIsPending] = useState(false)
    const [result, setResult] = useState<any>(null)
    const router = useRouter()

    const handleDownloadTemplate = () => {
        const headers = [
            "Name", "SKU", "Barcode", "Category", "UOM",
            "Sale Price", "MRP", "Purchase Price", "Tax Rate (%)",
            "Opening Stock", "Batch No", "Expiry Date (YYYY-MM-DD)",
            "Brand", "Manufacturer", "Description"
        ];
        const sampleRow = [
            "Paracetamol 500mg", "MED001", "8901234567890", "Medicine", "STRIP",
            "25.00", "30.00", "15.50", "12",
            "100", "BATCH001", "2026-12-31",
            "GSK", "GlaxoSmithKline", "Fever reducer"
        ];

        const csvContent = [headers.join(','), sampleRow.join(',')].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'hms_product_import_template.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsPending(true)
        setResult(null)

        const formData = new FormData(e.currentTarget)
        const res = await importProductsCSV(formData)

        if (res.success) {
            toast.success(`Successfully processed import!`)
            setResult(res)
            router.refresh()
        } else {
            toast.error(res.error || "Failed to import")
        }
        setIsPending(false)
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg font-medium shadow-sm transition-colors flex items-center gap-2 group"
            >
                <div className="bg-green-100 p-1 rounded-md text-green-700 group-hover:bg-green-200 transition-colors">
                    <FileSpreadsheet className="h-4 w-4" />
                </div>
                Import Products
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col p-8 relative animate-in zoom-in-95 duration-200 ring-1 ring-white/20">
                        <button onClick={() => setIsOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full">
                            <X className="h-5 w-5" />
                        </button>

                        <div className="mb-8">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                                    <Upload className="h-7 w-7 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">Bulk Product Import</h2>
                                    <p className="text-sm text-gray-500 mt-1">Upload your inventory data to populate the registry instantly.</p>
                                </div>
                            </div>
                        </div>

                        {!result ? (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Instructions & Template */}
                                <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                                    <div className="flex gap-3">
                                        <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                                        <div className="text-sm text-blue-900">
                                            <p className="font-semibold">Prepare your CSV file</p>
                                            <p className="opacity-80">Download our standardized template to ensure correct formatting.</p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleDownloadTemplate}
                                        className="whitespace-nowrap px-4 py-2 bg-white border border-blue-200 text-blue-700 font-medium rounded-lg hover:bg-blue-50 text-sm flex items-center gap-2 shadow-sm"
                                    >
                                        <Download className="h-4 w-4" />
                                        Download Template
                                    </button>
                                </div>

                                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-10 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer relative group">
                                    <input type="file" name="file" accept=".csv" required className="absolute inset-0 opacity-0 cursor-pointer" />
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <FileSpreadsheet className="h-8 w-8 text-gray-400 group-hover:text-blue-600 transition-colors" />
                                    </div>
                                    <p className="text-lg font-semibold text-gray-900">Drag & drop or click to upload CSV</p>
                                    <p className="text-sm text-gray-500 mt-2">Supports Name, SKU, Prices (Sale/MRP), Stock, Batch, Tax, etc.</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
                                    <div className="space-y-1">
                                        <p className="font-medium text-gray-900">Supported Columns:</p>
                                        <ul className="list-disc pl-4 space-y-0.5">
                                            <li>Name, SKU, Barcode</li>
                                            <li>Prices: Sale, MRP, Purchase</li>
                                            <li>Tax Rate (matches by %)</li>
                                        </ul>
                                    </div>
                                    <div className="space-y-1 pt-5">
                                        <ul className="list-disc pl-4 space-y-0.5">
                                            <li>Stock: Opening Qty, Batch No, Expiry</li>
                                            <li>Category, Brand, Manufacturer</li>
                                            <li>UOM (Unit of Measure)</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
                                    <button type="button" onClick={() => setIsOpen(false)} className="px-5 py-2.5 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors">
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isPending}
                                        className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-70 disabled:shadow-none flex items-center gap-2"
                                    >
                                        {isPending ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                Processing File...
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="h-4 w-4" />
                                                Start Import
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-6 animate-in slide-in-from-bottom-4 fade-in duration-300">
                                <div className={`p-6 rounded-2xl flex flex-col items-center text-center ${result.success && result.count > 0 ? 'bg-green-50 text-green-900' : 'bg-orange-50 text-orange-900'}`}>
                                    {result.success && result.count > 0 ? (
                                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                                            <CheckCircle className="h-6 w-6 text-green-600" />
                                        </div>
                                    ) : (
                                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-3">
                                            <AlertTriangle className="h-6 w-6 text-orange-600" />
                                        </div>
                                    )}
                                    <h3 className="text-xl font-bold">
                                        {result.success && result.count > 0 ? 'Import Complete!' : 'Import Finished with Warnings'}
                                    </h3>
                                    <p className="mt-1 opacity-90">
                                        Processed <strong>{result.count}</strong> products successfully.
                                    </p>
                                </div>

                                {result.errors?.length > 0 && (
                                    <div className="border border-red-100 rounded-xl overflow-hidden">
                                        <div className="bg-red-50 px-4 py-3 border-b border-red-100 flex items-center gap-2">
                                            <AlertTriangle className="h-4 w-4 text-red-600" />
                                            <h4 className="font-semibold text-red-900 text-sm">Errors & Skipped Rows ({result.errors.length})</h4>
                                        </div>
                                        <div className="max-h-48 overflow-y-auto bg-white p-2">
                                            <table className="w-full text-xs text-left">
                                                <thead className="text-gray-500 bg-gray-50 sticky top-0">
                                                    <tr>
                                                        <th className="px-3 py-2">Row</th>
                                                        <th className="px-3 py-2">Error Detail</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-100">
                                                    {result.errors.map((err: any, idx: number) => (
                                                        <tr key={idx} className="hover:bg-gray-50">
                                                            <td className="px-3 py-1.5 font-mono text-gray-600">#{err.row}</td>
                                                            <td className="px-3 py-1.5 text-red-600">{err.error}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}

                                <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
                                    <button
                                        onClick={() => { setResult(null); setIsOpen(false); }}
                                        className="px-6 py-2.5 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
                                    >
                                        Close & View Products
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    )
}
