
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
    is_reconcilable: boolean
    is_active: boolean
}

const ACCOUNT_TYPES = [
    { value: 'Asset', label: 'Asset', color: 'text-blue-600 bg-blue-50 border-blue-200' },
    { value: 'Liability', label: 'Liability', color: 'text-orange-600 bg-orange-50 border-orange-200' },
    { value: 'Equity', label: 'Equity', color: 'text-purple-600 bg-purple-50 border-purple-200' },
    { value: 'Revenue', label: 'Income / Revenue', color: 'text-green-600 bg-green-50 border-green-200' },
    { value: 'Expense', label: 'Expense', color: 'text-red-600 bg-red-50 border-red-200' },
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
        is_reconcilable: false
    })

    const filteredAccounts = accounts.filter(acc =>
        acc.name.toLowerCase().includes(search.toLowerCase()) ||
        acc.code.toLowerCase().includes(search.toLowerCase())
    ).sort((a, b) => a.code.localeCompare(b.code));

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
                is_reconcilable: account.is_reconcilable
            })
        } else {
            setEditingAccount(null)
            setFormData({ code: '', name: '', type: 'Asset', parent_id: 'none', is_reconcilable: false })
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
        (a.type === formData.type) // Strict type hierarchy matching
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                        Chart of Accounts
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your financial ledger accounts and structure.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button onClick={() => handleOpenDialog()} className="shadow-lg hover:shadow-xl transition-all">
                        <Plus className="w-4 h-4 mr-2" />
                        New Account
                    </Button>
                </div>
            </div>

            {/* Search */}
            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by code or name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 bg-white/50 backdrop-blur-sm border-gray-200 focus:border-blue-500 transition-all"
                    />
                </div>
            </div>

            {/* Account List Grouped */}
            <div className="space-y-8">
                {groupedAccounts.map(group => (
                    <Card key={group.value} className="border-none shadow-sm bg-transparent">
                        <CardHeader className="px-0 py-2 border-b border-gray-100 mb-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold flex items-center gap-2">
                                    <span className={cn("w-2 h-8 rounded-full", group.color.split(' ')[1])}></span>
                                    {group.label}
                                    <Badge variant="secondary" className="ml-2 font-normal text-xs">
                                        {group.accounts.length}
                                    </Badge>
                                </h2>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="rounded-xl border bg-white/80 backdrop-blur-sm overflow-hidden shadow-sm">
                                <Table>
                                    <TableHeader className="bg-gray-50/50">
                                        <TableRow>
                                            <TableHead className="w-[100px]">Code</TableHead>
                                            <TableHead>Account Name</TableHead>
                                            <TableHead className="w-[150px]">Type</TableHead>
                                            <TableHead className="w-[100px] text-center">Settings</TableHead>
                                            <TableHead className="w-[120px] text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {group.accounts.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                                    No accounts found in this category.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            group.accounts.map((acc) => (
                                                <TableRow key={acc.id} className="hover:bg-blue-50/30 transition-colors group">
                                                    <TableCell className="font-mono font-medium text-gray-700">
                                                        {acc.code}
                                                    </TableCell>
                                                    <TableCell className="font-medium">
                                                        {acc.parent_id && <span className="text-gray-400 mr-2">↳</span>}
                                                        {acc.name}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline" className={cn("capitalize mix-blend-multiply", group.color)}>
                                                            {acc.type}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        {acc.is_reconcilable && (
                                                            <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200 text-[10px]">
                                                                Reconcilable
                                                            </Badge>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <Link href={`/accounting/ledger/${acc.id}`}>
                                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-indigo-600" title="View General Ledger">
                                                                    <BookOpen className="w-3.5 h-3.5" />
                                                                </Button>
                                                            </Link>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 text-gray-500 hover:text-blue-600"
                                                                onClick={() => handleOpenDialog(acc)}
                                                                title="Edit Account"
                                                            >
                                                                <Pencil className="w-3.5 h-3.5" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingAccount ? "Edit Account" : "Create New Account"}</DialogTitle>
                        <DialogDescription>
                            Define the details for this general ledger account.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Account Code</Label>
                                <Input
                                    value={formData.code}
                                    onChange={e => setFormData({ ...formData, code: e.target.value })}
                                    placeholder="e.g. 1050"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Account Type</Label>
                                <Select
                                    value={formData.type}
                                    onValueChange={v => setFormData({ ...formData, type: v })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {ACCOUNT_TYPES.map(t => (
                                            <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Account Name</Label>
                            <Input
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g. Petty Cash"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Parent Account (Optional)</Label>
                            <Select
                                value={formData.parent_id}
                                onValueChange={v => setFormData({ ...formData, parent_id: v })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="None" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">None</SelectItem>
                                    {parentOptions.map(p => (
                                        <SelectItem key={p.id} value={p.id}>{p.code} - {p.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center gap-2 pt-2">
                            <input
                                type="checkbox"
                                id="is_reconcilable"
                                checked={formData.is_reconcilable}
                                onChange={e => setFormData({ ...formData, is_reconcilable: e.target.checked })}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <Label htmlFor="is_reconcilable" className="cursor-pointer">Enable Reconciliation</Label>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleSubmit} disabled={isLoading}>
                            {isLoading && <RefreshCw className="w-4 h-4 mr-2 animate-spin" />}
                            {editingAccount ? "Update Account" : "Create Account"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
