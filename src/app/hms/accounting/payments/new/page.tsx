'use client';

import { useRouter } from 'next/navigation';
import { PaymentVoucherForm } from '@/components/accounting/payment-voucher-form';

export default function NewPaymentPage() {
    const router = useRouter();

    return (
        <div className="h-screen w-full bg-[#fff9e6] dark:bg-slate-900">
            <PaymentVoucherForm
                onClose={() => router.back()}
                onSuccess={() => router.push('/hms/accounting/payments')}
            />
        </div>
    );
}
