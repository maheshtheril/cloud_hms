
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

    const handleSubmit = async () => {
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

    const parentOptions = accounts.filter(a =>
        a.id !== editingAccount?.id &&
        a.is_group && // Only groups can be parents
        a.type === formData.type // Strict type hierarchy matching
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

            {/* Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[500px] rounded-[2rem] border-slate-200 dark:border-slate-800 shadow-2xl">
                    <DialogHeader className="space-y-3">
                        <DialogTitle className="text-2xl font-black text-slate-900 dark:text-white">
                            {editingAccount ? "Modify Account" : "Design Account"}
                        </DialogTitle>
                        <DialogDescription className="font-medium text-slate-500">
                            Configure the identity and hierarchy of this financial record.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 py-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-xs font-black uppercase tracking-widest text-slate-500">Account Code</Label>
                                <Input
                                    value={formData.code}
                                    onChange={e => setFormData({ ...formData, code: e.target.value })}
                                    className="h-11 rounded-xl bg-slate-50 dark:bg-slate-900 border-none font-bold text-slate-900 dark:text-white"
                                    placeholder="e.g. 1010"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-black uppercase tracking-widest text-slate-500">Account Type</Label>
                                <Select
                                    value={formData.type}
                                    onValueChange={v => setFormData({ ...formData, type: v })}
                                >
                                    <SelectTrigger className="h-11 rounded-xl bg-slate-50 dark:bg-slate-900 border-none font-bold ring-offset-transparent focus:ring-0">
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

                        <div className="space-y-2">
                            <Label className="text-xs font-black uppercase tracking-widest text-slate-500">Account Name</Label>
                            <Input
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="h-11 rounded-xl bg-slate-50 dark:bg-slate-900 border-none font-bold text-slate-900 dark:text-white"
                                placeholder="Enter account designation..."
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-black uppercase tracking-widest text-slate-500">Parent Category</Label>
                            <Select
                                value={formData.parent_id}
                                onValueChange={v => setFormData({ ...formData, parent_id: v })}
                            >
                                <SelectTrigger className="h-11 rounded-xl bg-slate-50 dark:bg-slate-900 border-none font-bold ring-offset-transparent focus:ring-0">
                                    <SelectValue placeholder="Root Level" />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-slate-200 dark:border-slate-800">
                                    <SelectItem value="none" className="rounded-xl font-bold py-3">Root (No Parent)</SelectItem>
                                    {parentOptions.map(p => (
                                        <SelectItem key={p.id} value={p.id} className="rounded-xl font-bold py-3">{p.code} - {p.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4">
                            <div
                                onClick={() => setFormData({ ...formData, is_group: !formData.is_group })}
                                className={cn(
                                    "p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center justify-center gap-2",
                                    formData.is_group ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/20" : "border-slate-100 dark:border-slate-800 grayscale hover:grayscale-0"
                                )}
                            >
                                <BookOpen className={cn("w-6 h-6", formData.is_group ? "text-blue-500" : "text-slate-400")} />
                                <span className={cn("text-[10px] font-black uppercase tracking-widest", formData.is_group ? "text-blue-600" : "text-slate-500")}>Header Group</span>
                            </div>

                            <div
                                onClick={() => setFormData({ ...formData, is_reconcilable: !formData.is_reconcilable })}
                                className={cn(
                                    "p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center justify-center gap-2",
                                    formData.is_reconcilable ? "border-green-500 bg-green-50/50 dark:bg-green-900/20" : "border-slate-100 dark:border-slate-800 grayscale hover:grayscale-0"
                                )}
                            >
                                <RefreshCw className={cn("w-6 h-6", formData.is_reconcilable ? "text-green-500" : "text-slate-400")} />
                                <span className={cn("text-[10px] font-black uppercase tracking-widest", formData.is_reconcilable ? "text-green-600" : "text-slate-500")}>Reconcilable</span>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="pt-4 flex !justify-between gap-3">
                        <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="rounded-full font-bold text-slate-500 h-12 flex-1 hover:bg-slate-100">
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} disabled={isLoading} className="rounded-full font-black text-white bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 flex-1 h-12 shadow-lg">
                            {isLoading && <RefreshCw className="w-4 h-4 mr-2 animate-spin" />}
                            {editingAccount ? "Apply Changes" : "Confirm Design"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
