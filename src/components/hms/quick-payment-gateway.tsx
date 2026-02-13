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
    ArrowRight, Star, ShieldCheck, Loader2
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
    onSuccess: () => void
}) {
    const [method, setMethod] = useState<'cash' | 'upi' | 'card' | 'bank_transfer'>('cash')
    const [amount, setAmount] = useState<string>(Number(invoice?.total || 0).toString())
    const [reference, setReference] = useState<string>('')
    const [isPending, setIsPending] = useState(false)
    const [step, setStep] = useState<'pay' | 'success'>('pay')

    // Formatted Total
    const total = Number(invoice?.total || 0)

    async function handlePayment() {
        if (!invoice) return

        const payAmount = parseFloat(amount)
        if (isNaN(payAmount)) {
            toast.error("Invalid amount entered")
            return
        }

        setIsPending(true)
        try {
            const res = await recordPayment(
                invoice.id,
                {
                    amount: payAmount,
                    method: method,
                    reference: reference || `AUTO-${Date.now()}`
                }
            )

            if (res.success) {
                setStep('success')
                // We DON'T call onSuccess immediately here because we want to show the success state.
                // The user will click "Done" to close and trigger the parent save.
            } else {
                toast.error(res.error || "Payment recording failed")
            }
        } catch (error: any) {
            toast.error("Critical System Failure: " + error.message)
        } finally {
            setIsPending(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-2xl p-0 border-none rounded-[3rem] overflow-hidden shadow-2xl bg-white dark:bg-slate-950 ring-1 ring-slate-200 dark:ring-white/10">
                <AnimatePresence mode="wait">
                    {step === 'pay' ? (
                        <motion.div
                            key="pay-step"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            className="flex flex-col md:flex-row min-h-[500px]"
                        >
                            {/* Left Column: Audit & Summary */}
                            <div className="flex-1 bg-slate-50 dark:bg-slate-900 p-8 flex flex-col gap-6 border-r border-slate-100 dark:border-white/5">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="h-10 w-10 rounded-xl bg-black flex items-center justify-center shadow-lg border border-white/10">
                                        <ZionaLogo size={24} variant="icon" theme="dark" colorScheme="signature" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Audit Node</h2>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{invoice?.invoice_number}</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="p-5 bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-white/5">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Outstanding</p>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-sm font-bold text-slate-400">₹</span>
                                            <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter italic">{total.toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <div className="p-5 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl border border-indigo-100 dark:border-indigo-500/20">
                                        <p className="text-[9px] font-black text-indigo-600 uppercase tracking-widest mb-1">Expected Settlement</p>
                                        <p className="text-sm font-bold text-slate-600 dark:text-slate-300 leading-relaxed italic">
                                            Collecting payment for institutional registration services. This node will finalize the clinical encounter.
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-auto flex items-center gap-2 opacity-40">
                                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                                    <span className="text-[8px] font-black uppercase tracking-widest">Secure Finance Channel L1</span>
                                </div>
                            </div>

                            {/* Right Column: Collection Matrix */}
                            <div className="flex-[1.2] p-8 flex flex-col gap-8 bg-white dark:bg-slate-950">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Settlement Amount</label>
                                    <div className="relative">
                                        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-black text-xl italic">₹</span>
                                        <input
                                            type="number"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            className="w-full h-16 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-2xl pl-10 pr-6 text-2xl font-black text-slate-900 dark:text-white focus:border-indigo-600 outline-none transition-all"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Payment Channel</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {[
                                            { id: 'cash', icon: BanknoteIcon, label: 'Cash' },
                                            { id: 'upi', icon: Smartphone, label: 'UPI / QR' },
                                            { id: 'card', icon: CreditCard, label: 'Card' },
                                            { id: 'bank_transfer', icon: Star, label: 'Transfer' }
                                        ].map((m) => (
                                            <button
                                                key={m.id}
                                                type="button"
                                                onClick={() => setMethod(m.id as any)}
                                                className={`
                                                    flex items-center gap-3 p-4 rounded-xl border-2 transition-all
                                                    ${method === m.id
                                                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 shadow-md'
                                                        : 'border-slate-100 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-900/50 text-slate-500 hover:border-indigo-100'}
                                                `}
                                            >
                                                <m.icon className="h-4 w-4" />
                                                <span className="text-[10px] font-black uppercase tracking-wider">{m.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Reference Number (Optional)</label>
                                    <input
                                        type="text"
                                        value={reference}
                                        onChange={(e) => setReference(e.target.value)}
                                        className="w-full h-12 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-xl px-4 text-xs font-bold text-slate-600 outline-none focus:border-indigo-500"
                                        placeholder="Txn ID, Check No, or Remarks..."
                                    />
                                </div>

                                <div className="flex gap-3 mt-4">
                                    <Button
                                        variant="ghost"
                                        onClick={onClose}
                                        className="h-16 px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-100"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handlePayment}
                                        disabled={isPending}
                                        className="flex-1 h-16 rounded-2xl bg-indigo-600 text-white font-black text-lg hover:shadow-2xl hover:shadow-indigo-600/20 transition-all flex items-center justify-center gap-3 active:scale-95"
                                    >
                                        {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                                            <>
                                                {parseFloat(amount) === 0 ? 'Post as Credit' : 'Confirm Settlement'}
                                                <ArrowRight className="h-5 w-5" />
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="success-step"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-16 text-center"
                        >
                            <div className="h-28 w-28 rounded-[3rem] bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-emerald-500/10 animate-bounce">
                                <CheckCircle2 className="h-14 w-14 stroke-[3px]" />
                            </div>
                            <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-3 tracking-tighter italic">LEDGER SYNCED</h2>
                            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-12">Financial Cycle Closed • Encouter Finalized</p>

                            <div className="flex flex-col sm:flex-row gap-4 max-w-sm mx-auto">
                                <Button
                                    onClick={() => window.open(`/hms/billing/${invoice?.id}/print`, '_blank')}
                                    className="flex-1 h-16 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform"
                                >
                                    <Printer className="h-5 w-5" /> PRINT
                                </Button>
                                <Button
                                    variant="ghost"
                                    onClick={() => {
                                        onClose();
                                        onSuccess();
                                    }}
                                    className="flex-1 h-16 rounded-2xl text-slate-500 font-black uppercase tracking-widest hover:bg-slate-100"
                                >
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
