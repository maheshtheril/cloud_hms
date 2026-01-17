'use client'

import { useState, useEffect } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { CalendarIcon, Loader2, Plus, Trash2, Save, Printer, ArrowRight } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { useToast } from "@/components/ui/use-toast"
import { recordExpense } from "@/app/actions/accounting/expenses"
import { getExpenseAccounts } from "@/app/actions/accounting/payments"
import { cn } from "@/lib/utils"
import { SearchableSelect } from "@/components/ui/searchable-select"
import { Badge } from "@/components/ui/badge"

// Tally Style Schema
const lineItemSchema = z.object({
    categoryId: z.string().min(1, "Ledger required"),
    amount: z.coerce.number().min(0.01, "Amount required"),
})

const expenseSchema = z.object({
    date: z.date(),
    sourceAccount: z.string().default('cash'), // Represents Cash/Bank Ledger
    lines: z.array(lineItemSchema).min(1, "Select at least one ledger"),
    narration: z.string().optional()
})

interface ExpenseDialogProps {
    onClose: () => void
    onSuccess?: () => void
}

export function ExpenseDialog({ onClose, onSuccess }: ExpenseDialogProps) {
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)
    const [accounts, setAccounts] = useState<{ id: string; name: string; code: string }[]>([])
    // Mock Voucher No - real one comes from backend
    const voucherNo = "Auto"

    useEffect(() => {
        const fetchAccounts = async () => {
            const res = await getExpenseAccounts();
            if (res.success && res.data) {
                setAccounts(res.data);
            }
        };
        fetchAccounts();
    }, []);

    const form = useForm({
        resolver: zodResolver(expenseSchema),
        defaultValues: {
            date: new Date(),
            sourceAccount: "cash",
            lines: [{ categoryId: "", amount: 0 }],
            narration: ""
        }
    })

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "lines"
    })

    const totalAmount = form.watch("lines").reduce((sum, line) => sum + (Number(line.amount) || 0), 0);

    const onSubmit = async (values: z.infer<typeof expenseSchema>) => {
        setLoading(true)
        try {
            // Aggregate lines for simple backend recording for now
            // To properly mimicking Tally, we record one transaction with multiple splits.
            const primaryLine = values.lines[0]; // Fallback for single-line backend

            // Build a rich narration if multiple lines
            const combinedMemo = values.lines.map(l => {
                const accName = accounts.find(a => a.id === l.categoryId)?.name || 'Exp';
                return `${accName}: ${l.amount}`;
            }).join(', ');

            const finalMemo = values.narration ? `${values.narration} (${combinedMemo})` : combinedMemo;

            const result = await recordExpense({
                amount: totalAmount,
                categoryId: primaryLine.categoryId,
                payeeName: "Cash Expense", // Generic payee for Tally style
                memo: finalMemo,
                date: values.date,
                method: values.sourceAccount
            })

            if (result.success) {
                toast({
                    title: "Voucher Saved",
                    description: `Payment Voucher ${result.data?.payment_number} created.`,
                    className: "bg-emerald-50 border-emerald-200"
                })
                onSuccess?.()
                onClose()
            } else {
                toast({ title: "Error", description: result.error || "Failed", variant: "destructive" })
            }
        } catch (error) {
            console.error(error)
            toast({ title: "Error", description: "Something went wrong", variant: "destructive" });
        } finally {
            setLoading(false)
        }
    }

    const accountOptions = accounts.map(acc => ({
        id: acc.id,
        label: acc.name,
        subLabel: acc.code
    }));

    return (
        <div className="bg-[#fff9e6] dark:bg-slate-900 flex flex-col h-full max-h-[85vh] w-full font-mono text-sm border-t-4 border-teal-700">
            {/* Tally Header */}
            <div className="bg-teal-700 text-yellow-400 px-4 py-2 flex justify-between items-center shadow-md">
                <div className="flex items-center gap-4">
                    <span className="font-bold text-lg tracking-wider">Accounting Voucher Creation</span>
                </div>
                <div className="text-xs text-white opacity-80">
                    SaaS ERP Gateway
                </div>
            </div>

            {/* Top Info Bar */}
            <div className="bg-[#fff9e6] dark:bg-slate-900 p-4 border-b border-teal-700/20 grid grid-cols-2 gap-8">
                <div className="flex items-center gap-2">
                    <span className="font-bold text-teal-900 dark:text-teal-400 w-24">Payment No:</span>
                    <span className="font-bold text-black dark:text-white">{voucherNo}</span>
                </div>
                <div className="flex items-center gap-2 justify-end">
                    <span className="font-bold text-teal-900 dark:text-teal-400">Date:</span>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="h-8 border-teal-700/30 bg-white text-teal-900 font-bold">
                                {format(form.watch("date"), "dd-MMM-yyyy")}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar mode="single" selected={form.watch("date")} onSelect={(d) => d && form.setValue("date", d)} initialFocus />
                        </PopoverContent>
                    </Popover>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-[#fff9e6] dark:bg-slate-950">
                <Form {...form}>
                    <form className="space-y-6 max-w-4xl mx-auto">

                        {/* Account Selection (Source) */}
                        <div className="flex items-center gap-4 py-2">
                            <span className="font-bold text-teal-900 dark:text-teal-400 w-24 text-right">Account :</span>
                            <div className="w-[300px]">
                                <SearchableSelect
                                    value={form.watch("sourceAccount")}
                                    onChange={(val) => form.setValue("sourceAccount", val || "cash")}
                                    options={[
                                        { id: "cash", label: "Cash Account", subLabel: "Cur Bal: 50,000 Dr" },
                                        { id: "bank", label: "HDFC Bank", subLabel: "Cur Bal: 1,20,000 Dr" }
                                    ]}
                                    onSearch={async (q) => {
                                        const opts = [
                                            { id: "cash", label: "Cash Account", subLabel: "Cur Bal: 50,000 Dr" },
                                            { id: "bank", label: "HDFC Bank", subLabel: "Cur Bal: 1,20,000 Dr" }
                                        ];
                                        return opts.filter(o => o.label.toLowerCase().includes(q.toLowerCase()));
                                    }}
                                    placeholder="Select Cash/Bank"
                                    className="bg-white border-b-2 border-teal-700/20 rounded-none focus:ring-0"
                                />
                            </div>
                            <span className="text-xs text-slate-500 italic">Cur Bal: 50,000.00 Dr</span>
                        </div>

                        {/* Particulars Grid */}
                        <div className="border border-teal-700/30 bg-white dark:bg-slate-900">
                            {/* Grid Header */}
                            <div className="flex border-b border-teal-700/30 bg-teal-50 dark:bg-teal-900/20 font-bold text-teal-900 dark:text-teal-400">
                                <div className="flex-1 p-2 border-r border-teal-700/30 text-center">Particulars</div>
                                <div className="w-40 p-2 text-right">Amount</div>
                                <div className="w-10"></div>
                            </div>

                            {/* Grid Rows */}
                            {fields.map((field, index) => (
                                <div key={field.id} className="flex border-b border-dashed border-slate-300 items-start">
                                    <div className="flex-1 p-1 border-r border-slate-300">
                                        <FormField
                                            control={form.control}
                                            name={`lines.${index}.categoryId`}
                                            render={({ field }) => (
                                                <SearchableSelect
                                                    value={field.value}
                                                    onChange={(val) => field.onChange(val || "")}
                                                    onSearch={async (q) => accountOptions.filter(o => o.label.toLowerCase().includes(q.toLowerCase()))}
                                                    options={accountOptions}
                                                    placeholder="Select Ledgers (Expense)"
                                                    className="border-0 shadow-none bg-transparent hover:bg-teal-50 text-sm h-8"
                                                />
                                            )}
                                        />
                                        <div className="text-[10px] text-slate-400 pl-3">Cur Bal: 0.00</div>
                                    </div>
                                    <div className="w-40 p-1">
                                        <FormField
                                            control={form.control}
                                            name={`lines.${index}.amount`}
                                            render={({ field }) => (
                                                <Input
                                                    type="number"
                                                    {...field}
                                                    value={(field.value as number) || ''}
                                                    className="text-right border-0 shadow-none bg-transparent h-8 font-bold"
                                                    placeholder="0.00"
                                                />
                                            )}
                                        />
                                    </div>
                                    <div className="w-10 flex items-center justify-center">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => remove(index)}
                                            disabled={fields.length === 1}
                                            className="h-6 w-6 text-slate-400 hover:text-red-500"
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </div>
                            ))}

                            {/* Add Line Prompt */}
                            <div className="p-2 cursor-pointer hover:bg-teal-50 text-teal-700 text-xs font-bold" onClick={() => append({ categoryId: "", amount: 0 })}>
                                + Add Ledger
                            </div>
                        </div>

                        {/* Total & Narration */}
                        <div className="flex flex-col gap-4 pt-4">
                            <div className="flex justify-end gap-16 pr-12 text-lg font-bold text-teal-900 border-t border-teal-700 w-full pt-2">
                                <span>Total</span>
                                <span>₹ {totalAmount.toFixed(2)}</span>
                            </div>

                            <div className="flex items-start gap-4">
                                <span className="font-bold text-teal-900 w-24 mt-2 text-right">Narration :</span>
                                <FormField
                                    control={form.control}
                                    name="narration"
                                    render={({ field }) => (
                                        <Textarea
                                            {...field}
                                            className="bg-white border-teal-700/30 font-mono text-sm min-h-[60px] flex-1"
                                            placeholder="Enter transaction details..."
                                        />
                                    )}
                                />
                            </div>
                        </div>
                    </form>
                </Form>
            </div>

            {/* Footer Actions */}
            <div className="p-3 bg-teal-700 flex justify-end gap-4 shadow-inner">
                <Button variant="ghost" className="text-teal-100 hover:bg-teal-800 hover:text-white" onClick={onClose}>
                    Quit (Esc)
                </Button>
                <Button onClick={form.handleSubmit(onSubmit)} disabled={loading} className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold min-w-[120px]">
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Accept (Yes)
                </Button>
            </div>
        </div>
    )
}
