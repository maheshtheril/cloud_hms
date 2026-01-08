'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { SalesReturnDialog } from '@/components/hms/billing/sales-return-dialog';
import { useRouter } from 'next/navigation';

interface InvoiceReturnClientProps {
    invoiceId: string;
    patientId: string;
    patientName: string;
    items: any[];
}

export function InvoiceReturnClient({ invoiceId, patientId, patientName, items }: InvoiceReturnClientProps) {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    return (
        <>
            <Button
                variant="outline"
                size="sm"
                onClick={() => setIsOpen(true)}
                className="text-emerald-600 border-emerald-200 hover:bg-emerald-50"
            >
                <RotateCcw className="h-4 w-4 mr-2" /> Return Items
            </Button>

            <SalesReturnDialog
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                invoiceId={invoiceId}
                patientId={patientId}
                patientName={patientName}
                initialItems={items.map(i => ({
                    invoiceLineId: i.id,
                    productId: i.product_id,
                    description: (i as any).hms_product?.name || i.description || 'Item',
                    soldQty: Number(i.quantity),
                    returnQty: 0,
                    unitPrice: Number(i.unit_price)
                }))}
                onSuccess={() => {
                    router.refresh();
                }}
            />
        </>
    );
}
