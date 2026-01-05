import { getRoles } from "@/app/actions/role";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Shield, Key, Plus } from "lucide-react";
import Link from "next/link";
import { SeedRolesButton } from "@/components/settings/seed-roles-button";
import { CreateRoleDialog } from "@/components/settings/create-role-dialog";
import { RoleActions } from "@/components/settings/role-actions";

export default async function RolesPage() {
    const result = await getRoles();

    if (result.error) {
        return (
            <div className="p-8">
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-2">Error Loading Roles</h2>
                    <p className="text-red-700 dark:text-red-300">{result.error}</p>
                </div>
            </div>
        );
    }

    const roles = result.data || [];
    const totalPermissions = roles.reduce((sum, role) => sum + (role.permissions?.length || 0), 0);
    const avgPermissions = roles.length > 0 ? Math.round(totalPermissions / roles.length) : 0;

    return (
        <div className="min-h-screen bg-futuristic">
            {/* Animated Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 -left-4 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
                <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
            </div>

            <div className="relative container mx-auto py-8 space-y-8 max-w-7xl">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-gradient-primary flex items-center gap-3 tracking-tighter">
                            <Shield className="h-10 w-10 text-indigo-600" />
                            Roles & Permissions
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg font-medium">
                            Manage access control and permissions • <span className="text-slate-900 dark:text-white font-bold">{roles.length} roles active</span>
                        </p>
                    </div>
                    <div className="flex gap-3">
                        {roles.length === 0 && <SeedRolesButton />}
                        <Link href="/settings/permissions">
                            <Button variant="outline" className="bg-white/40 border-slate-200/50 hover:bg-white text-slate-700 dark:text-slate-200 dark:bg-slate-900/40 dark:hover:bg-slate-900 backdrop-blur-md">
                                <Key className="h-4 w-4 mr-2" />
                                View Permissions
                            </Button>
                        </Link>
                        <CreateRoleDialog />
                    </div>
                </div>

                {/* Stats */}
                <div className="grid gap-6 md:grid-cols-3">
                    <div className="glass-card bg-white/40 dark:bg-slate-900/40 p-6 rounded-2xl border border-white/20 shadow-xl backdrop-blur-md relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Shield className="h-16 w-16 text-indigo-500" />
                        </div>
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Total Roles</p>
                            <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-600">
                                <Shield className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="text-4xl font-black text-slate-900 dark:text-white">{roles.length}</div>
                    </div>

                    <div className="glass-card bg-white/40 dark:bg-slate-900/40 p-6 rounded-2xl border border-white/20 shadow-xl backdrop-blur-md relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Key className="h-16 w-16 text-cyan-500" />
                        </div>
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest">Total Permissions</p>
                            <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-600">
                                <Key className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="text-4xl font-black text-slate-900 dark:text-white">{totalPermissions}</div>
                    </div>

                    <div className="glass-card bg-white/40 dark:bg-slate-900/40 p-6 rounded-2xl border border-white/20 shadow-xl backdrop-blur-md relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Plus className="h-16 w-16 text-pink-500" />
                        </div>
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-xs font-bold text-pink-600 dark:text-pink-400 uppercase tracking-widest">Avg Permissions</p>
                            <div className="p-2 bg-pink-500/10 rounded-lg text-pink-600">
                                <Plus className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="text-4xl font-black text-slate-900 dark:text-white">{avgPermissions}</div>
                    </div>
                </div>

                {/* Roles List */}
                <div className="glass-card bg-white/40 dark:bg-slate-900/40 p-1 rounded-3xl border border-white/20 shadow-2xl backdrop-blur-xl">
                    <div className="p-6 border-b border-white/10">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Shield className="h-5 w-5 text-indigo-500" />
                            Role Definitions
                        </h2>
                    </div>

                    <div className="p-6">
                        {roles.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Shield className="h-10 w-10 text-slate-400" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                                    No Roles Found
                                </h3>
                                <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm mx-auto">
                                    Get started by seeding default roles or creating a custom role to manage system access.
                                </p>
                                <div className="flex gap-4 justify-center">
                                    <SeedRolesButton />
                                    <CreateRoleDialog />
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-8">
                                {Object.entries(roles.reduce((acc: any, role: any) => {
                                    const mod = (role.module || 'System').toUpperCase();
                                    if (!acc[mod]) acc[mod] = [];
                                    acc[mod].push(role);
                                    return acc;
                                }, {})).map(([moduleName, moduleRoles]: [string, any]) => (
                                    <div key={moduleName} className="space-y-3">
                                        <div className="flex items-center gap-2 px-2">
                                            <Badge variant="outline" className="bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-800 dark:text-indigo-300 px-3 py-1 font-bold tracking-widest text-xs">
                                                {moduleName}
                                            </Badge>
                                            <div className="h-px flex-1 bg-gradient-to-r from-indigo-200/50 to-transparent dark:from-indigo-800/50" />
                                        </div>

                                        <div className="grid gap-3">
                                            {moduleRoles.map((role: any) => (
                                                <div
                                                    key={role.id}
                                                    className="flex flex-col md:flex-row md:items-center justify-between p-5 bg-white/60 dark:bg-slate-900/60 border border-white/20 dark:border-white/5 rounded-2xl hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300 group"
                                                >
                                                    <div className="flex items-center gap-5">
                                                        <div className={`p-3 rounded-xl shadow-lg shrink-0 ${moduleName === 'HMS' ? 'bg-gradient-to-br from-indigo-500 to-cyan-600' :
                                                                moduleName === 'CRM' ? 'bg-gradient-to-br from-orange-500 to-amber-600' :
                                                                    moduleName === 'ACCOUNTS' ? 'bg-gradient-to-br from-emerald-500 to-teal-600' :
                                                                        moduleName === 'INVENTORY' ? 'bg-gradient-to-br from-blue-500 to-indigo-600' :
                                                                            'bg-gradient-to-br from-slate-500 to-slate-600'
                                                            }`}>
                                                            <Shield className="h-6 w-6 text-white" />
                                                        </div>
                                                        <div>
                                                            <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                                                {role.name}
                                                            </h3>
                                                            {role.description && (
                                                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md">
                                                                    {role.description}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-6 mt-4 md:mt-0 pl-16 md:pl-0">
                                                        <div className="flex items-center gap-2">
                                                            <div className={`h-2 w-2 rounded-full animate-pulse ${role.permissions?.length > 0 ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                                                            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                                                                <span className="font-bold text-slate-900 dark:text-white">{role.permissions?.length || 0}</span> capabilities
                                                            </span>
                                                        </div>
                                                        <RoleActions role={role} />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
