
'use client'

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Calendar as CalendarIcon, Save, Printer, ArrowLeft } from "lucide-react"
import { upsertPayment, PaymentType } from "@/app/actions/accounting/payments"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ZionaLogo } from "@/components/branding/ziona-logo"

interface PaymentFormProps {
    type: PaymentType;
    initialData?: any;
    partners: { id: string, name: string }[];
}

export function PaymentForm({ type, initialData, partners }: PaymentFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [date, setDate] = useState<Date>(initialData?.metadata?.date ? new Date(initialData.metadata.date) : new Date());

    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
        defaultValues: {
            partner_id: initialData?.partner_id || '',
            amount: initialData?.amount || 0,
            method: initialData?.method || 'cash',
            reference: initialData?.reference || '',
            memo: initialData?.metadata?.memo || '',
        }
    });

    const onSubmit = async (data: any) => {
        setIsLoading(true);
        try {
            // Handle 0 amount check?
            if (data.amount <= 0) {
                toast.error("Amount must be greater than 0");
                return;
            }

            const res = await upsertPayment({
                id: initialData?.id,
                type: type,
                partner_id: data.partner_id,
                amount: Number(data.amount),
                method: data.method,
                reference: data.reference,
                date: date,
                memo: data.memo
            });

            if (res.error) {
                toast.error(res.error);
            } else {
                toast.success(type === 'inbound' ? "Receipt Saved" : "Payment Saved");
                router.push(type === 'inbound' ? '/accounting/customer/receipts' : '/accounting/vendor/payments');
            }
        } catch (e) {
            toast.error("An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    const title = type === 'inbound' ? 'Customer Receipt' : 'Vendor Payment';
    const partnerLabel = type === 'inbound' ? 'Customer' : 'Vendor';
    const methods = [
        { value: 'cash', label: 'Cash' },
        { value: 'bank', label: 'Bank Transfer' },
        { value: 'cheque', label: 'Cheque' },
        { value: 'card', label: 'Credit Card' },
    ];

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-4xl mx-auto p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <Link href={type === 'inbound' ? '/accounting/customer/receipts' : '/accounting/vendor/payments'} className="text-sm text-slate-500 hover:text-blue-600 flex items-center mb-2">
                        <ArrowLeft className="w-4 h-4 mr-1" /> Back to List
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-black rounded-xl flex items-center justify-center shadow-2xl shadow-indigo-500/20 border border-white/10 shrink-0">
                            <ZionaLogo size={32} variant="icon" theme="dark" speed="slow" colorScheme="signature" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                                {initialData ? `Edit ${title}` : `New ${title}`}
                            </h1>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    {/* Print Button if editing */}
                    {initialData && (
                        <Button variant="outline" type="button">
                            <Printer className="w-4 h-4 mr-2" /> Print
                        </Button>
                    )}
                    <Button type="submit" disabled={isLoading} className={cn(type === 'inbound' ? "bg-emerald-600 hover:bg-emerald-700" : "bg-blue-600 hover:bg-blue-700")}>
                        <Save className="w-4 h-4 mr-2" />
                        Save {type === 'inbound' ? "Receipt" : "Payment"}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Main Info */}
                <Card className="md:col-span-2 border-slate-200 shadow-sm">
                    <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label>{partnerLabel} <span className="text-red-500">*</span></Label>
                            <Select
                                onValueChange={v => setValue('partner_id', v)}
                                defaultValue={initialData?.partner_id}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder={`Select ${partnerLabel}...`} />
                                </SelectTrigger>
                                <SelectContent>
                                    {partners.map(p => (
                                        <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.partner_id && <span className="text-xs text-red-500">Required</span>}
                        </div>

                        <div className="space-y-2">
                            <Label>Date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !date && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={(d) => d && setDate(d)}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div className="space-y-2">
                            <Label>Payment Method</Label>
                            <Select
                                onValueChange={v => setValue('method', v)}
                                defaultValue={initialData?.method || 'cash'}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {methods.map(m => (
                                        <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Amount ({initialData?.currency || 'INR'}) <span className="text-red-500">*</span></Label>
                            <Input
                                type="number"
                                step="0.01"
                                {...register('amount', { required: true, min: 0.01 })}
                                className="text-xl font-bold font-mono"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Reference / Cheque No.</Label>
                            <Input {...register('reference')} placeholder="Optional reference..." />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <Label>Memo / Note</Label>
                            <Textarea {...register('memo')} placeholder="Internal notes..." />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </form>
    )
}
