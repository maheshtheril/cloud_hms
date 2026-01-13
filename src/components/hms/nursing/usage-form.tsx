'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { consumeStock } from "@/app/actions/nursing-inventory"
import { getProductsPremium } from "@/app/actions/inventory"
import { Loader2, Check, ChevronsUpDown, PackageMinus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

interface UsageFormProps {
    patientId: string
    encounterId: string
    patientName: string
    onCancel?: () => void
    onSuccess?: () => void
    isModal?: boolean
}

export function UsageForm({ patientId, encounterId, patientName, onCancel, onSuccess, isModal = false }: UsageFormProps) {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [open, setOpen] = useState(false)
    const [products, setProducts] = useState<any[]>([])
    const [selectedProduct, setSelectedProduct] = useState<any>(null)
    const [quantity, setQuantity] = useState(1)
    const [notes, setNotes] = useState("")
    const [loadingProducts, setLoadingProducts] = useState(false)

    useEffect(() => {
        // Load initial products
        async function load() {
            setLoadingProducts(true)
            const res = await getProductsPremium('', 1);
            if (res.success && res.data) {
                setProducts(res.data)
            }
            setLoadingProducts(false)
        }
        load()
    }, [])

    const handleSearch = async (query: string) => {
        if (!query) return;
        setLoadingProducts(true)
        const res = await getProductsPremium(query, 1);
        if (res.success && res.data) {
            setProducts(res.data)
        }
        setLoadingProducts(false)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedProduct) {
            toast.error("Please select a product")
            return
        }

        setIsSubmitting(true)
        try {
            const result = await consumeStock({
                productId: selectedProduct.id,
                quantity: Number(quantity),
                patientId,
                encounterId,
                notes
            })

            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success("Usage Recorded Successfully")
                if (onSuccess) {
                    onSuccess()
                } else {
                    router.push('/hms/nursing/dashboard')
                }
            }
        } catch (error) {
            toast.error("An unexpected error occurred")
        } finally {
            setIsSubmitting(false)
        }
    }

    const FormContent = (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <Label>Select Material / Consumable</Label>
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="w-full justify-between"
                        >
                            {selectedProduct
                                ? selectedProduct.name
                                : "Search product..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                        <Command shouldFilter={false}>
                            {/* Disable client filtering because we use server search on input */}
                            <CommandInput
                                placeholder="Search inventory..."
                                onValueChange={(val) => handleSearch(val)}
                            />
                            <CommandList>
                                <CommandEmpty>No product found.</CommandEmpty>
                                <CommandGroup>
                                    {products.map((product) => (
                                        <CommandItem
                                            key={product.id}
                                            value={product.name}
                                            onSelect={() => {
                                                setSelectedProduct(product)
                                                setOpen(false)
                                            }}
                                        >
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    selectedProduct?.id === product.id ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                            <div className="flex flex-col">
                                                <span>{product.name}</span>
                                                <span className="text-xs text-slate-400">Stock: {product.totalStock} {product.uom}</span>
                                            </div>
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Quantity</Label>
                    <div className="relative">
                        <Input
                            type="number"
                            min="1"
                            step="0.01"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.valueAsNumber)}
                            className="pr-12 font-bold"
                        />
                        {selectedProduct && (
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-medium">
                                {selectedProduct.uom}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <Label>Notes (Optional)</Label>
                <Textarea
                    placeholder="Reason for usage..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                />
            </div>

            <div className="flex gap-3 pt-4">
                <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => onCancel ? onCancel() : router.back()}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
                    disabled={isSubmitting || !selectedProduct}
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Recording...
                        </>
                    ) : (
                        "Confirm Usage"
                    )}
                </Button>
            </div>

        </form>
    );

    if (isModal) {
        return FormContent;
    }

    return (
        <Card className="w-full max-w-lg mx-auto shadow-lg border-slate-200 dark:border-slate-800">
            <CardHeader className="bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                        <PackageMinus className="h-6 w-6" />
                    </div>
                    <div>
                        <CardTitle className="text-lg">Record Consumption</CardTitle>
                        <CardDescription>
                            For Patient: <span className="font-bold text-slate-800 dark:text-slate-200">{patientName}</span>
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-6">
                {FormContent}
            </CardContent>
        </Card>
    )
}
