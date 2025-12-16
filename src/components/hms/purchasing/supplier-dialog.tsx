'use client';

import * as React from 'react';
import { X, Loader2, Building, Mail, Phone, MapPin, FileText } from 'lucide-react';
import { createSupplier } from '@/app/actions/purchase';

interface SupplierDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (supplier: { id: string; label: string; subLabel?: string }) => void;
}

export function SupplierDialog({ isOpen, onClose, onSuccess }: SupplierDialogProps) {
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const [formData, setFormData] = React.useState({
        name: '',
        gstin: '',
        address: '',
        phone: '',
        email: '',
        contactPerson: ''
    });

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const result = await createSupplier(formData);
            if (result.error) {
                setError(result.error);
            } else if (result.success && result.data) {
                onSuccess(result.data);
                onClose();
            }
        } catch (err) {
            setError("An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-2xl w-full max-w-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 dark:border-neutral-800">
                    <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">New Supplier</h2>
                    <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                    {error && (
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                                Supplier Name <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Building className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
                                <input
                                    type="text"
                                    required
                                    placeholder="Company Name"
                                    className="w-full pl-9 pr-3 py-2 bg-neutral-50 dark:bg-neutral-800 border-none rounded-lg text-sm focus:ring-1 focus:ring-indigo-500 text-neutral-900 dark:text-white placeholder:text-neutral-400 font-medium transition-all"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                                    GSTIN / VAT
                                </label>
                                <div className="relative">
                                    <FileText className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
                                    <input
                                        type="text"
                                        placeholder="GST Number"
                                        className="w-full pl-9 pr-3 py-2 bg-neutral-50 dark:bg-neutral-800 border-none rounded-lg text-sm focus:ring-1 focus:ring-indigo-500 text-neutral-900 dark:text-white placeholder:text-neutral-400 transition-all uppercase"
                                        value={formData.gstin}
                                        onChange={e => setFormData({ ...formData, gstin: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                                    Contact Person
                                </label>
                                <input
                                    type="text"
                                    placeholder="Name"
                                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border-none rounded-lg text-sm focus:ring-1 focus:ring-indigo-500 text-neutral-900 dark:text-white placeholder:text-neutral-400 transition-all"
                                    value={formData.contactPerson}
                                    onChange={e => setFormData({ ...formData, contactPerson: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                                    Email
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
                                    <input
                                        type="email"
                                        placeholder="email@example.com"
                                        className="w-full pl-9 pr-3 py-2 bg-neutral-50 dark:bg-neutral-800 border-none rounded-lg text-sm focus:ring-1 focus:ring-indigo-500 text-neutral-900 dark:text-white placeholder:text-neutral-400 transition-all"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                                    Phone
                                </label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
                                    <input
                                        type="tel"
                                        placeholder="+91..."
                                        className="w-full pl-9 pr-3 py-2 bg-neutral-50 dark:bg-neutral-800 border-none rounded-lg text-sm focus:ring-1 focus:ring-indigo-500 text-neutral-900 dark:text-white placeholder:text-neutral-400 transition-all"
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                                Address
                            </label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
                                <textarea
                                    rows={3}
                                    placeholder="Full billing address..."
                                    className="w-full pl-9 pr-3 py-2 bg-neutral-50 dark:bg-neutral-800 border-none rounded-lg text-sm focus:ring-1 focus:ring-indigo-500 text-neutral-900 dark:text-white placeholder:text-neutral-400 transition-all resize-none"
                                    value={formData.address}
                                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-2 flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-sm shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
                        >
                            {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                            Create Supplier
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
