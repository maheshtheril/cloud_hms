'use client'

import { useState } from "react"
import { ProductForm } from "@/components/inventory/product-form"
import { Plus, X } from "lucide-react"
import { useRouter } from "next/navigation"

interface CreateProductModalProps {
    suppliers: any[]
    taxRates: any[]
    uoms: any[]
    categories: any[]
    manufacturers: any[]
    uomCategories: any[]
}

export function CreateProductModal({
    suppliers,
    taxRates,
    uoms,
    categories,
    manufacturers,
    uomCategories
}: CreateProductModalProps) {
    const [isOpen, setIsOpen] = useState(false)
    const router = useRouter()

    const handleSuccess = () => {
        setIsOpen(false)
        router.refresh()
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-md shadow-blue-900/10 transition-colors flex items-center gap-2"
            >
                <Plus className="h-4 w-4" />
                Create Product
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl h-[95vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 ring-1 ring-black/5">
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                            <ProductForm
                                suppliers={suppliers}
                                taxRates={taxRates}
                                uoms={uoms}
                                categories={categories}
                                manufacturers={manufacturers}
                                uomCategories={uomCategories}
                                onSuccess={handleSuccess}
                                onCancel={() => setIsOpen(false)}
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
