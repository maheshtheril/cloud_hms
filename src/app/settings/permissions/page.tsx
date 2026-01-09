'use client'

import { useState, useEffect, useMemo } from "react"
import { getAllPermissions } from "@/app/actions/rbac"
import { createPermission, deletePermission } from "@/app/actions/permissions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Plus, Trash2, Shield, Search, Lock, Code, LayoutGrid, List } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// Futuristic Module Colors
const MODULE_COLORS: Record<string, string> = {
    'HMS': 'text-cyan-400 bg-cyan-950/30 border-cyan-800',
    'CRM': 'text-purple-400 bg-purple-950/30 border-purple-800',
    'Finance': 'text-emerald-400 bg-emerald-950/30 border-emerald-800',
    'Inventory': 'text-amber-400 bg-amber-950/30 border-amber-800',
    'Purchasing': 'text-orange-400 bg-orange-950/30 border-orange-800',
    'Pharmacy': 'text-teal-400 bg-teal-950/30 border-teal-800',
    'System': 'text-slate-400 bg-slate-950/30 border-slate-800',
    'Custom': 'text-pink-400 bg-pink-950/30 border-pink-800'
};

export default function PermissionsPage() {
    const [permissions, setPermissions] = useState<Array<{ code: string; name: string; module: string }>>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [selectedModule, setSelectedModule] = useState("All")

    // Create/Delete States
    const [createOpen, setCreateOpen] = useState(false)
    const [newPermission, setNewPermission] = useState({ code: '', name: '', module: 'Custom' })
    const [submitting, setSubmitting] = useState(false)
    const { toast } = useToast()
    const [isCustomModule, setIsCustomModule] = useState(false);

    const loadPermissions = async () => {
        setLoading(true)
        const result = await getAllPermissions()
        if (result.success && result.data) {
            setPermissions(result.data)
        }
        setLoading(false)
    }

    useEffect(() => {
        loadPermissions()
    }, [])

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPermission.code || !newPermission.name) return;

        setSubmitting(true);
        try {
            const result = await createPermission({
                code: newPermission.code,
                name: newPermission.name,
                category: newPermission.module
            });

            if (result.error) {
                toast({ title: "Error", description: result.error, variant: "destructive" });
            } else {
                toast({ title: "Success", description: "Permission created successfully" });
                setCreateOpen(false);
                setNewPermission({ code: '', name: '', module: 'Custom' });
                setIsCustomModule(false);
                loadPermissions();
            }
        } catch (error) {
            toast({ title: "Operation Failed", description: "Could not create permission", variant: "destructive" });
        } finally {
            setSubmitting(false);
        }
    }

    const handleDelete = async (code: string) => {
        if (!confirm(`Are you sure you want to delete permission '${code}'? \nThis allows access to functionality.`)) return;

        const result = await deletePermission(code);
        if (result.error) {
            toast({ title: "Error", description: result.error, variant: "destructive" });
        } else {
            toast({ title: "Permission Deleted", description: `Permission '${code}' removed.` });
            loadPermissions();
        }
    }

    // Filter Logic
    const filteredPermissions = useMemo(() => {
        return permissions.filter(p => {
            const matchesSearch =
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.code.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesModule = selectedModule === "All" || p.module === selectedModule;

            return matchesSearch && matchesModule;
        });
    }, [permissions, searchQuery, selectedModule]);

    // Group for stats
    const moduleStats = useMemo(() => {
        const stats: Record<string, number> = {};
        permissions.forEach(p => {
            stats[p.module] = (stats[p.module] || 0) + 1;
        });
        return stats;
    }, [permissions]);

    // Dynamic Module List
    const availableModules = useMemo(() => {
        const mods = new Set(permissions.map(p => p.module));
        // Ensure Core Modules always exist
        ['HMS', 'CRM', 'Finance', 'Inventory', 'System'].forEach(m => mods.add(m));
        return Array.from(mods).sort();
    }, [permissions]);


    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-8 font-sans">
            {/* Ambient Background Glow */}
            <div className="fixed top-0 left-0 w-full h-96 bg-purple-900/20 blur-[120px] rounded-full pointer-events-none -translate-y-1/2" />
            <div className="fixed bottom-0 right-0 w-full h-96 bg-cyan-900/10 blur-[120px] rounded-full pointer-events-none translate-y-1/2" />

            <div className="max-w-7xl mx-auto relative z-10 space-y-8">

                {/* Header Section */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/5">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent flex items-center gap-3">
                            <Shield className="h-10 w-10 text-cyan-400" />
                            Access Control Registry
                        </h1>
                        <p className="text-slate-400 mt-2 text-lg">
                            Define granular capabilities for the neural system.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                            <DialogTrigger asChild>
                                <Button size="lg" className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/20 md:w-auto w-full">
                                    <Plus className="mr-2 h-5 w-5" />
                                    Create Permission
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-slate-900 border-slate-800 text-slate-100">
                                <DialogHeader>
                                    <DialogTitle className="text-2xl">Define New Capability</DialogTitle>
                                    <DialogDescription className="text-slate-400">
                                        Create a new permission code that can be used to protect Pages, Forms, or API Routes.
                                    </DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleCreate} className="space-y-6 mt-4">
                                    <div className="space-y-2">
                                        <Label className="text-cyan-400">Permission Code</Label>
                                        <div className="relative">
                                            <Code className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                                            <Input
                                                placeholder="e.g. hms:surgery:create"
                                                value={newPermission.code}
                                                onChange={e => setNewPermission({ ...newPermission, code: e.target.value })}
                                                className="pl-9 bg-slate-950 border-slate-700 font-mono text-sm"
                                                required
                                            />
                                        </div>
                                        <p className="text-xs text-slate-500">Must be unique. Convention: module:feature:action</p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Display Name</Label>
                                        <Input
                                            placeholder="e.g. Create New Surgery"
                                            value={newPermission.name}
                                            onChange={e => setNewPermission({ ...newPermission, name: e.target.value })}
                                            className="bg-slate-950 border-slate-700"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Module Category</Label>
                                        <div className="flex flex-wrap gap-2 mb-2 p-2 bg-slate-950 rounded-lg border border-slate-800 max-h-32 overflow-y-auto">
                                            {availableModules.map(mod => (
                                                <div
                                                    key={mod}
                                                    onClick={() => { setNewPermission({ ...newPermission, module: mod }); setIsCustomModule(false); }}
                                                    className={cn(
                                                        "cursor-pointer px-3 py-1.5 rounded-full text-xs font-medium transition-all border",
                                                        (newPermission.module === mod && !isCustomModule)
                                                            ? "border-cyan-500 bg-cyan-950 text-cyan-400"
                                                            : "border-slate-700 bg-slate-900 text-slate-400 hover:border-slate-600 hover:text-slate-300"
                                                    )}
                                                >
                                                    {mod}
                                                </div>
                                            ))}
                                            <div
                                                onClick={() => { setIsCustomModule(true); setNewPermission({ ...newPermission, module: '' }); }}
                                                className={cn(
                                                    "cursor-pointer px-3 py-1.5 rounded-full text-xs font-medium transition-all border flex items-center gap-1",
                                                    isCustomModule
                                                        ? "border-cyan-500 bg-cyan-950 text-cyan-400"
                                                        : "border-slate-700 bg-slate-900 text-slate-400 hover:border-slate-600"
                                                )}
                                            >
                                                <Plus className="h-3 w-3" /> Other
                                            </div>
                                        </div>

                                        {isCustomModule && (
                                            <Input
                                                placeholder="Enter Custom Module Name"
                                                value={newPermission.module}
                                                onChange={e => setNewPermission({ ...newPermission, module: e.target.value })}
                                                className="bg-slate-950 border-slate-700 animate-in fade-in slide-in-from-top-1"
                                                autoFocus
                                            />
                                        )}
                                    </div>

                                    <DialogFooter>
                                        <Button type="submit" disabled={submitting} className="w-full bg-cyan-600 hover:bg-cyan-500">
                                            {submitting ? <Loader2 className="animate-spin" /> : "Register Permission"}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </header>

                {/* Controls Section */}
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between sticky top-4 z-20 bg-slate-950/80 backdrop-blur-xl p-4 rounded-xl border border-white/5 shadow-2xl">
                    <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto no-scrollbar">
                        <Button
                            variant="ghost"
                            onClick={() => setSelectedModule('All')}
                            className={cn("rounded-full px-4", selectedModule === 'All' ? "bg-white text-slate-950 font-bold" : "text-slate-400 hover:text-white")}
                        >
                            All
                            <span className="ml-2 text-xs bg-slate-200/20 px-1.5 py-0.5 rounded-full">{permissions.length}</span>
                        </Button>
                        {Object.keys(moduleStats).sort().map(mod => (
                            <Button
                                key={mod}
                                variant="ghost"
                                onClick={() => setSelectedModule(mod)}
                                className={cn(
                                    "rounded-full px-4 whitespace-nowrap",
                                    selectedModule === mod
                                        ? "bg-slate-800 text-cyan-400 border border-cyan-500/30"
                                        : "text-slate-400 hover:text-white"
                                )}
                            >
                                {mod}
                                <span className="text-xs ml-2 opacity-50">{moduleStats[mod]}</span>
                            </Button>
                        ))}
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Search permissions..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 bg-slate-900/50 border-slate-700 focus:border-cyan-500/50 transition-all rounded-full h-9"
                            />
                        </div>
                        <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-800">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={cn("p-1.5 rounded-md transition-all", viewMode === 'grid' ? "bg-slate-700 text-white shadow" : "text-slate-500 hover:text-slate-300")}
                            >
                                <LayoutGrid className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={cn("p-1.5 rounded-md transition-all", viewMode === 'list' ? "bg-slate-700 text-white shadow" : "text-slate-500 hover:text-slate-300")}
                            >
                                <List className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content Grid */}
                {loading ? (
                    <div className="h-64 flex items-center justify-center">
                        <div className="flex flex-col items-center gap-4">
                            <Loader2 className="h-10 w-10 text-cyan-500 animate-spin" />
                            <p className="text-slate-500 animate-pulse">Scanning Security Matrix...</p>
                        </div>
                    </div>
                ) : (
                    <motion.div
                        layout
                        className={cn(
                            "grid gap-4 w-full",
                            viewMode === 'grid' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
                        )}
                    >
                        <AnimatePresence>
                            {filteredPermissions.map((perm) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                    key={perm.code}
                                    className="group relative overflow-hidden bg-slate-900/50 border border-slate-800 hover:border-slate-600 rounded-xl p-5 hover:shadow-2xl hover:shadow-cyan-900/10 transition-all duration-300"
                                >
                                    {/* Hover Glow Effect */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                                    <div className="relative z-10 flex flex-col h-full justify-between gap-4">
                                        <div className="flex justify-between items-start">
                                            <Badge variant="outline" className={cn("text-xs rounded-md px-2 py-0.5 border font-normal", MODULE_COLORS[perm.module] || MODULE_COLORS['Custom'])}>
                                                {perm.module}
                                            </Badge>

                                            {/* Delete Action */}
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDelete(perm.code)}
                                                className="h-6 w-6 text-slate-600 hover:text-red-400 hover:bg-red-950/30 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>

                                        <div className="space-y-1">
                                            <h3 className="font-semibold text-slate-200 group-hover:text-white truncate" title={perm.name}>
                                                {perm.name}
                                            </h3>
                                            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono bg-black/20 px-2 py-1 rounded w-fit max-w-full">
                                                <Lock className="h-3 w-3 flex-shrink-0" />
                                                <span className="truncate">{perm.code}</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}

                {!loading && filteredPermissions.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                        <Shield className="h-16 w-16 mb-4 opacity-20" />
                        <p className="text-lg">No permissions found matching your criteria.</p>
                        <Button variant="link" onClick={() => { setSearchQuery(''); setSelectedModule('All'); }}>Clear Filters</Button>
                    </div>
                )}
            </div>
        </div>
    )
}
