'use client';

import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { StockAdjustmentDialog } from '@/components/hms/inventory/stock-adjustment-dialog';
import { useRouter } from 'next/navigation';

export function StockAdjustmentButton() {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="p-4 rounded-xl bg-gray-50 hover:bg-purple-50 border border-gray-100 hover:border-purple-100 transition-all group text-center flex flex-col items-center gap-3 active:scale-95"
            >
                <div className="p-3 bg-white rounded-full shadow-sm text-gray-600 group-hover:text-purple-600 group-hover:scale-110 transition-all">
                    <RefreshCw className="h-5 w-5" />
                </div>
                <span className="text-sm font-semibold text-gray-700 group-hover:text-purple-700">Stock Adjustment</span>
            </button>

            <StockAdjustmentDialog
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                onSuccess={() => {
                    router.refresh();
                }}
            />
        </>
    );
}
