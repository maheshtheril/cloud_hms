'use client';

import { useState, useEffect } from 'react';
import { Building2, MapPin, ChevronDown, Check, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getTenantCompanies, switchCompany, getBranches, switchBranch } from '@/app/actions/company';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';

interface CompactOrgSwitcherProps {
    initialActiveCompany?: any;
    tenant?: any;
    collapsed?: boolean;
}

export function CompactOrgSwitcher({
    initialActiveCompany,
    tenant,
    collapsed = false
}: CompactOrgSwitcherProps) {
    const { data: session, update } = useSession();
    const [isOpen, setIsOpen] = useState(false);
    const [companies, setCompanies] = useState<any[]>([]);
    const [branches, setBranches] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const currentBranchId = (session?.user as any)?.current_branch_id;
    const currentBranchName = (session?.user as any)?.current_branch_name || 'All Locations';
    const activeCompany = initialActiveCompany || { name: 'Select Company', logo_url: null };

    useEffect(() => {
        async function load() {
            setLoading(true);
            const [companiesRes, branchesRes] = await Promise.all([
                getTenantCompanies(),
                getBranches()
            ]);

            if (companiesRes.success && companiesRes.data) {
                setCompanies(companiesRes.data);
            }
            if (branchesRes.success && branchesRes.data) {
                setBranches(branchesRes.data);
            }
            setLoading(false);
        }

        if (isOpen && (companies.length === 0 || branches.length === 0)) {
            load();
        }
    }, [isOpen, companies.length, branches.length]);

    const handleCompanySwitch = async (companyId: string) => {
        setLoading(true);
        const res = await switchCompany(companyId);
        if (res.success) {
            await update({ companyId });
            setIsOpen(false);
            router.refresh();
        } else {
            alert('Failed to switch company');
        }
        setLoading(false);
    };

    const handleBranchSwitch = async (branchId: string, branchName: string) => {
        if (branchId === currentBranchId) return;

        setLoading(true);
        const res = await switchBranch(branchId);
        if (res.success) {
            await update({ branchId, branchName });
            setIsOpen(false);
            router.refresh();
        } else {
            alert('Failed to switch branch: ' + res.error);
        }
        setLoading(false);
    };

    if (collapsed) {
        return (
            <div className="relative flex justify-center mb-3">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center justify-center w-10 h-10 rounded-xl bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 hover:border-indigo-300 dark:hover:border-indigo-600 transition-all shadow-sm hover:shadow-md group"
                >
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold overflow-hidden">
                        {activeCompany?.logo_url ? (
                            <img src={activeCompany.logo_url} alt={activeCompany.name} className="w-full h-full object-cover" />
                        ) : (
                            activeCompany?.name?.substring(0, 1).toUpperCase() || 'O'
                        )}
                    </div>
                </button>

                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
                        <div className="absolute left-full ml-2 top-0 z-20 w-72">
                            <OrgSwitcherContent
                                activeCompany={activeCompany}
                                currentBranchId={currentBranchId}
                                currentBranchName={currentBranchName}
                                companies={companies}
                                branches={branches}
                                tenant={tenant}
                                loading={loading}
                                onCompanySwitch={handleCompanySwitch}
                                onBranchSwitch={handleBranchSwitch}
                                onClose={() => setIsOpen(false)}
                            />
                        </div>
                    </>
                )}
            </div>
        );
    }

    return (
        <div className="relative px-4 mb-3">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 hover:border-indigo-300 dark:hover:border-indigo-600 transition-all w-full text-left shadow-sm hover:shadow-md group"
            >
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <Building2 className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                        <span className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                            {activeCompany?.name || 'Select Organization'}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3 text-emerald-500 shrink-0" />
                        <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
                            {currentBranchName}
                        </span>
                    </div>
                </div>
                <ChevronDown className={cn(
                    "h-4 w-4 text-slate-400 group-hover:text-indigo-500 transition-all shrink-0",
                    isOpen && "rotate-180"
                )} />
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
                    <div className="absolute top-full left-4 right-4 mt-2 z-20">
                        <OrgSwitcherContent
                            activeCompany={activeCompany}
                            currentBranchId={currentBranchId}
                            currentBranchName={currentBranchName}
                            companies={companies}
                            branches={branches}
                            tenant={tenant}
                            loading={loading}
                            onCompanySwitch={handleCompanySwitch}
                            onBranchSwitch={handleBranchSwitch}
                            onClose={() => setIsOpen(false)}
                        />
                    </div>
                </>
            )}
        </div>
    );
}

function OrgSwitcherContent({
    activeCompany,
    currentBranchId,
    currentBranchName,
    companies,
    branches,
    tenant,
    loading,
    onCompanySwitch,
    onBranchSwitch,
    onClose
}: any) {
    return (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Organizations Section */}
            <div className="p-2 border-b border-slate-100 dark:border-zinc-800">
                <div className="px-2 py-1.5 text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">
                    Organization
                </div>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                    {companies.length > 0 ? (
                        companies.map((company: any) => (
                            <button
                                key={company.id}
                                onClick={() => onCompanySwitch(company.id)}
                                disabled={loading}
                                className={cn(
                                    "flex items-center gap-3 px-2 py-2 rounded-lg cursor-pointer w-full transition-colors",
                                    activeCompany?.id === company.id
                                        ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300"
                                        : "hover:bg-slate-50 dark:hover:bg-zinc-800"
                                )}
                            >
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shrink-0 overflow-hidden">
                                    {company.logo_url ? (
                                        <img src={company.logo_url} alt={company.name} className="w-full h-full object-cover" />
                                    ) : (
                                        company.name?.substring(0, 1).toUpperCase()
                                    )}
                                </div>
                                <span className="flex-1 text-sm font-medium truncate text-left">
                                    {company.name}
                                </span>
                                {activeCompany?.id === company.id && (
                                    <Check className="h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                                )}
                            </button>
                        ))
                    ) : (
                        <div className="px-2 py-2 text-sm text-slate-500">
                            {activeCompany?.name || 'No organization'}
                        </div>
                    )}
                </div>
                {companies.length > 0 && (
                    <div className="border-t border-slate-100 dark:border-zinc-800 mt-2 pt-2">
                        <Link
                            href="/hms/settings/companies/new"
                            className="flex items-center gap-2 px-2 py-2 text-sm text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg w-full transition-colors"
                            onClick={onClose}
                        >
                            <Plus size={14} />
                            Create New Company
                        </Link>
                    </div>
                )}
            </div>

            {/* Branches Section */}
            {branches.length > 0 && (
                <div className="p-2">
                    <div className="px-2 py-1.5 text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">
                        Location
                    </div>
                    <div className="space-y-1 max-h-48 overflow-y-auto">
                        {branches.map((branch: any) => (
                            <button
                                key={branch.id}
                                onClick={() => onBranchSwitch(branch.id, branch.name)}
                                disabled={loading}
                                className={cn(
                                    "flex items-center gap-3 px-2 py-2 rounded-lg cursor-pointer w-full transition-colors",
                                    currentBranchId === branch.id
                                        ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300"
                                        : "hover:bg-slate-50 dark:hover:bg-zinc-800"
                                )}
                            >
                                <div className={cn(
                                    "h-2 w-2 rounded-full shrink-0",
                                    currentBranchId === branch.id
                                        ? "bg-emerald-500 animate-pulse"
                                        : "bg-slate-300 dark:bg-zinc-700"
                                )} />
                                <span className="flex-1 text-sm truncate text-left">
                                    {branch.name}
                                </span>
                                {currentBranchId === branch.id && (
                                    <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
