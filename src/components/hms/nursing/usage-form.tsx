'use client'

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { consumeStockBulk, ConsumptionItem } from "@/app/actions/nursing-inventory"
import { getProductsPremium } from "@/app/actions/inventory"
import { Loader2, Check, ChevronsUpDown, PackageMinus, Plus, Trash2, ShoppingCart, Info, ScanLine, X } from "lucide-react"
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
import { AnimatePresence, motion } from "framer-motion"

interface UsageFormProps {
    patientId: string
    encounterId: string
    patientName: string
    onCancel?: () => void
    onSuccess?: () => void
    isModal?: boolean
}

type CartItem = ConsumptionItem & {
    productName: string
    uom: string
    stock: number
    id: string // Temporary ID for UI handling
}

export function UsageForm({ patientId, encounterId, patientName, onCancel, onSuccess, isModal = false }: UsageFormProps) {
    const router = useRouter()
    const { toast } = useToast()
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Search & Add State
    const [open, setOpen] = useState(false)
    const [products, setProducts] = useState<any[]>([])
    const [loadingProducts, setLoadingProducts] = useState(false)

    // Cart State
    const [cart, setCart] = useState<CartItem[]>([])

    // Current Item State (Transient)
    const [selectedProduct, setSelectedProduct] = useState<any>(null)
    const [quantity, setQuantity] = useState(1)
    const [notes, setNotes] = useState("")

    useEffect(() => {
        loadProducts()
    }, [])

    async function loadProducts(query: string = '') {
        setLoadingProducts(true)
        const res = await getProductsPremium(query, 1);
        if (res.success && res.data) {
            setProducts(res.data)
        }
        setLoadingProducts(false)
    }

    const handleSearch = (query: string) => {
        loadProducts(query)
    }

    const addItem = () => {
        if (!selectedProduct) return;
        if (quantity <= 0) {
            toast({
                title: "Invalid Quantity",
                description: "Quantity must be greater than 0",
                variant: "destructive"
            })
            return
        }

        const newItem: CartItem = {
            id: Math.random().toString(36).substr(2, 9),
            productId: selectedProduct.id,
            productName: selectedProduct.name,
            quantity: Number(quantity),
            uom: selectedProduct.uom,
            stock: selectedProduct.totalStock,
            notes: notes
        }

        setCart(prev => [...prev, newItem])

        // Reset Inputs
        setSelectedProduct(null)
        setQuantity(1)
        setNotes("")
        setOpen(false) // Close dropdown if open
        toast({
            description: "Item added to list",
        })
    }

    const removeItem = (id: string) => {
        setCart(prev => prev.filter(item => item.id !== id))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (cart.length === 0) {
            toast({
                title: "Cart Empty",
                description: "Please add at least one item",
                variant: "destructive"
            })
            return
        }

        setIsSubmitting(true)
        try {
            const result = await consumeStockBulk({
                items: cart.map(({ productId, quantity, notes }) => ({ productId, quantity, notes })),
                patientId,
                encounterId
            })

            if (result.error) {
                toast({
                    title: "Error",
                    description: result.error,
                    variant: "destructive"
                })
                setIsSubmitting(false)
            } else {
                toast({
                    title: "Success",
                    description: "All items recorded successfully",
                })
                // Delay closing to allow user to see the success message
                setTimeout(() => {
                    setIsSubmitting(false)
                    if (onSuccess) {
                        onSuccess()
                    } else {
                        router.push('/hms/nursing/dashboard')
                    }
                }, 1000)
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "An unexpected error occurred",
                variant: "destructive"
            })
            setIsSubmitting(false)
        }
    }

    const CartList = () => (
        <div className="space-y-3 mb-6 bg-slate-50/50 dark:bg-slate-900/50 rounded-xl p-4 border border-slate-100 dark:border-slate-800 h-[300px] overflow-y-auto">
            <AnimatePresence>
                {cart.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400">
                        <ShoppingCart className="h-12 w-12 mb-3 opacity-20" />
                        <p className="text-sm font-medium">Consumption list is empty</p>
                        <p className="text-xs">Add items above to record usage</p>
                    </div>
                ) : (
                    cart.map((item) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm flex items-start gap-3 group"
                        >
                            <div className="h-10 w-10 rounded bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 shrink-0">
                                <PackageMinus className="h-5 w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                    <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate pr-2">{item.productName}</h4>
                                    <span className="font-mono text-xs font-bold bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-slate-600 dark:text-slate-300">
                                        {item.quantity} {item.uom}
                                    </span>
                                </div>
                                {item.notes && (
                                    <p className="text-xs text-slate-500 mt-1 italic">"{item.notes}"</p>
                                )}
                                <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-400">
                                    <span>Stock: {item.stock}</span>
                                    <span>•</span>
                                    <span>ID: {item.productId.slice(0, 8)}...</span>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => removeItem(item.id)}
                                className="opacity-0 group-hover:opacity-100 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </motion.div>
                    ))
                )}
            </AnimatePresence>
        </div>
    )

    const FormContent = (
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
            {/* Quick Add Section */}
            <div className="grid grid-cols-12 gap-3 mb-4 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                <div className="col-span-12 md:col-span-6 space-y-1.5">
                    <Label className="text-xs font-bold text-slate-500 uppercase">Select Consumable</Label>
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={open}
                                className="w-full justify-between bg-white dark:bg-slate-800"
                            >
                                {selectedProduct ? (
                                    <span className="truncate font-medium">{selectedProduct.name}</span>
                                ) : (
                                    <span className="text-slate-400">Search sku, name...</span>
                                )}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[300px] p-0" align="start">
                            <Command shouldFilter={false}>
                                <CommandInput
                                    placeholder="Search inventory..."
                                    onValueChange={handleSearch}
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
                                                    <span className="font-medium">{product.name}</span>
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

                <div className="col-span-6 md:col-span-3 space-y-1.5">
                    <Label className="text-xs font-bold text-slate-500 uppercase">Quantity</Label>
                    <div className="relative">
                        <Input
                            type="number"
                            min="0.1"
                            step="0.1"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.valueAsNumber)}
                            className="bg-white dark:bg-slate-800 font-bold"
                        />
                        {selectedProduct && (
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] uppercase font-bold text-slate-400">
                                {selectedProduct.uom}
                            </span>
                        )}
                    </div>
                </div>

                <div className="col-span-6 md:col-span-3 flex items-end">
                    <Button
                        type="button"
                        onClick={addItem}
                        disabled={!selectedProduct}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                    >
                        <Plus className="h-4 w-4 mr-2" /> Add
                    </Button>
                </div>

                <div className="col-span-12 space-y-1.5 hidden md:block">
                    {/* Optional Notes for row - Mobile hidden for compact view or expandable */}
                </div>
            </div>

            {/* List of Added Items */}
            <CartList />

            {/* Footer Actions */}
            <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                <Button
                    type="button"
                    variant="outline"
                    className="font-bold text-slate-500"
                    onClick={() => onCancel ? onCancel() : router.back()}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-8 shadow-lg shadow-orange-600/20"
                    disabled={isSubmitting || cart.length === 0}
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Success...
                        </>
                    ) : (
                        `Confirm (${cart.length} Items)`
                    )}
                </Button>
            </div>
        </form>
    );

    if (isModal) {
        return (
            <div className="h-full flex flex-col">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                                <ScanLine className="h-5 w-5" />
                            </div>
                            Record Consumption
                        </h2>
                        <p className="text-sm text-slate-500 mt-1 pl-1">
                            Patient: <span className="font-bold text-slate-800 dark:text-slate-200">{patientName}</span>
                        </p>
                    </div>
                    <div className="text-right hidden sm:block">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Encounter ID</div>
                        <div className="font-mono text-xs text-slate-600">#{encounterId.slice(0, 8)}</div>
                    </div>
                </div>
                {FormContent}
            </div>
        )
    }

    return (
        <Card className="w-full max-w-2xl mx-auto shadow-xl border-slate-200 dark:border-slate-800">
            <CardHeader className="bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 shadow-sm">
                        <PackageMinus className="h-6 w-6" />
                    </div>
                    <div>
                        <CardTitle className="text-xl">Record Consumption</CardTitle>
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
