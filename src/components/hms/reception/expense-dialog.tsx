'use client'

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { CalendarIcon, Loader2, IndianRupee } from "lucide-react"
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
                form.reset()
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
