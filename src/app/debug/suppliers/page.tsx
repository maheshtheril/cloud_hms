'use client';

import { useState, useEffect } from 'react';
import { seedSuppliers } from '@/app/actions/seed';
import { searchSuppliers } from '@/app/actions/purchase'; // We can use this to list current ones
import { Loader2, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';

export default function DebugSuppliersPage() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [currentSuppliers, setCurrentSuppliers] = useState<any[]>([]);
    const [fetching, setFetching] = useState(true);

    const [targetEmail, setTargetEmail] = useState("");

    const refreshList = async () => {
        setFetching(true);
        // We pass empty string to get first 50
        const data = await searchSuppliers("");
        setCurrentSuppliers(data);
        setFetching(false);
    };

    useEffect(() => {
        refreshList();
    }, []);

    const handleSeed = async () => {
        setLoading(true);
        const res = await seedSuppliers(targetEmail || undefined);
        setResult(res);
        setLoading(false);
        if (res.success) {
            refreshList();
        }
    };

    return (
        <div className="min-h-screen bg-neutral-950 text-white p-12 font-sans">
            <div className="max-w-2xl mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-light mb-2">Supplier Debug & Fix</h1>
                    <p className="text-neutral-500">
                        Use this utility to populate your company with sample suppliers if the list is empty.
                    </p>
                    <input
                        type="email"
                        placeholder="Impersonate User (Email) - Optional"
                        value={targetEmail}
                        onChange={(e) => setTargetEmail(e.target.value)}
                        className="mt-4 w-full bg-neutral-900 border border-white/10 rounded-lg p-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
                    />
                </div>

                {/* Status Card */}
                <div className="bg-neutral-900 border border-white/10 rounded-xl p-6">
                    <div className="flex bg-neutral-950 rounded-lg p-4 mb-6 justify-between items-center">
                        <div className="text-sm text-neutral-400">Current Suppliers Found</div>
                        <div className="text-2xl font-mono font-bold text-white">
                            {fetching ? <Loader2 className="h-5 w-5 animate-spin" /> : currentSuppliers.length}
                        </div>
                    </div>

                    <div className="space-y-4">
                        {currentSuppliers.length === 0 ? (
                            <div className="flex items-start gap-4 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-200">
                                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                                <div className="space-y-1">
                                    <h3 className="font-medium text-sm">No Suppliers Found</h3>
                                    <p className="text-xs opacity-80 leading-relaxed">
                                        Your company has no suppliers linked to it. The search functionality will not work until data exists.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-start gap-4 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-200">
                                <CheckCircle className="h-5 w-5 shrink-0 mt-0.5" />
                                <div className="space-y-1">
                                    <h3 className="font-medium text-sm">System Healthy</h3>
                                    <p className="text-xs opacity-80 leading-relaxed">
                                        Found {currentSuppliers.length} suppliers. Search should work correctly.
                                    </p>
                                </div>
                            </div>
                        )}

                        <button
                            onClick={handleSeed}
                            disabled={loading || currentSuppliers.length > 0}
                            className="w-full py-3 px-4 rounded-lg bg-white text-black font-medium hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                            {currentSuppliers.length > 0 ? "Data Already Exists" : "Seed Sample Suppliers"}
                        </button>
                    </div>
                </div>

                {/* Result Message */}
                {result && (
                    <div className={`p-4 rounded-lg text-sm border ${result.success ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-400' : 'bg-red-950/30 border-red-500/30 text-red-400'}`}>
                        {result.message || result.error}
                    </div>
                )}

                {/* List Preview */}
                {currentSuppliers.length > 0 && (
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Preview</label>
                        <div className="rounded-lg border border-white/5 divide-y divide-white/5">
                            {currentSuppliers.map(s => (
                                <div key={s.id} className="p-3 text-sm text-neutral-300 flex justify-between">
                                    <span>{s.label}</span>
                                    <span className="text-neutral-600 text-xs">{s.id}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
