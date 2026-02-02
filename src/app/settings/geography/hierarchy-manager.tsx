'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronDown, MapPin, Globe, Building2, Search, Filter, Layers, ListTree, CheckCircle2 } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Toggle } from '@/components/ui/toggle'
import { Separator } from '@/components/ui/separator'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { toggleSubdivisionStatus, AdministrativeUnit } from '@/app/actions/geography'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

// ---- Types & Helpers ----

interface HierarchyNodeProps {
    node: AdministrativeUnit
    level: number
    onToggle: (id: string, status: boolean) => void
    searchTerm: string
    expandAll: boolean
}

// Helper to count active statistics recursively
const getStats = (node: AdministrativeUnit) => {
    let total = 0
    let active = 0
    if (node.children) {
        total = node.children.length
        active = node.children.filter(c => c.is_active).length
    }
    return { total, active }
}

function HierarchyNode({ node, level, onToggle, searchTerm, expandAll }: HierarchyNodeProps) {
    const [isOpen, setIsOpen] = useState(expandAll)
    const [isUpdating, setIsUpdating] = useState(false)
    const hasChildren = node.children && node.children.length > 0
    const { total, active } = getStats(node)

    // Sync local open state with global expandAll when it changes
    useMemo(() => {
        setIsOpen(expandAll)
    }, [expandAll])

    // Auto-expand if search matches children
    useMemo(() => {
        if (searchTerm && hasChildren) setIsOpen(true)
    }, [searchTerm, hasChildren])

    const handleStatusChange = async (checked: boolean) => {
        setIsUpdating(true)
        // Optimistic UI update handled by parent provided function or we can just trigger the server action
        // For 'World Class' feel, we should use optimistic updates, but for now we'll stick to simple toast flow
        try {
            await onToggle(node.id, checked)
        } finally {
            setIsUpdating(false)
        }
    }

    // Highlight text logic
    const displayName = useMemo(() => {
        if (!searchTerm) return node.name
        const parts = node.name.split(new RegExp(`(${searchTerm})`, 'gi'))
        return (
            <span>
                {parts.map((part, i) =>
                    part.toLowerCase() === searchTerm.toLowerCase()
                        ? <span key={i} className="bg-yellow-200 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200 rounded-[2px] px-0.5">{part}</span>
                        : part
                )}
            </span>
        )
    }, [node.name, searchTerm])

    return (
        <div className="relative">
            {/* Tree Connection Line (Vertical) */}
            {level > 0 && (
                <div
                    className="absolute left-[-1.25rem] top-0 bottom-0 w-px bg-slate-200 dark:bg-slate-800"
                    style={{ height: hasChildren && isOpen ? '100%' : '2rem' }}
                />
            )}
            {/* Tree Connection Line (Horizontal curve) */}
            {level > 0 && (
                <div className="absolute left-[-1.25rem] top-[1.5rem] w-4 h-px bg-slate-200 dark:bg-slate-800" />
            )}

            <div
                className={cn(
                    "group flex items-center gap-3 p-3 rounded-xl border mb-2 transition-all duration-200",
                    node.is_active
                        ? "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md"
                        : "bg-slate-50/50 dark:bg-slate-900/20 border-transparent opacity-80 hover:opacity-100"
                )}
            >
                {/* Expander Arrow */}
                <div
                    className={cn(
                        "p-1.5 rounded-lg transition-colors duration-200",
                        hasChildren
                            ? "cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-indigo-600"
                            : "opacity-0 pointer-events-none"
                    )}
                    onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen) }}
                >
                    {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </div>

                {/* Icon & Type */}
                <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold uppercase shrink-0 transition-colors",
                    node.is_active
                        ? level === 0 ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300"
                            : level === 1 ? "bg-teal-100 text-teal-700 dark:bg-teal-500/20 dark:text-teal-300"
                                : "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300"
                        : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-500"
                )}>
                    {node.type.substring(0, 2)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                        <h4 className={cn(
                            "font-bold text-sm truncate",
                            node.is_active ? "text-slate-900 dark:text-white" : "text-slate-500 decoration-slate-400"
                        )}>
                            {displayName}
                        </h4>
                        {node.code && <Badge variant="outline" className="text-[10px] h-5 px-1.5 text-slate-500 bg-slate-50 dark:bg-slate-950">{node.code}</Badge>}
                    </div>

                    {/* Metrics Row */}
                    <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                        <span className="uppercase tracking-wider text-[10px]">{node.type}</span>
                        {hasChildren && (
                            <>
                                <span className="w-1 h-1 rounded-full bg-slate-300" />
                                <span className={cn(active === total ? "text-emerald-600" : "text-slate-500")}>
                                    {active}/{total} Active Regions
                                </span>
                            </>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4 pl-4 border-l border-slate-100 dark:border-slate-800">
                    <div className="flex flex-col items-end gap-0.5">
                        <span className={cn(
                            "text-[10px] font-bold uppercase tracking-wider",
                            node.is_active ? "text-emerald-600" : "text-slate-400"
                        )}>
                            {node.is_active ? 'Active' : 'Inactive'}
                        </span>
                    </div>
                    <Switch
                        checked={node.is_active}
                        onCheckedChange={handleStatusChange}
                        disabled={isUpdating}
                        className="data-[state=checked]:bg-emerald-500"
                    />
                </div>
            </div>

            {/* Recursive Children */}
            <AnimatePresence initial={false}>
                {isOpen && hasChildren && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="pl-8"
                    >
                        {node.children!.map(child => (
                            <HierarchyNode
                                key={child.id}
                                node={child}
                                level={level + 1}
                                onToggle={onToggle}
                                searchTerm={searchTerm}
                                expandAll={expandAll}
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export function HierarchyManager({
    country,
    hierarchy
}: {
    country: any,
    hierarchy: AdministrativeUnit[]
}) {
    const [searchTerm, setSearchTerm] = useState('')
    const [expandAll, setExpandAll] = useState(false)
    const [showActiveOnly, setShowActiveOnly] = useState(false)
    const [viewData, setViewData] = useState(hierarchy) // Local state for optimistic updates

    // --- Search & Filter Logic ---
    const displayedHierarchy = useMemo(() => {
        let nodes = viewData

        // 1. Filter by Active Status
        if (showActiveOnly) {
            const filterActive = (n: AdministrativeUnit): AdministrativeUnit | null => {
                if (n.is_active) {
                    const children = n.children ? n.children.map(filterActive).filter(Boolean) as AdministrativeUnit[] : []
                    return { ...n, children }
                }
                // Keep parent if it has active children even if inactive itself? Usually no, strict filtering.
                // But for hierarchy, context matters. Let's strict filter Top-Down.
                return null
            }
            nodes = nodes.map(filterActive).filter(Boolean) as AdministrativeUnit[]
        }

        // 2. Filter by Search
        if (searchTerm) {
            const filterSearch = (n: AdministrativeUnit): AdministrativeUnit | null => {
                const matchesName = n.name.toLowerCase().includes(searchTerm.toLowerCase())
                const children = n.children ? n.children.map(filterSearch).filter(Boolean) as AdministrativeUnit[] : []

                if (matchesName || children.length > 0) {
                    return { ...n, children }
                }
                return null
            }
            nodes = nodes.map(filterSearch).filter(Boolean) as AdministrativeUnit[]
        }

        return nodes
    }, [viewData, searchTerm, showActiveOnly])


    // ---- Handlers ----

    const handleToggle = async (id: string, status: boolean) => {
        // 1. Optimistic Update (Recursive)
        const updateRecursive = (nodes: AdministrativeUnit[]): AdministrativeUnit[] => {
            return nodes.map(node => {
                if (node.id === id) {
                    // Update this node AND all children
                    const updateChildren = (children: AdministrativeUnit[] = []): AdministrativeUnit[] => {
                        return children.map(c => ({
                            ...c,
                            is_active: status,
                            children: updateChildren(c.children)
                        }))
                    }
                    return { ...node, is_active: status, children: updateChildren(node.children) }
                }
                if (node.children) {
                    return { ...node, children: updateRecursive(node.children) }
                }
                return node
            })
        }

        setViewData(prev => updateRecursive(prev))

        // 2. Server Action
        const result = await toggleSubdivisionStatus(id, status, true)

        if (result.success) {
            toast.success("Region status updated")
        } else {
            // Revert on failure (reload page or undo state, for now simple reload warning)
            toast.error("Failed to sync with server")
        }
    }


    // ---- Metrics ----
    const totalRegions = useMemo(() => {
        const count = (nodes: AdministrativeUnit[]): number =>
            nodes.reduce((acc, n) => acc + 1 + (n.children ? count(n.children) : 0), 0)
        return count(viewData)
    }, [viewData])

    const activeRegions = useMemo(() => {
        const count = (nodes: AdministrativeUnit[]): number =>
            nodes.reduce((acc, n) => acc + (n.is_active ? 1 : 0) + (n.children ? count(n.children) : 0), 0)
        return count(viewData)
    }, [viewData])


    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header Card */}
            <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-32 bg-indigo-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-10">
                    <div className="flex items-start gap-5">
                        <div className="text-5xl shadow-sm rounded-xl overflow-hidden border bg-slate-50 flex items-center justify-center w-20 h-14 shrink-0">
                            {country.flag || <Globe className="w-8 h-8 text-slate-400" />}
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                                    {country.name}
                                </h2>
                                <Badge className="bg-indigo-600 hover:bg-indigo-700">HQ</Badge>
                            </div>
                            <p className="text-slate-500 font-medium mb-3">Master Geography Configuration</p>

                            <div className="flex items-center gap-4 text-xs font-semibold text-slate-600 dark:text-slate-400">
                                <div className="flex items-center gap-1.5">
                                    <MapPin className="w-3.5 h-3.5" />
                                    {totalRegions} Regions
                                </div>
                                <div className="w-px h-3 bg-slate-300 dark:bg-slate-700" />
                                <div className="flex items-center gap-1.5 text-emerald-600">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    {activeRegions} Active
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Toolbar */}
                    <div className="flex flex-col gap-3 w-full md:w-auto">
                        <div className="relative w-full md:w-80">
                            <input
                                type="text"
                                placeholder="Search states, districts..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full h-11 pl-11 pr-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                            />
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                <Search className="w-4 h-4" />
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Toggle
                                pressed={showActiveOnly}
                                onPressedChange={setShowActiveOnly}
                                className="h-9 px-3 gap-2 data-[state=on]:bg-indigo-100 data-[state=on]:text-indigo-700 border border-slate-200"
                                variant="outline"
                            >
                                <Filter className="w-3.5 h-3.5" />
                                <span className="text-xs font-semibold">Active Only</span>
                            </Toggle>

                            <Separator orientation="vertical" className="h-6" />

                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-9 gap-2 text-slate-500"
                                onClick={() => setExpandAll(!expandAll)}
                            >
                                <ListTree className="w-3.5 h-3.5" />
                                <span className="text-xs">{expandAll ? 'Collapse All' : 'Expand All'}</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="min-h-[500px]">
                {displayedHierarchy.length > 0 ? (
                    <div className="space-y-4">
                        {displayedHierarchy.map(node => (
                            <HierarchyNode
                                key={node.id}
                                node={node}
                                level={0}
                                onToggle={handleToggle}
                                searchTerm={searchTerm}
                                expandAll={expandAll}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-32 bg-slate-50/50 dark:bg-slate-900/20 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                        <div className="bg-white dark:bg-slate-900 p-4 rounded-full inline-flex mb-4 shadow-sm">
                            <Building2 className="w-8 h-8 text-slate-300" />
                        </div>
                        <h3 className="text-slate-900 font-semibold mb-1">No matching regions found</h3>
                        <p className="text-slate-500 text-sm">Try adjusting your search filters</p>
                    </div>
                )}
            </div>

            <div className="flex justify-center py-8">
                <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">End of Hierarchy</p>
            </div>
        </div>
    )
}
