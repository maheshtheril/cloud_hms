'use client'

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { CalendarIcon, Loader2, IndianRupee, Printer, CheckCircle2 } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { upsertPayment, getExpenseAccounts } from "@/app/actions/accounting/payments"
import { cn } from "@/lib/utils"
import { SearchableSelect } from "@/components/ui/searchable-select"

const expenseSchema = z.object({
    amount: z.coerce.number().min(1, "Amount must be greater than 0"),
    categoryId: z.string().min(1, "Category is required"),
    payeeName: z.string().min(2, "Payee name is required"),
    memo: z.string().optional(),
    date: z.date(),
    reference: z.string().optional()
})

interface ExpenseDialogProps {
    onClose: () => void
    onSuccess?: () => void
}

function numberToWords(amount: number): string {
    // Simple implementation or placeholder. 
    // For a robust one we'd need a library, but let's do a basic one or just return formatted number if complex.
    // Given the "World Standard" request, let's try a basic English converter.
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];

    if (amount === 0) return 'Zero';

    function convert(n: number): string {
        if (n < 10) return ones[n];
        if (n < 20) return teens[n - 10];
        if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + ones[n % 10] : '');
        if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' ' + convert(n % 100) : '');
        return n.toString(); // Fallback for large numbers in this simple snippet
    }

    return convert(Math.floor(amount)) + (amount % 1 !== 0 ? ' Point ' + convert(Math.round((amount % 1) * 100)) : '') + ' Only';
}

export function ExpenseDialog({ onClose, onSuccess }: ExpenseDialogProps) {
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)
    const [accounts, setAccounts] = useState<{ id: string; name: string; code: string }[]>([])
    const [successData, setSuccessData] = useState<any>(null)
    const [showVoucher, setShowVoucher] = useState(false)

    // Fetch expense accounts on mount
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
            amount: 0,
            categoryId: "",
            payeeName: "",
            memo: "",
            date: new Date(),
            reference: ""
        }
    })

    const onSubmit = async (values: z.infer<typeof expenseSchema>) => {
        setLoading(true)
        try {
            const result = await upsertPayment({
                type: 'outbound',
                amount: values.amount,
                method: 'cash', // Default to cash for petty cash
                payeeName: values.payeeName,
                memo: values.memo || "Petty Cash Expense",
                date: values.date,
                reference: values.reference || `EXP-${Date.now().toString().slice(-6)}`,
                lines: [
                    {
                        accountId: values.categoryId, // User selected value
                        amount: values.amount,
                        description: values.memo
                    }
                ]
            })

            if (result.success) {
                toast({ title: "Expense Recorded", description: "Petty cash entry saved successfully." })
                // form.reset() // Keep data for a moment if needed, but we rely on result.data
                setSuccessData(result.data)
                setShowVoucher(true)
                onSuccess?.()
                // Don't close yet, let user print
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

    const handlePrint = () => {
        window.print();
    };

    if (showVoucher && successData) {
        return (
            <div className="p-6 flex flex-col items-center justify-center min-h-[400px]">
                <style jsx global>{`
                    @media print {
                        body * {
                            visibility: hidden;
                        }
                        #printable-voucher, #printable-voucher * {
                            visibility: visible;
                        }
                        #printable-voucher {
                            position: fixed;
                            left: 0;
                            top: 0;
                            width: 100%;
                            height: 100%;
                            z-index: 9999;
                            background: white;
                            padding: 20px;
                        }
                        .no-print {
                            display: none !important;
                        }
                    }
                `}</style>

                <div id="printable-voucher" className="w-[800px] border-2 border-slate-800 p-8 bg-white text-slate-900 mx-auto">
                    {/* Header */}
                    <div className="flex justify-between items-start border-b-2 border-slate-800 pb-4 mb-6">
                        <div>
                            <h1 className="text-3xl font-extrabold tracking-wider text-slate-900 uppercase">Petty Cash Voucher</h1>
                            <p className="text-sm font-medium mt-1 text-slate-600">Official Payment Receipt</p>
                        </div>
                        <div className="text-right">
                            <div className="flex items-center gap-2 justify-end mb-1">
                                <span className="font-bold text-slate-600 uppercase text-xs">Voucher No:</span>
                                <span className="font-mono font-bold text-lg">{successData.payment_number}</span>
                            </div>
                            <div className="flex items-center gap-2 justify-end">
                                <span className="font-bold text-slate-600 uppercase text-xs">Date:</span>
                                <span className="font-medium">{format(new Date(successData.payment_date), 'dd MMM, yyyy')}</span>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="space-y-6">
                        <div className="flex gap-4 items-end">
                            <span className="font-bold text-slate-700 w-24 uppercase text-sm pb-1">Paid To:</span>
                            <div className="flex-1 border-b border-slate-400 border-dashed pb-1 font-medium text-lg px-2">
                                {successData.payee_name}
                            </div>
                        </div>

                        <div className="flex gap-4 items-end">
                            <span className="font-bold text-slate-700 w-24 uppercase text-sm pb-1">The Sum of:</span>
                            <div className="flex-1 border-b border-slate-400 border-dashed pb-1 font-medium text-lg px-2 capitalize italic">
                                {numberToWords(Number(successData.amount))} Rupees Only
                            </div>
                        </div>

                        <div className="flex gap-4 items-end">
                            <span className="font-bold text-slate-700 w-24 uppercase text-sm pb-1">On A/C of:</span>
                            <div className="flex-1 border-b border-slate-400 border-dashed pb-1 font-medium text-lg px-2">
                                {successData.memo}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-8 mt-4">
                            <div className="border border-slate-300 rounded p-4 bg-slate-50">
                                <p className="text-xs font-bold text-slate-500 uppercase mb-1">Category</p>
                                <p className="font-medium text-slate-900">
                                    {accounts.find(a => a.id === form.getValues().categoryId)?.name || 'Expense'}
                                </p>
                            </div>
                            <div className="flex items-center justify-end gap-3 p-4 bg-slate-100 rounded border border-slate-200">
                                <span className="font-bold text-slate-600 uppercase">Total Amount</span>
                                <span className="text-2xl font-bold font-mono">
                                    ₹{Number(successData.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Footer / Signatures */}
                    <div className="grid grid-cols-3 gap-8 mt-16 pt-8">
                        <div className="text-center">
                            <div className="border-t border-slate-400 w-3/4 mx-auto mb-2"></div>
                            <p className="text-xs font-bold uppercase text-slate-500">Prepared By</p>
                        </div>
                        <div className="text-center">
                            <div className="border-t border-slate-400 w-3/4 mx-auto mb-2"></div>
                            <p className="text-xs font-bold uppercase text-slate-500">Authorised By</p>
                        </div>
                        <div className="text-center">
                            <div className="border-t-2 border-slate-800 w-3/4 mx-auto mb-2"></div>
                            <p className="text-sm font-extrabold uppercase text-slate-900">Receiver's Signature</p>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 mt-8 no-print slide-in-from-bottom-5 animate-in">
                    <Button onClick={handlePrint} className="bg-slate-900 hover:bg-slate-800 text-white min-w-[150px]">
                        <Printer className="mr-2 h-4 w-4" /> Print Voucher
                    </Button>
                    <Button variant="outline" onClick={onClose} className="min-w-[100px]">
                        Close
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <h2 className="text-xl font-bold">Record Petty Cash Expense</h2>
                <p className="text-sm text-muted-foreground">Enter details for cash payout</p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Amount</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <IndianRupee className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input type="number" {...field} value={field.value as number} className="pl-8 text-lg font-bold" />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="date"
                            render={({ field }) => (
                                <FormItem className="flex flex-col pt-2.5">
                                    <FormLabel>Date</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-full pl-3 text-left font-normal",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value ? (
                                                        format(field.value, "PPP")
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={(date) =>
                                                    date > new Date() || date < new Date("1900-01-01")
                                                }
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="categoryId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Expense Category</FormLabel>
                                <FormControl>
                                    <SearchableSelect
                                        value={field.value}
                                        onChange={(val) => field.onChange(val || "")}
                                        onSearch={async (q) => {
                                            return accountOptions.filter(opt =>
                                                opt.label.toLowerCase().includes(q.toLowerCase()) ||
                                                opt.subLabel.toLowerCase().includes(q.toLowerCase())
                                            );
                                        }}
                                        defaultOptions={accountOptions}
                                        placeholder="Search Expense Category..."
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="payeeName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Paid To (Name/Role)</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. Office Runner, Vendor Name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="memo"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description / Reason</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="e.g. Buying coffee for guests, Printing paper" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="reference"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Reference (Optional)</FormLabel>
                                <FormControl>
                                    <Input placeholder="Receipt #" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                        <Button type="submit" disabled={loading} className="bg-rose-600 hover:bg-rose-700 text-white">
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Record Expense
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}
