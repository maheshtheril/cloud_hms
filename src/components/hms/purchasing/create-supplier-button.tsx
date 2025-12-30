'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SupplierDialog } from './supplier-dialog';
import { useRouter } from 'next/navigation';

export function CreateSupplierButton() {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    return (
        <>
            <Button onClick={() => setIsOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md">
                <Plus className="h-4 w-4 mr-2" />
                New Supplier
            </Button>
            <SupplierDialog
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                onSuccess={() => {
                    setIsOpen(false);
                    router.refresh();
                }}
            />
        </>
    );
}
