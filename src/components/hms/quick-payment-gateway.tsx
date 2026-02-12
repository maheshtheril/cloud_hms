'use client'

import { useState } from "react"
import {
    Dialog, DialogContent, DialogHeader,
    DialogTitle, DialogDescription, DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    CreditCard, Banknote as BanknoteIcon,
    Smartphone, CheckCircle2, Printer,
    ArrowRight, Star, ShieldCheck
} from "lucide-react"
import { ZionaLogo } from "@/components/branding/ziona-logo"
import { recordPayment } from "@/app/actions/billing"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"

export function QuickPaymentGateway({
    isOpen,
    onClose,
    invoice,
    onSuccess
}: {
    isOpen: boolean,
    onClose: () => void,
    invoice: any,
    onSuccess?: () => void
}) {
    const [method, setMethod] = useState<'cash' | 'upi' | 'card'>('cash')
    const [isPending, setIsPending] = useState(false)
    const [step, setStep] = useState<'pay' | 'success'>('pay')

    async function handlePayment() {
        if (!invoice) return
        setIsPending(true)
        const res = await recordPayment(
            invoice.id,
            {
                amount: Number(invoice.total),
                method: method,
                reference: `AUTO-${Date.now()}`
            }
        )


        if (res.success) {
            setStep('success')
            if (onSuccess) onSuccess()
        } else {
            toast.error(res.error)
        }
        setIsPending(false)
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-md p-0 border-none rounded-[2.5rem] overflow-hidden shadow-2xl bg-white dark:bg-slate-900">
                <AnimatePresence mode="wait">
                    {step === 'pay' ? (
                        <motion.div
                            key="pay-step"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            className="p-8"
                        >
                            <div className="flex items-center gap-4 mb-8">
                                <div className="h-12 w-12 rounded-2xl bg-black flex items-center justify-center shadow-2xl shadow-indigo-500/20 border border-white/10 shrink-0">
                                    <ZionaLogo size={32} variant="icon" theme="dark" colorScheme="signature" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">Secure Payment</h2>
                                    <p className="text-sm font-medium text-slate-500">Invoice: {invoice?.invoice_number}</p>
                                </div>
                            </div>

                            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 mb-8">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block px-1">Total Amount Due</span>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-sm font-bold text-slate-400">₹</span>
                                    <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter font-mono">{Number(invoice?.total).toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="space-y-4 mb-8">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Payment Method</span>
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { id: 'cash', icon: BanknoteIcon, label: 'Cash' },
                                        { id: 'upi', icon: Smartphone, label: 'UPI' },
                                        { id: 'card', icon: CreditCard, label: 'Card' }
                                    ].map((m) => (
                                        <button
                                            key={m.id}
                                            type="button"
                                            onClick={() => setMethod(m.id as any)}
                                            className={`
                                                flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all gap-2
                                                ${method === m.id
                                                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 shadow-md scale-105'
                                                    : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 hover:border-indigo-100'}
                                            `}
                                        >
                                            <m.icon className="h-5 w-5" />
                                            <span className="text-[10px] font-black uppercase">{m.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <Button
                                onClick={handlePayment}
                                disabled={isPending}
                                className="w-full h-16 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-lg hover:shadow-xl transition-all hover:opacity-90"
                            >
                                {isPending ? <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Confirm Payment'}
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="success-step"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-12 text-center"
                        >
                            <div className="h-24 w-24 rounded-[2.5rem] bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 flex items-center justify-center mx-auto mb-8 shadow-xl shadow-emerald-500/10 animate-bounce">
                                <CheckCircle2 className="h-12 w-12" />
                            </div>
                            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Payment Verified</h2>
                            <p className="text-slate-500 font-medium mb-8">Patient registration is now legally active. Receipt generated.</p>

                            <div className="flex flex-col gap-3">
                                <Button className="h-14 rounded-2xl bg-indigo-600 text-white font-black hover:bg-indigo-700 transition-colors">
                                    <Printer className="mr-2 h-5 w-5" /> Print Receipt
                                </Button>
                                <Button variant="ghost" onClick={onClose} className="h-12 rounded-xl text-slate-500 font-bold hover:bg-slate-100 dark:hover:bg-slate-800">
                                    Done
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </DialogContent>
        </Dialog>
    )
}
