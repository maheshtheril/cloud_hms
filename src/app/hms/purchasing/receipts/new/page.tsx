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
        <div className="min-h-screen bg-black">
            <ReceiptEntryDialog
                isOpen={isOpen}
                onClose={handleClose}
                onSuccess={handleSuccess}
            />
        </div>
    );
}
