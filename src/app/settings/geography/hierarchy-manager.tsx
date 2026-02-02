'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronDown, Check, X, MapPin, Globe, Building2 } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toggleSubdivisionStatus, AdministrativeUnit } from '@/app/actions/geography'
import { toast } from 'sonner'

interface HierarchyNodeProps {
    node: AdministrativeUnit
    level: number
}

function HierarchyNode({ node, level }: HierarchyNodeProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isActive, setIsActive] = useState(node.is_active)
    const [isUpdating, setIsUpdating] = useState(false)

    const hasChildren = node.children && node.children.length > 0

    const handleToggleStatus = async (checked: boolean) => {
        setIsActive(checked)
        setIsUpdating(true)
        const result = await toggleSubdivisionStatus(node.id, checked, true) // Defaulting to recursive update for ease
        setIsUpdating(false)

        if (result.success) {
            toast.success(`Updated status for ${node.name}`)
        } else {
            setIsActive(!checked) // Revert
            toast.error("Failed to update status")
        }
    }

    return (
        <div className="select-none">
            <div
                className={`
                    flex items-center gap-3 p-3 rounded-lg border mb-2 transition-all duration-200
                    ${isActive ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800' : 'bg-slate-50 dark:bg-slate-900/50 border-transparent opacity-75'}
                    hover:border-indigo-500/30 hover:shadow-sm
                `}
                style={{ marginLeft: `${level * 20}px` }}
            >
                <div
                    className={`p-1 rounded-md cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${!hasChildren ? 'opacity-0' : ''}`}
                    onClick={() => hasChildren && setIsOpen(!isOpen)}
                >
                    {isOpen ? <ChevronDown className="w-4 h-4 text-slate-500" /> : <ChevronRight className="w-4 h-4 text-slate-500" />}
                </div>

                <div className="flex-1 flex items-center gap-3">
                    <div className={`
                        w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold uppercase
                        ${level === 0 ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' :
                            level === 1 ? 'bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400' :
                                'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}
                    `}>
                        {node.type.substring(0, 2)}
                    </div>
                    <div>
                        <h4 className={`font-semibold text-sm ${isActive ? 'text-slate-900 dark:text-white' : 'text-slate-500 line-through decoration-slate-400'}`}>
                            {node.name}
                        </h4>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">{node.type}</span>
                            {node.code && <Badge variant="outline" className="text-[10px] h-4 px-1 py-0">{node.code}</Badge>}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className={`text-xs font-medium ${isActive ? 'text-emerald-600' : 'text-slate-400'}`}>
                            {isActive ? 'Active' : 'Archived'}
                        </span>
                        <Switch
                            checked={isActive}
                            onCheckedChange={handleToggleStatus}
                            disabled={isUpdating}
                            className="data-[state=checked]:bg-emerald-500"
                        />
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isOpen && hasChildren && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                    >
                        {node.children!.map(child => (
                            <HierarchyNode key={child.id} node={child} level={level + 1} />
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

    // Basic filtering (Search matches name or children match name)
    const filterNodes = (nodes: AdministrativeUnit[]): AdministrativeUnit[] => {
        if (!searchTerm) return nodes
        return nodes.reduce((acc: AdministrativeUnit[], node) => {
            const matches = node.name.toLowerCase().includes(searchTerm.toLowerCase())
            const filteredChildren = node.children ? filterNodes(node.children) : []

            if (matches || filteredChildren.length > 0) {
                acc.push({ ...node, children: filteredChildren })
            }
            return acc
        }, [])
    }

    const displayedHierarchy = filterNodes(hierarchy)

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="text-4xl shadow-sm rounded-lg overflow-hidden border">
                            {country.flag ?
                                <span className="flex items-center justify-center w-12 h-9 bg-slate-100 text-2xl">{country.flag}</span> :
                                <Globe className="w-8 h-8 m-2 text-slate-400" />
                            }
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                {country.name}
                                <Badge className="bg-indigo-500 hover:bg-indigo-600">HQ</Badge>
                            </h2>
                            <p className="text-slate-500 text-sm font-medium">Administrative Structure Configuration</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative w-full md:w-64">
                            <input
                                type="text"
                                placeholder="Search regions..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full h-10 pl-4 pr-10 rounded-lg border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                                <MapPin className="w-4 h-4" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-slate-50/30 dark:bg-slate-900/10 min-h-[400px]">
                    {displayedHierarchy.length > 0 ? (
                        displayedHierarchy.map(node => (
                            <HierarchyNode key={node.id} node={node} level={0} />
                        ))
                    ) : (
                        <div className="text-center py-20">
                            <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                            <p className="text-slate-500 font-medium">No regions found matching your search</p>
                        </div>
                    )}
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 flex justify-between">
                    <span>Active Regions: {hierarchy.filter(h => h.is_active).length} Top Level</span>
                    <span>Total Nodes: {hierarchy.length}</span>
                </div>
            </div>
        </div>
    )
}
