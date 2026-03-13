
'use client'

import { useState } from "react"
import Link from "next/link"
import { Plus, Search, Pencil, Trash2, RefreshCw, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { deleteAccount, upsertAccount } from "@/app/actions/accounting/chart-of-accounts"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface Account {
    id: string
    code: string
    name: string
    type: string
    parent_id?: string | null
    is_group: boolean
    is_reconcilable: boolean
    is_active: boolean
}

const ACCOUNT_TYPES = [
    { value: 'Asset', label: 'Asset', color: 'text-blue-600 bg-blue-50 border-blue-200', dot: 'bg-blue-500' },
    { value: 'Liability', label: 'Liability', color: 'text-orange-600 bg-orange-50 border-orange-200', dot: 'bg-orange-500' },
    { value: 'Equity', label: 'Equity', color: 'text-purple-600 bg-purple-50 border-purple-200', dot: 'bg-purple-500' },
    { value: 'Revenue', label: 'Income / Revenue', color: 'text-green-600 bg-green-50 border-green-200', dot: 'bg-green-500' },
    { value: 'Expense', label: 'Expense', color: 'text-red-600 bg-red-50 border-red-200', dot: 'bg-red-500' },
]

export function ChartOfAccountsManager({ initialAccounts }: { initialAccounts: Account[] }) {
    const [accounts, setAccounts] = useState<Account[]>(initialAccounts)
    const [search, setSearch] = useState("")
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    // Form State
    const [editingAccount, setEditingAccount] = useState<Account | null>(null)
    const [formData, setFormData] = useState({
        code: '',
        name: '',
        type: 'Asset',
        parent_id: 'none',
        is_group: false,
        is_reconcilable: false
    })

    const filteredAccounts = accounts.filter(acc =>
        acc.name.toLowerCase().includes(search.toLowerCase()) ||
        acc.code.toLowerCase().includes(search.toLowerCase())
    ).sort((a, b) => a.code.localeCompare(b.code));

    // Helper to get depth for indentation
    const getAccountDepth = (acc: Account, allAccs: Account[]): number => {
        let depth = 0;
        let current = acc;
        while (current.parent_id) {
            const parent = allAccs.find(a => a.id === current.parent_id);
            if (!parent) break;
            depth++;
            current = parent;
        }
        return depth;
    };

    const groupedAccounts = ACCOUNT_TYPES.map(type => ({
        ...type,
        accounts: filteredAccounts.filter(a => a.type === type.value)
    })).filter(g => g.accounts.length > 0 || search === "");

    const handleOpenDialog = (account?: Account) => {
        if (account) {
            setEditingAccount(account)
            setFormData({
                code: account.code,
                name: account.name,
                type: account.type,
                parent_id: account.parent_id || 'none',
                is_group: account.is_group ?? false,
                is_reconcilable: account.is_reconcilable
            })
        } else {
            setEditingAccount(null)
            setFormData({ code: '', name: '', type: 'Asset', parent_id: 'none', is_group: false, is_reconcilable: false })
        }
        setIsDialogOpen(true)
    }

    const suggestNextCode = (parentId: string, type: string) => {
        const siblings = accounts.filter(a => (parentId === 'none' ? !a.parent_id : a.parent_id === parentId) && a.type === type);
        if (siblings.length === 0) {
            // Suggesting based on parent code if possible
            const parent = accounts.find(a => a.id === parentId);
            if (parent) return `${parent.code}01`;
            return "";
        }
        const codes = siblings.map(s => parseInt(s.code)).filter(c => !isNaN(c));
        if (codes.length === 0) return "";
        return (Math.max(...codes) + 1).toString();
    }

    const handleQuickAdd = (parent: Account) => {
        const nextCode = suggestNextCode(parent.id, parent.type);
        setEditingAccount(null);
        setFormData({
            code: nextCode,
            name: '',
            type: parent.type,
            parent_id: parent.id,
            is_group: false, // Default to ledger for quick add, can toggle
            is_reconcilable: parent.type === 'Asset' || parent.type === 'Liability'
        });
        setIsDialogOpen(true);
    }

    const handleSubmit = async () => {
        if (!formData.code || !formData.name) {
            toast.error("Please fill in the code and name.");
            return;
        }

        setIsLoading(true)
        try {
            const payload = {
                id: editingAccount?.id,
                code: formData.code,
                name: formData.name,
                type: formData.type,
                is_group: formData.is_group,
                is_reconcilable: formData.is_reconcilable,
                parent_id: formData.parent_id === 'none' ? null : formData.parent_id
            };

            const res = await upsertAccount(payload)

            if (res.error) {
                toast.error(res.error)
            } else {
                toast.success(editingAccount ? "Account updated" : "Account created")
                setIsDialogOpen(false)
                window.location.reload();
            }
        } catch (e) {
            toast.error("An unexpected error occurred")
        } finally {
            setIsLoading(false)
        }
    }

    // When parent changes, inheritance logic
    const handleParentChange = (parentId: string) => {
        const parent = accounts.find(a => a.id === parentId);
        if (parent) {
            const nextCode = suggestNextCode(parentId, parent.type);
            setFormData(prev => ({
                ...prev,
                parent_id: parentId,
                type: parent.type,
                code: nextCode || prev.code
            }));
        } else {
            setFormData(prev => ({ ...prev, parent_id: parentId }));
        }
    }

    const parentOptions = accounts.filter(a =>
        a.id !== editingAccount?.id &&
        a.is_group && // Only groups can be parents
        (editingAccount ? a.type === editingAccount.type : true) // Ensure type consistency if editing
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                        Chart of Accounts
                    </h1>
                    <p className="text-slate-500 mt-1 font-medium">
                        World-Standard general ledger structure for your enterprise.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button onClick={() => handleOpenDialog()} className="shadow-lg hover:shadow-xl transition-all h-11 px-6 rounded-full bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 border-none group">
                        <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform" />
                        Create New Account
                    </Button>
                </div>
            </div>

            {/* Search */}
            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    <Input
                        placeholder="Search by code or name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-11 h-12 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
                    />
                </div>
            </div>

            {/* Account List Grouped */}
            <div className="grid gap-8">
                {groupedAccounts.map(group => (
                    <div key={group.value} className="space-y-4">
                        <div className="flex items-center justify-between px-2">
                            <div className="flex items-center gap-3">
                                <div className={cn("w-3 h-3 rounded-full shadow-sm", group.dot)}></div>
                                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider">
                                    {group.label}
                                </h2>
                                <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-bold border border-slate-200 dark:border-slate-700">
                                    {group.accounts.length} Accounts
                                </span>
                            </div>
                        </div>

                        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-930 backdrop-blur-md overflow-hidden shadow-sm">
                            <Table>
                                <TableHeader className="bg-slate-50/50 dark:bg-slate-900/50">
                                    <TableRow className="hover:bg-transparent border-slate-200 dark:border-slate-800">
                                        <TableHead className="w-[120px] font-bold text-slate-700 dark:text-slate-300">CODE</TableHead>
                                        <TableHead className="font-bold text-slate-700 dark:text-slate-300">ACCOUNT NAME & HIERARCHY</TableHead>
                                        <TableHead className="w-[120px] text-center font-bold text-slate-700 dark:text-slate-300">LEVEL</TableHead>
                                        <TableHead className="w-[120px] text-right font-bold text-slate-700 dark:text-slate-300">ACTIONS</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {group.accounts.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="h-32 text-center text-slate-400 font-medium italic">
                                                No accounts found in this category.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        group.accounts.map((acc) => {
                                            const depth = getAccountDepth(acc, accounts);
                                            return (
                                                <TableRow key={acc.id} className={cn(
                                                    "transition-all group border-slate-100 dark:border-slate-900",
                                                    acc.is_group ? "bg-slate-50/30 dark:bg-slate-900/10" : "hover:bg-blue-50/30 dark:hover:bg-blue-900/10"
                                                )}>
                                                    <TableCell className="font-mono font-bold text-slate-500 dark:text-slate-400">
                                                        {acc.code}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2" style={{ paddingLeft: `${depth * 24}px` }}>
                                                            {depth > 0 && <span className="text-slate-300 dark:text-slate-700">└─</span>}
                                                            {acc.is_group ? (
                                                                <BookOpen className="w-4 h-4 text-indigo-500" />
                                                            ) : (
                                                                <div className="w-4 h-4 border-2 border-slate-300 dark:border-slate-700 rounded-sm"></div>
                                                            )}
                                                            <div>
                                                                <span className={cn(
                                                                    "font-semibold",
                                                                    acc.is_group ? "text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-300"
                                                                )}>
                                                                    {acc.name}
                                                                </span>
                                                                {acc.is_reconcilable && (
                                                                    <Badge variant="outline" className="ml-2 h-4 px-1.5 text-[9px] border-green-200 bg-green-50 text-green-600 dark:bg-green-950/20 dark:border-green-900/50 uppercase font-black">
                                                                        RECON
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        {acc.is_group ? (
                                                            <Badge className="bg-slate-900 dark:bg-white dark:text-slate-900 hover:bg-slate-900 rounded-md text-[10px] uppercase font-black tracking-tighter px-2 h-6">
                                                                GROUP
                                                            </Badge>
                                                        ) : (
                                                            <Badge variant="outline" className="text-slate-400 border-slate-200 dark:border-slate-800 rounded-md text-[10px] uppercase font-black tracking-tighter px-2 h-6">
                                                                LEDGER
                                                            </Badge>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            {acc.is_group && (
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-8 w-8 text-slate-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-full"
                                                                    onClick={() => handleQuickAdd(acc)}
                                                                    title="Add Child Account"
                                                                >
                                                                    <Plus className="w-4 h-4" />
                                                                </Button>
                                                            )}
                                                            {!acc.is_group && (
                                                                <Link href={`/hms/accounting/ledger/${acc.id}`}>
                                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full" title="View Ledger">
                                                                        <BookOpen className="w-4 h-4" />
                                                                    </Button>
                                                                </Link>
                                                            )}
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-full"
                                                                onClick={() => handleOpenDialog(acc)}
                                                                title="Edit Account"
                                                            >
                                                                <Pencil className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                ))}
            </div>

            {/* Tally-Style Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[500px] rounded-[1.5rem] border-slate-200 dark:border-slate-800 shadow-2xl p-0 overflow-hidden">
                    <div className="bg-slate-900 dark:bg-slate-950 p-6 text-white">
                        <DialogHeader className="space-y-1">
                            <DialogTitle className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-indigo-400" />
                                {editingAccount ? "Modify Master" : "Create Master"}
                            </DialogTitle>
                            <DialogDescription className="text-slate-400 font-medium text-xs uppercase tracking-widest">
                                {formData.is_group ? "Group creation mode" : "Ledger creation mode"}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="flex gap-2 mt-6">
                            <Button
                                variant="ghost"
                                onClick={() => setFormData({ ...formData, is_group: false })}
                                className={cn(
                                    "flex-1 h-12 rounded-xl font-black text-xs uppercase tracking-wider transition-all border-2",
                                    !formData.is_group 
                                        ? "bg-white text-slate-900 border-white" 
                                        : "bg-slate-800/50 text-slate-400 border-transparent hover:bg-slate-800"
                                )}
                            >
                                Ledger
                            </Button>
                            <Button
                                variant="ghost"
                                onClick={() => setFormData({ ...formData, is_group: true })}
                                className={cn(
                                    "flex-1 h-12 rounded-xl font-black text-xs uppercase tracking-wider transition-all border-2",
                                    formData.is_group 
                                        ? "bg-indigo-600 text-white border-indigo-600" 
                                        : "bg-slate-800/50 text-slate-400 border-transparent hover:bg-slate-800"
                                )}
                            >
                                Group
                            </Button>
                        </div>
                    </div>

                    <div className="p-8 space-y-6 bg-white dark:bg-slate-900">
                        {/* Primary Name Field - Always First */}
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Name of {formData.is_group ? "Group" : "Ledger"}</Label>
                            <Input
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="h-14 rounded-xl bg-slate-50 dark:bg-slate-950 border-2 border-transparent focus:border-indigo-500 font-bold text-lg px-4 transition-all"
                                placeholder="Enter Name..."
                                autoFocus
                            />
                        </div>

                        {/* Under (Group Selection) - Primary Logic Driver */}
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Under (Parent Group)</Label>
                            <Select
                                value={formData.parent_id}
                                onValueChange={handleParentChange}
                                disabled={!!editingAccount}
                            >
                                <SelectTrigger className="h-12 rounded-xl bg-slate-50 dark:bg-slate-950 border-none font-bold ring-offset-transparent focus:ring-2 focus:ring-indigo-500/20 px-4">
                                    <SelectValue placeholder="Select Group..." />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-slate-200 dark:border-slate-800 max-h-[300px]">
                                    <SelectItem value="none" className="rounded-xl font-bold py-3">Primary / Root</SelectItem>
                                    {parentOptions.map(p => (
                                        <SelectItem key={p.id} value={p.id} className="rounded-xl font-bold py-3">
                                            <div className="flex flex-col">
                                                <span>{p.name}</span>
                                                <span className="text-[10px] text-slate-400 font-medium">Under {p.type}</span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-6 pt-2">
                             {/* Code - Now secondary/suggested */}
                             <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Accounting Code</Label>
                                <Input
                                    value={formData.code}
                                    onChange={e => setFormData({ ...formData, code: e.target.value })}
                                    className="h-11 rounded-xl bg-slate-50 dark:bg-slate-950 border-none font-mono font-bold text-slate-600 dark:text-slate-400"
                                    placeholder="Auto"
                                />
                            </div>

                            {/* Type - Inherited & Semi-Hidden if Parent Set */}
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Account Nature</Label>
                                <Select
                                    value={formData.type}
                                    onValueChange={v => setFormData({ ...formData, type: v })}
                                    disabled={formData.parent_id !== 'none'}
                                >
                                    <SelectTrigger className={cn(
                                        "h-11 rounded-xl bg-slate-50 dark:bg-slate-950 border-none font-bold ring-offset-transparent focus:ring-0",
                                        formData.parent_id !== 'none' && "opacity-50"
                                    )}>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl border-slate-200 dark:border-slate-800">
                                        {ACCOUNT_TYPES.map(t => (
                                            <SelectItem key={t.value} value={t.value} className="rounded-xl font-bold py-3">{t.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Reconciliation Option */}
                        {!formData.is_group && (
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800">
                                <div className="space-y-0.5">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Enable Reconciliation</Label>
                                    <p className="text-[10px] text-slate-400 font-medium">Allow manual clearing of entries</p>
                                </div>
                                <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => setFormData({ ...formData, is_reconcilable: !formData.is_reconcilable })}
                                    className={cn(
                                        "h-8 px-3 rounded-lg font-black text-[9px] uppercase tracking-tighter transition-all",
                                        formData.is_reconcilable ? "bg-green-500 text-white" : "bg-slate-200 text-slate-500 dark:bg-slate-800"
                                    )}
                                >
                                    {formData.is_reconcilable ? "Active" : "Disabled"}
                                </Button>
                            </div>
                        )}
                    </div>

                    <DialogFooter className="p-6 pt-0 bg-white dark:bg-slate-900 border-none flex !justify-stretch gap-3">
                        <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="rounded-xl font-bold text-slate-400 h-14 flex-1 hover:bg-slate-50 dark:hover:bg-slate-950">
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} disabled={isLoading} className="rounded-xl font-black text-white bg-indigo-600 hover:bg-indigo-700 dark:text-white flex-[2] h-14 shadow-lg shadow-indigo-500/20">
                            {isLoading && <RefreshCw className="w-4 h-4 mr-2 animate-spin" />}
                            {editingAccount ? "Update Master" : "Create Master"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
