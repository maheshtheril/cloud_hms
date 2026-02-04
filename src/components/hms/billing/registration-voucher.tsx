'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
    Printer,
    Save,
    CreditCard,
    User,
    Calendar,
    Info,
    Plus,
    Trash2,
    FileText,
    CheckCircle2,
    AlertCircle,
    Banknote,
    Smartphone,
    Wallet
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { PatientSearchWithCreate } from "./patient-search-dialog"
import { createInvoice } from "@/app/actions/billing"
import { AccountingService } from "@/lib/services/accounting"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface RegistrationVoucherProps {
    initialSettings: {
        registrationFee: number
        registrationProductId: string | null
        registrationProductName: string
        registrationProductDescription: string
    }
}

export function RegistrationVoucher({ initialSettings }: RegistrationVoucherProps) {
    const router = useRouter()
    const { toast } = useToast()
    const [isPending, setIsPending] = useState(false)
    const [selectedPatient, setSelectedPatient] = useState<any>(null)
    const [items, setItems] = useState<any[]>([])
    const [showPaymentDialog, setShowPaymentDialog] = useState(false)
    const [paymentMethod, setPaymentMethod] = useState<string>("cash")

    // Auto-select registration fee item on mount or when settings change
    useEffect(() => {
        if (initialSettings.registrationProductId) {
            setItems([
                {
                    id: initialSettings.registrationProductId,
                    name: initialSettings.registrationProductName,
                    description: initialSettings.registrationProductDescription,
                    quantity: 1,
                    price: initialSettings.registrationFee,
                    tax: 0,
                    total: initialSettings.registrationFee
                }
            ])
        }
    }, [initialSettings])

    const total = items.reduce((sum, i) => sum + i.total, 0)

    async function handleSaveAndPost() {
        if (!selectedPatient) {
            toast({ title: "Identification Required", description: "Please select or register a patient first.", variant: "destructive" })
            return
        }
        setShowPaymentDialog(true)
    }

    async function handleConfirmPayment() {
        setIsPending(true)
        setShowPaymentDialog(false)
        try {
            const invoicePayload = {
                patient_id: selectedPatient.id,
                date: new Date().toISOString(),
                status: 'paid' as any, // Post as Paid immediately
                line_items: items.map(item => ({
                    product_id: item.id,
                    description: item.name,
                    quantity: item.quantity,
                    unit_price: item.price,
                    tax_amount: 0,
                    discount_amount: 0
                })),
                payments: [{
                    amount: total,
                    method: paymentMethod, // 'cash', 'card', 'upi'
                    reference: `Counter Payment`
                }]
            }

            const res = await createInvoice(invoicePayload)

            if (res.error) {
                toast({ title: "Financial Error", description: res.error, variant: "destructive" })
            } else if (res.success && res.data) {
                toast({ title: "Success", description: "Registration completed and paid." })
                // Redirect to receipt/invoice view
                router.push(`/hms/billing/${res.data.id}?print=true`)
            }
        } catch (err: any) {
            toast({ title: "System Crash", description: err.message, variant: "destructive" })
        } finally {
            setIsPending(false)
        }
    }

    return (
        <div className="space-y-6 max-w-6xl mx-auto px-4 py-8">
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Registration Voucher</h1>
                    <p className="text-slate-500 text-sm mt-1">Efficient Patient Onboarding & Revenue Capture</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="flex items-center gap-2" onClick={() => router.back()}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSaveAndPost}
                        disabled={isPending || !selectedPatient}
                        className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 shadow-lg shadow-blue-500/20 px-6 py-5 rounded-full"
                    >
                        {isPending ? "Posting Ledger..." : "Save & Post to Accounts"}
                        <Save className="h-4 w-4" />
                    </Button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Patient Section */}
                    <Card className="border-0 shadow-md bg-white dark:bg-slate-900 overflow-hidden">
                        <CardHeader className="bg-slate-50/50 dark:bg-slate-800/50 py-4">
                            <CardTitle className="text-lg font-bold flex items-center gap-2">
                                <User className="h-5 w-5 text-blue-500" />
                                Patient Selection
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <PatientSearchWithCreate
                                onSelect={setSelectedPatient}
                                selectedPatientId={selectedPatient?.id}
                            />

                            {selectedPatient && (
                                <div className="mt-6 flex items-start gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
                                    <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600">
                                        <User className="h-6 w-6" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold text-slate-900 dark:text-white text-lg">{selectedPatient.name}</h3>
                                            <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100">{selectedPatient.patient_number}</Badge>
                                        </div>
                                        <div className="text-sm text-slate-500 flex items-center gap-4 mt-1">
                                            <span className="flex items-center gap-1"><CreditCard className="h-3 w-3" /> {selectedPatient.phone}</span>
                                            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Walk-in Patient</span>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="sm" onClick={() => setSelectedPatient(null)} className="text-slate-400 hover:text-red-500">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Billing Items */}
                    <Card className="border-0 shadow-md bg-white dark:bg-slate-900 overflow-hidden">
                        <CardHeader className="bg-slate-50/50 dark:bg-slate-800/50 py-4 flex flex-row items-center justify-between">
                            <CardTitle className="text-lg font-bold flex items-center gap-2">
                                <FileText className="h-5 w-5 text-blue-500" />
                                Service Items
                            </CardTitle>
                            <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50 h-8 gap-1">
                                <Plus className="h-4 w-4" /> Add Extra
                            </Button>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader className="bg-slate-50 dark:bg-slate-800/30">
                                    <TableRow>
                                        <TableHead className="pl-6">SERVICE DESCRIPTION</TableHead>
                                        <TableHead>QTY</TableHead>
                                        <TableHead className="text-right">PRICE</TableHead>
                                        <TableHead className="text-right pr-6">TOTAL</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {items.map((item, idx) => (
                                        <TableRow key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                                            <TableCell className="pl-6 py-4">
                                                <div className="font-medium text-slate-900 dark:text-white">{item.name}</div>
                                                <div className="text-xs text-slate-500">{item.description}</div>
                                            </TableCell>
                                            <TableCell className="py-4">
                                                <Badge variant="outline" className="font-mono">{item.quantity}</Badge>
                                            </TableCell>
                                            <TableCell className="text-right font-mono py-4">
                                                {item.price.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                                            </TableCell>
                                            <TableCell className="text-right pr-6 font-bold text-slate-900 dark:text-white py-4">
                                                {item.total.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {items.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={4} className="h-32 text-center text-slate-400">
                                                No items selected.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>

                {/* Summary & Posting info */}
                <div className="space-y-6">
                    <Card className="border-0 shadow-lg bg-slate-900 text-white overflow-hidden">
                        <CardHeader className="pb-2 border-b border-slate-800">
                            <CardTitle className="text-sm font-medium text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                <CreditCard className="h-4 w-4" />
                                Payment Summary
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-slate-400">
                                    <span>Subtotal</span>
                                    <span className="font-mono">₹{total.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center text-slate-400">
                                    <span>Tax (0%)</span>
                                    <span className="font-mono">₹0.00</span>
                                </div>
                                <Separator className="bg-slate-800" />
                                <div className="flex justify-between items-center pt-2">
                                    <span className="text-xl font-bold">Total Amount</span>
                                    <span className="text-3xl font-black text-blue-400 font-mono">₹{total.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="mt-8 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-tight mb-3">
                                    <Info className="h-3.5 w-3.5" />
                                    Accounting Impact
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <div className="h-5 w-5 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 shrink-0">
                                            <CheckCircle2 className="h-3 w-3" />
                                        </div>
                                        <p className="text-xs text-slate-300">New entry in **Sales Ledger** (Income)</p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="h-5 w-5 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500 shrink-0">
                                            <CheckCircle2 className="h-3 w-3" />
                                        </div>
                                        <p className="text-xs text-slate-300">Outstanding balance added to **Patient Account**</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-md bg-amber-50 border-amber-100">
                        <CardContent className="p-4 flex items-start gap-3">
                            <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
                            <div className="text-xs text-amber-800 leading-relaxed font-medium">
                                Once posted, the patient will be automatically "Checked-In" for today's visit. This voucher acts as the financial clearance.
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Payment Options Dialog */}
            <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
                <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-none shadow-2xl rounded-2xl">
                    <DialogHeader className="p-6 bg-slate-900 text-white">
                        <DialogTitle className="text-xl font-black flex items-center gap-2">
                            <Wallet className="h-5 w-5 text-indigo-400" />
                            COLLECT PAYMENT
                        </DialogTitle>
                        <DialogDescription className="text-slate-400 font-medium">
                            Select payment method to complete registration for {selectedPatient?.name}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="p-6 space-y-6 bg-white dark:bg-slate-950">
                        <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                            <span className="text-slate-500 font-bold uppercase text-xs tracking-widest">Total Payable</span>
                            <span className="text-2xl font-black text-slate-900 dark:text-white">₹{total.toFixed(2)}</span>
                        </div>

                        <div className="space-y-3">
                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 block">Choose Payment Mode</Label>
                            <RadioGroup
                                defaultValue="cash"
                                value={paymentMethod}
                                onValueChange={setPaymentMethod}
                                className="grid grid-cols-1 gap-3"
                            >
                                <Label
                                    htmlFor="mode-cash"
                                    className={cn(
                                        "flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer group",
                                        paymentMethod === "cash" ? "border-indigo-600 bg-indigo-50/50 ring-4 ring-indigo-50" : "border-slate-100 hover:border-slate-200"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            "h-10 w-10 rounded-full flex items-center justify-center transition-colors",
                                            paymentMethod === "cash" ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-400 group-hover:bg-slate-200"
                                        )}>
                                            <Banknote className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <span className="font-bold text-slate-900 dark:text-white block">Cash Payment</span>
                                            <span className="text-[10px] text-slate-500 font-medium">Physical currency received at counter</span>
                                        </div>
                                    </div>
                                    <RadioGroupItem value="cash" id="mode-cash" className="sr-only" />
                                </Label>

                                <Label
                                    htmlFor="mode-upi"
                                    className={cn(
                                        "flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer group",
                                        paymentMethod === "upi" ? "border-indigo-600 bg-indigo-50/50 ring-4 ring-indigo-50" : "border-slate-100 hover:border-slate-200"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            "h-10 w-10 rounded-full flex items-center justify-center transition-colors",
                                            paymentMethod === "upi" ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-400 group-hover:bg-slate-200"
                                        )}>
                                            <Smartphone className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <span className="font-bold text-slate-900 dark:text-white block">UPI / Digital Quick Pay</span>
                                            <span className="text-[10px] text-slate-500 font-medium">GPay, PhonePe, or Scan & Pay</span>
                                        </div>
                                    </div>
                                    <RadioGroupItem value="upi" id="mode-upi" className="sr-only" />
                                </Label>

                                <Label
                                    htmlFor="mode-card"
                                    className={cn(
                                        "flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer group",
                                        paymentMethod === "card" ? "border-indigo-600 bg-indigo-50/50 ring-4 ring-indigo-50" : "border-slate-100 hover:border-slate-200"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            "h-10 w-10 rounded-full flex items-center justify-center transition-colors",
                                            paymentMethod === "card" ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-400 group-hover:bg-slate-200"
                                        )}>
                                            <CreditCard className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <span className="font-bold text-slate-900 dark:text-white block">Credit / Debit Card</span>
                                            <span className="text-[10px] text-slate-500 font-medium">Swipe or Dip Card via EDC machine</span>
                                        </div>
                                    </div>
                                    <RadioGroupItem value="card" id="mode-card" className="sr-only" />
                                </Label>
                            </RadioGroup>
                        </div>
                    </div>

                    <DialogFooter className="p-6 bg-slate-50 dark:bg-slate-900 flex sm:justify-between items-center gap-4">
                        <Button variant="ghost" onClick={() => setShowPaymentDialog(false)} className="font-bold text-slate-500">
                            Back to Voucher
                        </Button>
                        <Button
                            onClick={handleConfirmPayment}
                            disabled={isPending}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-black px-10 h-12 rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none transition-all active:scale-95"
                        >
                            {isPending ? "Processing..." : "Finish & Post Transaction"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
