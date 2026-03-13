'use client';

import { useRouter } from 'next/navigation';
import { ClassicVoucherEditor } from '@/components/accounting/classic-voucher-editor';
import { upsertPayment } from '@/app/actions/accounting/payments';
import { searchSuppliers, getOutstandingPurchaseBills } from '@/app/actions/accounting/helpers';
import { getAccounts } from '@/app/actions/accounting/chart-of-accounts';

export default function NewPaymentPage() {
    const router = useRouter();

    const handleSave = async (payload: any) => {
        const res = await upsertPayment(payload);
        if (res.error) return false;
        return true;
    };

    return (
        <div className="h-screen w-full bg-[#002b2b]">
            <ClassicVoucherEditor
                type="payment"
                onSave={handleSave}
                onCancel={() => router.back()}
                suppliersSearch={searchSuppliers}
                accountsSearch={async (q) => {
                  const res = await getAccounts(q);
                  return res.success ? res.data : [];
                }}
                getBills={getOutstandingPurchaseBills}
                currency="₹"
            />
        </div>
    );
}
