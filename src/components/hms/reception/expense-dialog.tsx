'use client'

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { CalendarIcon, Loader2, IndianRupee, Banknote, User, FileText, CheckCircle2 } from "lucide-react"
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
import { Separator } from "@/components/ui/separator"

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
            const result = await recordExpense({
                amount: values.amount,
                categoryId: values.categoryId,
                payeeName: values.payeeName,
                memo: values.memo || "Petty Cash Expense",
                date: values.date,
                reference: values.reference,
                method: 'cash'
            })

            if (result.success) {
                toast({
                    title: "Expense Recorded",
                    description: "Expense saved successfully.",
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
        <div className="p-0 bg-white dark:bg-slate-900">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white">
                    <Banknote className="h-5 w-5" />
                </div>
                <div>
                    <h2 className="text-lg font-black tracking-tight text-slate-900 dark:text-white uppercase">Record Expense</h2>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Petty Cash Outflow</p>
                </div>
            </div>

            <div className="p-8">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                        {/* 1. Amount & Date */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="amount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500">
                                            <IndianRupee className="h-3 w-3" /> Amount
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative group">
                                                <span className="absolute left-3 top-2.5 text-slate-400 font-bold">₹</span>
                                                <Input
                                                    type="number"
                                                    {...field}
                                                    value={(field.value as number) || ''}
                                                    className="pl-8 text-xl font-bold text-slate-900 bg-slate-50 border-slate-200 h-12 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                                                    placeholder="0.00"
                                                />
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
                                    <FormItem className="flex flex-col">
                                        <FormLabel className="text-xs font-bold uppercase text-slate-500 mb-2">Transaction Date</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-full h-12 pl-3 text-left font-normal border-slate-200 bg-slate-50 hover:bg-white",
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

                        <Separator className="bg-slate-100" />

                        {/* 2. Payee and Category */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="categoryId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-bold uppercase text-slate-500">Expense Category</FormLabel>
                                        <FormControl>
                                            <SearchableSelect
                                                value={field.value as string}
                                                onChange={(val) => field.onChange(val || "")}
                                                onSearch={async (q) => {
                                                    return accountOptions.filter(opt =>
                                                        opt.label.toLowerCase().includes(q.toLowerCase()) ||
                                                        opt.subLabel.toLowerCase().includes(q.toLowerCase())
                                                    );
                                                }}
                                                options={accountOptions}
                                                placeholder="Select Category..."
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
                                        <FormLabel className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500">
                                            <User className="h-3 w-3" /> Paid To (Beneficiary)
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="e.g. Vendor Name, Staff Name"
                                                {...field}
                                                value={field.value as string}
                                                className="h-10 bg-slate-50 border-slate-200 focus:bg-white transition-all"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* 3. Details */}
                        <FormField
                            control={form.control}
                            name="memo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500">
                                        <FileText className="h-3 w-3" /> Description / Reason
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Detailed description of the expense..."
                                            {...field}
                                            value={(field.value as string) || ''}
                                            className="resize-none bg-slate-50 border-slate-200 focus:bg-white transition-all"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* 4. Footer Actions */}
                        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
                            <Button type="button" variant="ghost" onClick={onClose} className="hover:bg-slate-100">Cancel</Button>
                            <Button type="submit" disabled={loading} className="bg-slate-900 hover:bg-slate-800 text-white min-w-[150px] shadow-xl shadow-slate-900/10">
                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
                                {loading ? 'Recording...' : 'Record Expense'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    )
}
