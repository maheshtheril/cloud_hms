'use client'

import { createProduct, updateProduct, createUOM } from "@/app/actions/inventory"
import { uploadProductImage } from "@/app/actions/upload-image"
import { useState, useRef, useEffect, useActionState } from "react"
import { useRouter } from "next/navigation"
import { QuickCategoryForm, QuickManufacturerForm } from "@/components/inventory/quick-create-wrappers"
import {
    Box, Tag, DollarSign, Layers, Image as ImageIcon, Barcode, Factory, Check, Zap, Info, Plus, X, Cpu
} from "lucide-react"

interface ProductFormProps {
    suppliers: { id: string, name: string }[];
    taxRates: { id: string, name: string, rate: any }[];
    uoms: { id: string, name: string, category_id: string, ratio: any, uom_type: any }[];
    categories: { id: string, name: string, default_tax_rate_id: string | null }[];
    manufacturers: { id: string, name: string }[];
    uomCategories: { id: string, name: string, hms_uom: any[] }[];
    initialData?: any;
}

export function ProductForm({ suppliers, taxRates, uoms, categories, manufacturers, uomCategories, initialData }: ProductFormProps) {
    const router = useRouter();
    const [activeSection, setActiveSection] = useState<'details' | 'logistics' | 'financials'>('details');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Modal State
    const [modalOpen, setModalOpen] = useState<'none' | 'category' | 'manufacturer' | 'uom'>('none');

    // Image Upload State
    const [imageUrl, setImageUrl] = useState<string | null>(initialData?.imageUrl || null);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Form State for dynamic behavior
    const [selectedCategoryId, setSelectedCategoryId] = useState(initialData?.categoryId || "");
    const [selectedTaxId, setSelectedTaxId] = useState(initialData?.taxRateId || "");

    const isEditing = !!initialData;
    const category = categories.find(c => c.id === selectedCategoryId);

    // Quick Create Form States
    // Removed refs as we use components now


    // Auto-select Tax Rate when Category changes
    useEffect(() => {
        if (selectedCategoryId) {
            const cat = categories.find(c => c.id === selectedCategoryId);
            if (cat && cat.default_tax_rate_id) {
                setSelectedTaxId(cat.default_tax_rate_id);
            }
        }
    }, [selectedCategoryId, categories]);

    function handleQuickSuccess() {
        setModalOpen('none');
        router.refresh();
    }

    // ... (rest of code)


    async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        const res = await uploadProductImage(formData);

        if (res.error) {
            alert(res.error);
        } else if (res.url) {
            setImageUrl(res.url);
        }
        setUploading(false);
    }

    async function handleSubmit(formData: FormData) {
        setIsSubmitting(true);
        const action = isEditing ? updateProduct : createProduct;

        if (isEditing) {
            formData.append('id', initialData.id);
        }

        const res = await action(formData);

        if (res?.error) {
            alert(res.error);
            setIsSubmitting(false);
        } else {
            router.push('/hms/inventory/products');
            router.refresh();
        }
    }

    return (
        <div className="relative">
            <form action={handleSubmit} className="w-full animate-in fade-in duration-500">
                {/* Sticky Header */}
                <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 -mx-6 px-6 py-4 mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-gradient-to-br from-black to-gray-800 rounded-xl flex items-center justify-center shadow-lg shadow-gray-200">
                            <Box className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                                {isEditing ? 'Edit Product' : 'New Product'}
                            </h1>
                            <p className="text-xs font-medium text-gray-500">
                                {isEditing ? `Ref: ${initialData?.sku}` : 'Configure your new inventory item'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            disabled={isSubmitting}
                            className="px-5 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-2 bg-black hover:bg-gray-900 text-white text-sm font-medium rounded-lg shadow-lg shadow-gray-300 transition-all transform hover:scale-[1.02] flex items-center gap-2"
                        >
                            {isSubmitting ? (
                                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <Zap className="h-4 w-4 fill-current" />
                            )}
                            {isEditing ? 'Save Changes' : 'Create Product'}
                        </button>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Navigation Sidebar */}
                    <div className="w-full lg:w-64 flex-shrink-0 space-y-6">
                        {/* Image Uploader */}
                        <div className="bg-white rounded-2xl border border-gray-100 p-1 shadow-sm overflow-hidden group relative">
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                ref={fileInputRef}
                                onChange={handleImageUpload}
                                disabled={uploading}
                            />
                            <input type="hidden" name="image_url" value={imageUrl || ''} />

                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className={`aspect-square rounded-xl bg-gray-50 cursor-pointer overflow-hidden relative transition-all ${!imageUrl ? 'hover:bg-gray-100' : ''}`}
                            >
                                {uploading ? (
                                    <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-10">
                                        <div className="h-8 w-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                ) : null}

                                {imageUrl ? (
                                    <>
                                        <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <p className="text-white text-xs font-medium bg-black/50 px-3 py-1.5 rounded-full backdrop-blur-md">Change Photo</p>
                                        </div>
                                    </>
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-2">
                                        <ImageIcon className="h-8 w-8 opacity-50" />
                                        <span className="text-xs font-medium">Upload Image</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Navigation Menu */}
                        <nav className="space-y-1">
                            {[
                                { id: 'details', label: 'Core Details', icon: Cpu },
                                { id: 'logistics', label: 'Logistics', icon: Layers },
                                { id: 'financials', label: 'Financials', icon: DollarSign }
                            ].map((item) => (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => setActiveSection(item.id as any)}
                                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-3 ${activeSection === item.id
                                        ? 'bg-black text-white shadow-md shadow-gray-200'
                                        : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                >
                                    <item.icon className="h-4 w-4" />
                                    {item.label}
                                </button>
                            ))}
                        </nav>

                        {/* Quick Stats Helper */}
                        <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl text-xs text-blue-800 space-y-2">
                            <div className="font-bold flex items-center gap-2">
                                <Info className="h-4 w-4" />
                                Pro Tip
                            </div>
                            <p className="leading-relaxed opacity-80">
                                Categories automate tax rates and reporting.
                            </p>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 space-y-6 pb-24">
                        {/* CORE DETAILS */}
                        <div className={activeSection === 'details' ? 'block' : 'hidden'}>
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-2">
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                        Product Identity
                                        <span className="h-px flex-1 bg-gray-100 ml-4"></span>
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="md:col-span-2 space-y-2">
                                            <label className="text-sm font-medium text-gray-700">Product Name <span className="text-red-500">*</span></label>
                                            <input
                                                name="name"
                                                required
                                                defaultValue={initialData?.name}
                                                placeholder="e.g. Tesla Model S Plaid"
                                                className="w-full px-5 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all font-medium text-lg placeholder:text-gray-400"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                                <Tag className="h-3 w-3" /> SKU / Code <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                name="sku"
                                                required
                                                defaultValue={initialData?.sku}
                                                placeholder="e.g. PROD-001"
                                                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all font-mono text-sm"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                                <Factory className="h-3 w-3" /> Brand / Manufacturer
                                            </label>
                                            <div className="flex gap-2">
                                                <div className="relative flex-1">
                                                    <select
                                                        name="manufacturerId"
                                                        defaultValue={initialData?.manufacturerId}
                                                        className="w-full pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all appearance-none"
                                                    >
                                                        <option value="">Select Manufacturer...</option>
                                                        {manufacturers.map(m => (
                                                            <option key={m.id} value={m.id}>{m.name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => setModalOpen('manufacturer')}
                                                    className="px-3 py-2 bg-gray-50 hover:bg-green-50 text-gray-600 hover:text-green-600 border border-gray-200 hover:border-green-200 rounded-lg transition-colors"
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="md:col-span-2 space-y-2">
                                            <label className="text-sm font-medium text-gray-700">Description</label>
                                            <textarea
                                                name="description"
                                                rows={4}
                                                defaultValue={initialData?.description}
                                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
                                                placeholder="Enter detailed product specifications..."
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                        Categorization
                                        <span className="h-px flex-1 bg-gray-100 ml-4"></span>
                                    </h2>
                                    <div className="p-1 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-gray-900">Category Master</label>
                                                <div className="flex gap-2">
                                                    <div className="relative flex-1">
                                                        <select
                                                            name="categoryId"
                                                            value={selectedCategoryId}
                                                            onChange={(e) => setSelectedCategoryId(e.target.value)}
                                                            className="w-full pl-4 pr-10 py-3 bg-white border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all appearance-none font-medium"
                                                        >
                                                            <option value="">Select Category...</option>
                                                            {categories.map(c => (
                                                                <option key={c.id} value={c.id}>{c.name}</option>
                                                            ))}
                                                        </select>
                                                        <Box className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => setModalOpen('category')}
                                                        className="px-4 bg-white border border-gray-200 hover:border-green-500 hover:bg-green-50 text-gray-500 hover:text-green-600 rounded-xl transition-all shadow-sm"
                                                    >
                                                        <Plus className="h-5 w-5" />
                                                    </button>
                                                </div>
                                                {category && (
                                                    <div className="flex items-center gap-2 text-xs text-green-600 mt-2 bg-green-50 px-3 py-1.5 rounded-lg w-fit">
                                                        <Check className="h-3 w-3" />
                                                        Category applied: {category.name}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* LOGISTICS */}
                        <div className={activeSection === 'logistics' ? 'block' : 'hidden'}>
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-2">
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                        Stock & Warehouse
                                        <span className="h-px flex-1 bg-gray-100 ml-4"></span>
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2 border border-blue-100 bg-blue-50/30 p-4 rounded-xl">
                                            <label className="flex items-start gap-3 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    name="is_service"
                                                    defaultChecked={initialData?.is_service}
                                                    className="mt-1 w-5 h-5 rounded border-gray-300 text-black focus:ring-black"
                                                />
                                                <div>
                                                    <span className="block text-sm font-bold text-gray-900">Is this a Service?</span>
                                                    <span className="block text-xs text-gray-500 mt-0.5 max-w-xs">
                                                        Services (e.g. Consultation, Delivery) do not track physical stock quantities.
                                                    </span>
                                                </div>
                                            </label>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">Barcode / UPC</label>
                                            <div className="relative">
                                                <Barcode className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <input
                                                    name="barcode"
                                                    defaultValue={initialData?.default_barcode}
                                                    placeholder="Scan barcode..."
                                                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all font-mono text-sm"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">Unit of Measure</label>
                                            <div className="flex gap-2">
                                                <select
                                                    name="uomId"
                                                    defaultValue={initialData?.uom_id}
                                                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all flex-1"
                                                >
                                                    {uoms.map(u => (
                                                        <option key={u.id} value={u.id}>{u.name} ({Number(u.ratio)})</option>
                                                    ))}
                                                </select>
                                                <button
                                                    type="button"
                                                    onClick={() => setModalOpen('uom')}
                                                    className="px-3 py-2 bg-gray-50 hover:bg-green-50 text-gray-600 hover:text-green-600 border border-gray-200 hover:border-green-200 rounded-lg transition-colors"
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">Tracking Method</label>
                                            <select
                                                name="tracking"
                                                defaultValue={initialData?.tracking}
                                                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                            >
                                                <option value="none">No Tracking (Standard)</option>
                                                <option value="batch">Batch / Lot Tracking (Expiry)</option>
                                                <option value="serial">Serial Number Tracking (Unique)</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* FINANCIALS */}
                        <div className={activeSection === 'financials' ? 'block' : 'hidden'}>
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-2">
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                        Pricing & Taxation
                                        <span className="h-px flex-1 bg-gray-100 ml-4"></span>
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">Selling Price</label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-serif italic">₹</span>
                                                <input
                                                    name="price"
                                                    type="number"
                                                    step="0.01"
                                                    required
                                                    defaultValue={initialData?.price}
                                                    placeholder="0.00"
                                                    className="w-full pl-8 pr-4 py-3 text-lg font-bold text-gray-900 bg-white border border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition-all"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">Tax Rate</label>
                                            <select
                                                name="taxRateId"
                                                value={selectedTaxId}
                                                onChange={(e) => setSelectedTaxId(e.target.value)}
                                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                            >
                                                <option value="">Select Tax...</option>
                                                {taxRates.map(t => (
                                                    <option key={t.id} value={t.id}>{t.name} ({Number(t.rate)}%)</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>

            {/* QUICK CREATE MODALS */}
            {modalOpen !== 'none' && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 m-4 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-gray-900 capitalize">New {modalOpen}</h3>
                            <button onClick={() => setModalOpen('none')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <X className="h-4 w-4 text-gray-500" />
                            </button>
                        </div>

                        {modalOpen === 'category' && (
                            <QuickCategoryForm onSuccess={handleQuickSuccess} />
                        )}

                        {modalOpen === 'manufacturer' && (
                            <QuickManufacturerForm onSuccess={handleQuickSuccess} />
                        )}


                        {modalOpen === 'uom' && (
                            <UOMQuickCreate
                                categories={uomCategories}
                                uoms={uoms}
                                onClose={() => setModalOpen('none')}
                                onRefresh={() => router.refresh()}
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

function UOMQuickCreate({ categories, uoms, onClose, onRefresh }: { categories: any[], uoms: any[], onClose: () => void, onRefresh: () => void }) {
    const [catId, setCatId] = useState(categories[0]?.id || "");
    const [type, setType] = useState("reference");
    const [ratio, setRatio] = useState(1);
    const [name, setName] = useState("");

    // Find reference unit for selected category
    const refUom = uoms.find(u => u.category_id === catId && u.uom_type === 'reference');
    const refName = refUom ? refUom.name : "Ref Unit";

    const [state, action, isPending] = useActionState(createUOM, { error: "" });

    useEffect(() => {
        if (state && !('error' in state)) {
            onClose();
            onRefresh();
        }
    }, [state, onClose, onRefresh]);

    return (
        <form action={action} className="space-y-4">
            {state && 'error' in state && state.error && (
                <div className="text-red-500 text-sm bg-red-50 p-2 rounded">{state.error}</div>
            )}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">UOM Name (e.g. Box)</label>
                <input
                    name="name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none"
                    placeholder="e.g. Box"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                    name="categoryId"
                    value={catId}
                    onChange={e => setCatId(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg outline-none cursor-pointer"
                >
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <p className="text-xs text-gray-500 mt-1">Units in same category can be converted.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select
                        name="type"
                        value={type}
                        onChange={e => setType(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg outline-none cursor-pointer"
                    >
                        <option value="reference">Reference Unit</option>
                        <option value="bigger">Bigger than Ref</option>
                        <option value="smaller">Smaller than Ref</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ratio</label>
                    <input
                        name="ratio"
                        type="number"
                        step="0.0001"
                        value={ratio}
                        onChange={e => setRatio(Number(e.target.value))}
                        disabled={type === 'reference'}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none disabled:bg-gray-100 disabled:text-gray-400"
                    />
                </div>
            </div>

            {/* Dynamic Helper Text */}
            <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800 flex items-start gap-2">
                <Info className="h-4 w-4 mt-0.5 shrink-0" />
                <div>
                    {type === 'reference' ? (
                        <p>This will be the <strong>base unit</strong> for {categories.find(c => c.id === catId)?.name}. (1 {name || 'Unit'} = 1 {name || 'Unit'})</p>
                    ) : type === 'bigger' ? (
                        <p><strong>1 {name || 'Unit'}</strong> = <strong>{ratio} {refName}</strong></p>
                    ) : (
                        <p><strong>1 {name || 'Unit'}</strong> = <strong>{ratio} {refName}</strong> (or 1 {refName} = {1 / ratio} {name})</p>
                    )}
                    {!refUom && type !== 'reference' && (
                        <p className="text-red-600 mt-1 font-bold text-xs">Warning: No Reference Unit found for this category yet!</p>
                    )}
                </div>
            </div>

            <button type="submit" className="w-full py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors mt-2">Create UOM</button>
        </form>
    );
}

