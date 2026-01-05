'use client'

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Shield, Key, Search, Users, LayoutGrid, List } from "lucide-react"
import { RoleActions } from "@/components/settings/role-actions"
import { motion, AnimatePresence } from "framer-motion"

interface Role {
    id: string
    key: string
    name: string
    module: string
    description?: string | null
    userCount?: number
    permissions: string[]
}

interface RolesListProps {
    initialRoles: Role[]
}

export function RolesList({ initialRoles }: RolesListProps) {
    const [searchQuery, setSearchQuery] = useState("")
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

    // Filter roles based on search
    const filteredRoles = initialRoles.filter(role =>
        role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        role.module.toLowerCase().includes(searchQuery.toLowerCase())
    )

    // Group by Module
    const groupedRoles = filteredRoles.reduce((acc, role) => {
        const mod = (role.module || 'System').toUpperCase()
        if (!acc[mod]) acc[mod] = []
        acc[mod].push(role)
        return acc
    }, {} as Record<string, Role[]>)

    // Define Module Colors
    const getModuleColor = (mod: string) => {
        switch (mod) {
            case 'HMS': return 'from-indigo-500 to-cyan-600'
            case 'CRM': return 'from-orange-500 to-amber-600'
            case 'ACCOUNTS': return 'from-emerald-500 to-teal-600'
            case 'INVENTORY': return 'from-blue-500 to-indigo-600'
            case 'SYSTEM': return 'from-slate-600 to-slate-800'
            default: return 'from-violet-500 to-purple-600'
        }
    }

    const getModuleBadgeColor = (mod: string) => {
        switch (mod) {
            case 'HMS': return 'text-indigo-600 bg-indigo-50 border-indigo-200 dark:bg-indigo-900/30 dark:border-indigo-800 dark:text-indigo-300'
            case 'CRM': return 'text-orange-600 bg-orange-50 border-orange-200 dark:bg-orange-900/30 dark:border-orange-800 dark:text-orange-300'
            case 'ACCOUNTS': return 'text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-900/30 dark:border-emerald-800 dark:text-emerald-300'
            case 'INVENTORY': return 'text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-300'
            default: return 'text-slate-600 bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'
        }
    }

    return (
        <div className="space-y-8">
            {/* Toolbar */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white/40 dark:bg-slate-900/40 p-4 rounded-2xl border border-white/20 backdrop-blur-md shadow-sm">
                <div className="relative w-full md:w-96 group">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    <Input
                        placeholder="Search roles or modules..."
                        className="pl-10 bg-white/50 dark:bg-slate-900/50 border-white/20 focus:bg-white dark:focus:bg-slate-900 transition-all rounded-xl"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 bg-slate-100/50 dark:bg-slate-800/50 p-1 rounded-xl">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setViewMode('grid')}
                        className={`rounded-lg px-3 ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <LayoutGrid className="h-4 w-4 mr-2" />
                        Grid
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setViewMode('list')}
                        className={`rounded-lg px-3 ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <List className="h-4 w-4 mr-2" />
                        List
                    </Button>
                </div>
            </div>

            {/* Empty State */}
            {filteredRoles.length === 0 && (
                <div className="text-center py-20 bg-white/20 dark:bg-slate-900/20 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
                    <Search className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500 text-lg">No roles found matching "{searchQuery}"</p>
                    <Button variant="link" onClick={() => setSearchQuery("")} className="text-indigo-500 mt-2">
                        Clear filter
                    </Button>
                </div>
            )}

            {/* Modules Loop */}
            <div className="space-y-10">
                {Object.entries(groupedRoles).map(([moduleName, roles]) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={moduleName}
                        className="space-y-4"
                    >
                        <div className="flex items-center gap-3 px-2">
                            <Badge variant="outline" className={`px-4 py-1.5 text-sm font-bold tracking-widest shadow-sm backdrop-blur-sm ${getModuleBadgeColor(moduleName)}`}>
                                {moduleName}
                            </Badge>
                            <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">
                                {roles.length} Role{roles.length !== 1 ? 's' : ''}
                            </span>
                            <div className="h-px flex-1 bg-gradient-to-r from-indigo-500/10 via-slate-200/20 to-transparent dark:from-white/10" />
                        </div>

                        {viewMode === 'grid' ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                {roles.map((role) => (
                                    <div
                                        key={role.id}
                                        className="group relative bg-white/60 dark:bg-slate-900/60 p-6 rounded-2xl border border-white/20 dark:border-white/5 shadow-lg hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300 backdrop-blur-md overflow-hidden"
                                    >
                                        {/* Top Accent Line */}
                                        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${getModuleColor(moduleName)} opacity-0 group-hover:opacity-100 transition-opacity`} />

                                        <div className="flex items-start justify-between mb-4">
                                            <div className={`p-3 rounded-xl bg-gradient-to-br ${getModuleColor(moduleName)} shadow-lg`}>
                                                <Shield className="h-6 w-6 text-white" />
                                            </div>
                                            <RoleActions role={role} />
                                        </div>

                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                            {role.name}
                                        </h3>

                                        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 h-10 mb-6 font-medium leading-relaxed">
                                            {role.description || "No description provided for this role."}
                                        </p>

                                        <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4 mt-auto">
                                            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full">
                                                <Key className="h-3 w-3" />
                                                {role.permissions.length} Perms
                                            </div>
                                            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 rounded-full">
                                                <Users className="h-3 w-3" />
                                                {role.userCount || 0} Users
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {roles.map((role) => (
                                    <div
                                        key={role.id}
                                        className="flex items-center justify-between p-4 bg-white/60 dark:bg-slate-900/60 rounded-xl border border-white/20 dark:border-white/5 hover:border-indigo-500/30 transition-all hover:shadow-lg group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`p-2.5 rounded-lg bg-gradient-to-br ${getModuleColor(moduleName)} shadow-md`}>
                                                <Shield className="h-5 w-5 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-900 dark:text-white">{role.name}</h3>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                                        <Key className="h-3 w-3" /> {role.permissions.length} Permissions
                                                    </span>
                                                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                                                    <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                                        <Users className="h-3 w-3" /> {role.userCount || 0} Users assigned
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <RoleActions role={role} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
