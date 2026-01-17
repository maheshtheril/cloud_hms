'use client';

import { PaymentVoucherForm } from "@/components/accounting/payment-voucher-form";

interface ExpenseDialogProps {
    onClose: () => void;
}

export function ExpenseDialog({ onClose }: ExpenseDialogProps) {
    return (
        <div className="h-full w-full bg-[#fff9e6] dark:bg-slate-900 overflow-hidden flex flex-col">
            <PaymentVoucherForm
                onClose={onClose}
                onSuccess={onClose}
                className="h-full"
            />
        </div>
    );
}
