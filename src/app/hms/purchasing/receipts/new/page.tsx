'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ReceiptEntryDialog } from '@/components/hms/purchasing/receipt-entry-dialog';

export default function NewPurchaseReceiptPage() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(true);

    const handleClose = () => {
        setIsOpen(false);
        router.push('/hms/purchasing/receipts');
    };

    const handleSuccess = () => {
        setIsOpen(false);
        router.push('/hms/purchasing/receipts');
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950/50 backdrop-blur-3xl flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-emerald-500/10" />
            <ReceiptEntryDialog
                isOpen={isOpen}
                onClose={handleClose}
                onSuccess={handleSuccess}
            />
        </div>
    );
}
