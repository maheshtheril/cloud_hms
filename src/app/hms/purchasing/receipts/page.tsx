'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getPurchaseReceipts } from '@/app/actions/receipt';
import { ArrowLeft, Loader2, Plus, FileText, Calendar, Box, Search } from 'lucide-react';

type Receipt = {
    id: string;
    number: string;
    date: Date;
    supplierName: string;
    reference: string;
    itemCount: number;
    status: string;
};

export default function PurchaseReceiptsPage() {
    const router = useRouter();
    const [receipts, setReceipts] = useState<Receipt[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        async function load() {
            try {
                const res = await getPurchaseReceipts();
                if (res.success && res.data) {
                    setReceipts(res.data);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        }
        load();
    }, []);

    const filteredReceipts = receipts.filter(r =>
        r.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.reference.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-neutral-950 text-white font-sans p-8">
            {/* Header */}
            <div className="max-w-[1600px] mx-auto mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight mb-2">Purchase Entries</h1>
                    <p className="text-neutral-400 text-sm">Review stock inward records and invoices.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500 group-focus-within:text-indigo-400 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search receipts..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-neutral-900 border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 w-64 transition-all"
                        />
                    </div>
                    <Link
                        href="/hms/purchasing/receipts/new"
                        className="bg-white text-black hover:bg-neutral-200 transition-colors px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2"
                    >
                        <Plus className="h-4 w-4" /> New Receipt
                    </Link>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-[1600px] mx-auto">
                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-neutral-600" />
                    </div>
                ) : filteredReceipts.length === 0 ? (
                    <div className="text-center py-20 bg-neutral-900/30 rounded-2xl border border-white/5 border-dashed">
                        <div className="bg-neutral-800/50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Box className="h-5 w-5 text-neutral-500" />
                        </div>
                        <h3 className="text-lg font-medium text-neutral-300 mb-1">No receipts found</h3>
                        <p className="text-neutral-500 text-sm mb-6">Create a new purchase receipt to record incoming stock.</p>
                        <Link
                            href="/hms/purchasing/receipts/new"
                            className="text-indigo-400 hover:text-indigo-300 text-sm font-medium"
                        >
                            + Create First Receipt
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        <div className="grid grid-cols-12 gap-4 px-6 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider border-b border-white/5">
                            <div className="col-span-2">Receipt #</div>
                            <div className="col-span-2">Date</div>
                            <div className="col-span-3">Supplier</div>
                            <div className="col-span-2">Ref Invoice</div>
                            <div className="col-span-2 text-right">Items</div>
                            <div className="col-span-1 text-right">Status</div>
                        </div>

                        {filteredReceipts.map((receipt) => (
                            <div
                                key={receipt.id}
                                onClick={() => router.push(`/hms/purchasing/receipts/${receipt.id}`)}
                                className="grid grid-cols-12 gap-4 px-6 py-4 bg-neutral-900/30 hover:bg-neutral-900/60 transition-colors rounded-xl border border-white/5 items-center group cursor-pointer"
                            >
                                <div className="col-span-2 font-mono text-sm text-indigo-300 font-medium group-hover:text-indigo-200">
                                    {receipt.number}
                                </div>
                                <div className="col-span-2 flex items-center gap-2 text-sm text-neutral-400">
                                    <Calendar className="h-3 w-3 text-neutral-600" />
                                    {new Date(receipt.date).toLocaleDateString()}
                                </div>
                                <div className="col-span-3 text-sm text-neutral-200 font-medium truncate">
                                    {receipt.supplierName}
                                </div>
                                <div className="col-span-2 text-sm text-neutral-400 font-mono truncate">
                                    {receipt.reference}
                                </div>
                                <div className="col-span-2 text-right text-sm text-neutral-400 font-mono">
                                    {receipt.itemCount}
                                </div>
                                <div className="col-span-1 text-right">
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wide">
                                        {receipt.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
