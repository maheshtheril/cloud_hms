'use client'

import { useState, useEffect } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { CalendarIcon, Loader2, IndianRupee, Banknote, User, FileText, CheckCircle2, Plus, Trash2, Paperclip, AlertCircle } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

// World Class Schema: Multi-line support
const lineItemSchema = z.object({
    categoryId: z.string().min(1, "Account required"),
    description: z.string().optional(),
    amount: z.coerce.number().min(0.01, "Required"),
})

const expenseSchema = z.object({
    payeeName: z.string().min(2, "Payee required"),
    paymentMethod: z.string().default('cash'),
    date: z.date(),
    reference: z.string().optional(),
    memo: z.string().optional(),
    lines: z.array(lineItemSchema).min(1, "At least one line item is required")
})

interface ExpenseDialogProps {
    onClose: () => void
    onSuccess?: () => void
}

export function ExpenseDialog({ onClose, onSuccess }: ExpenseDialogProps) {
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)
    const [accounts, setAccounts] = useState<{ id: string; name: string; code: string }[]>([])

    // Fetch expense accounts on mount
    useEffect(() => {
        const fetchAccounts = async () => {
            const res = await getExpenseAccounts();
            if (res.success && res.data) {
                setAccounts(res.data);
            } else if (res.error) {
                toast({ title: "Load Error", description: res.error, variant: "destructive" });
            }
        };
        fetchAccounts();
    }, [toast]);

    const form = useForm({
        resolver: zodResolver(expenseSchema),
        defaultValues: {
            payeeName: "",
            paymentMethod: "cash",
            date: new Date(),
            reference: "",
            memo: "",
            lines: [{ categoryId: "", description: "", amount: 0 }]
        }
    })

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "lines"
    })

    // Calculate Total
    const watchedLines = form.watch("lines");
    const totalAmount = watchedLines.reduce((sum, line) => sum + (Number(line.amount) || 0), 0);

    const onSubmit = async (values: z.infer<typeof expenseSchema>) => {
        setLoading(true)
        try {
            // Sorting lines by amount to find "Primary" category for the main record
            const sortedLines = [...values.lines].sort((a, b) => b.amount - a.amount);
            const primaryLine = sortedLines[0];

            const result = await recordExpense({
                amount: totalAmount,
                categoryId: primaryLine.categoryId, // Main GL Account
                payeeName: values.payeeName,
                memo: values.memo || values.lines.map(l => l.description).join(', '), // Combined memo
                date: values.date,
                reference: values.reference,
                method: values.paymentMethod
            })

            if (result.success) {
                toast({
                    title: "Expense Recorded",
                    description: `Voucher ${result.data?.payment_number} created successfully.`,
                    className: "bg-emerald-50 border-emerald-200"
                })
                onSuccess?.()
                onClose()
            } else {
                toast({ title: "Error", description: result.error || "Failed to save expense", variant: "destructive" })
            }
        } catch (error) {
            console.error(error)
            toast({ title: "Error", description: "Something went wrong", variant: "destructive" })
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
        <div className="bg-slate-50 dark:bg-slate-900 flex flex-col h-full max-h-[85vh] w-full">
            {/* ERP Header Bar */}
            <div className="px-6 py-4 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center shadow-sm z-10">
                <div className="flex items-center gap-3">
                    <div className="h-9 w-9 bg-slate-900 text-white rounded flex items-center justify-center font-bold">
                        Ex
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Expense Voucher</h2>
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-[10px] font-normal text-slate-500 border-slate-300">New Transaction</Badge>
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Amount</p>
                    <p className="text-xl font-black text-slate-900 dark:text-white font-mono">
                        {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(totalAmount)}
                    </p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-5xl mx-auto">

                        {/* Section 1: Payee & Context */}
                        <div className="bg-white dark:bg-slate-950 p-5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="md:col-span-2">
                                <FormField
                                    control={form.control}
                                    name="payeeName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs font-bold text-slate-500 uppercase">Payee / Vendor</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                                    <Input placeholder="Who is this payment for?" {...field} className="pl-9 bg-slate-50 border-slate-200 focus:bg-white transition-all font-medium" />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="date"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel className="text-xs font-bold text-slate-500 uppercase">Payment Date</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button variant={"outline"} className={cn("pl-3 text-left font-normal border-slate-200 bg-slate-50", !field.value && "text-muted-foreground")}>
                                                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date() || date < new Date("1900-01-01")} initialFocus />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="paymentMethod"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-bold text-slate-500 uppercase">Payment Mode</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="bg-slate-50 border-slate-200">
                                                    <SelectValue placeholder="Select mode" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="cash">Cash</SelectItem>
                                                <SelectItem value="card">Card</SelectItem>
                                                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                                                <SelectItem value="upi">UPI / Wallet</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Section 2: Account Details (Grid) */}
                        <div className="bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                            <div className="bg-slate-50 dark:bg-slate-900 px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                                <h3 className="text-xs font-bold uppercase text-slate-600 tracking-wider">Expense Details</h3>
                                <Badge variant="secondary" className="text-[10px] bg-white border-slate-200">Amounts are Tax Inclusive</Badge>
                            </div>

                            <div className="p-0">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-slate-500 uppercase bg-slate-50/50 border-b border-slate-100">
                                        <tr>
                                            <th className="w-[10%] px-4 py-3 text-center">#</th>
                                            <th className="w-[30%] px-4 py-3">Category / Account</th>
                                            <th className="w-[35%] px-4 py-3">Description</th>
                                            <th className="w-[20%] px-4 py-3 text-right">Amount</th>
                                            <th className="w-[5%] px-4 py-3"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {fields.map((field, index) => (
                                            <tr key={field.id} className="group hover:bg-slate-50/50">
                                                <td className="px-4 py-2 text-center text-slate-400 font-mono text-xs">{index + 1}</td>
                                                <td className="px-4 py-2">
                                                    <FormField
                                                        control={form.control}
                                                        name={`lines.${index}.categoryId`}
                                                        render={({ field }) => (
                                                            <div className="w-full min-w-[200px]">
                                                                <SearchableSelect
                                                                    value={field.value}
                                                                    onChange={(val) => field.onChange(val || "")}
                                                                    onSearch={async (q) => accountOptions.filter(o => o.label.toLowerCase().includes(q.toLowerCase()) || o.subLabel.toLowerCase().includes(q.toLowerCase()))}
                                                                    options={accountOptions}
                                                                    placeholder="Select Account"
                                                                    className="border-0 shadow-none bg-transparent hover:bg-slate-100 h-9"
                                                                />
                                                            </div>
                                                        )}
                                                    />
                                                </td>
                                                <td className="px-4 py-2">
                                                    <FormField
                                                        control={form.control}
                                                        name={`lines.${index}.description`}
                                                        render={({ field }) => (
                                                            <Input
                                                                {...field}
                                                                placeholder="What was this for?"
                                                                className="border-0 shadow-none bg-transparent hover:bg-slate-100 h-9 focus-visible:ring-0 px-2"
                                                            />
                                                        )}
                                                    />
                                                </td>
                                                <td className="px-4 py-2">
                                                    <FormField
                                                        control={form.control}
                                                        name={`lines.${index}.amount`}
                                                        render={({ field }) => (
                                                            <div className="relative">
                                                                <Input
                                                                    type="number"
                                                                    {...field}
                                                                    value={(field.value as number) || ''}
                                                                    className="text-right border-0 shadow-none bg-transparent hover:bg-slate-100 h-9 focus-visible:ring-0 font-mono font-bold"
                                                                    placeholder="0.00"
                                                                />
                                                            </div>
                                                        )}
                                                    />
                                                </td>
                                                <td className="px-4 py-2 text-center">
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                                                        onClick={() => remove(index)}
                                                        disabled={fields.length === 1}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div className="px-4 py-3 bg-slate-50 border-t border-slate-100">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => append({ categoryId: "", description: "", amount: 0 })}
                                        className="gap-2 text-xs font-medium border-dashed"
                                    >
                                        <Plus className="h-3 w-3" /> Add Line Item
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Sections: Memo & Attachments */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="memo"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-bold text-slate-500 uppercase">Memo / Internal Notes</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Additional notes for the accountant..."
                                                className="bg-white border-slate-200 resize-none min-h-[80px]"
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Attachments</label>
                                <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 flex flex-col items-center justify-center text-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
                                    <Paperclip className="h-6 w-6 text-slate-400 mb-2" />
                                    <p className="text-xs text-slate-500">Drag & drop receipt images or <span className="text-indigo-600 underline">browse</span></p>
                                </div>
                            </div>
                        </div>
                    </form>
                </Form>
            </div>

            {/* Footer Bar */}
            <div className="p-4 bg-white border-t border-slate-200 dark:border-slate-800 flex justify-between items-center z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full text-xs font-medium border border-amber-100">
                    <AlertCircle className="h-3 w-3" />
                    Pending Approval
                </div>
                <div className="flex gap-3">
                    <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                    <Button
                        onClick={form.handleSubmit(onSubmit)}
                        disabled={loading}
                        className="bg-slate-900 hover:bg-slate-800 text-white min-w-[150px] shadow-lg shadow-slate-900/20"
                    >
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
                        Save Voucher
                    </Button>
                </div>
            </div>
        </div>
    )
}
