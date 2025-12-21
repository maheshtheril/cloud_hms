import { getRoles } from "@/app/actions/role";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Shield, Key, AlertCircle, RefreshCw, Sparkles, Zap, Crown } from "lucide-react";
import Link from "next/link";
import { SeedRolesButton } from "@/components/settings/seed-roles-button";
import { CreateRoleDialog } from "@/components/settings/create-role-dialog";
import { RoleActions } from "@/components/settings/role-actions";

export default async function RolesPage() {
    const result = await getRoles();

    if (result.error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 p-8">
                <div className="max-w-7xl mx-auto space-y-6">
                    <div className="relative overflow-hidden rounded-3xl border border-red-500/20 bg-gradient-to-br from-red-950/50 to-red-900/30 backdrop-blur-xl p-8 shadow-2xl">
                        <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent" />
                        <div className="relative flex items-start gap-4">
                            <div className="p-3 rounded-xl bg-red-500/20 backdrop-blur-sm">
                                <AlertCircle className="h-8 w-8 text-red-400" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold text-red-100 mb-2">Error Loading Roles</h3>
                                <p className="text-red-200/80 text-lg">{result.error}</p>
                                {result.error.includes('tenant ID') && (
                                    <p className="text-red-300/60 mt-3">
                                        This usually happens when your session is missing tenant information.
                                        Please try logging out and logging back in.
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="mt-6">
                            <Button asChild className="bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/50">
                                <Link href="/api/auth/signout">
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    Sign Out & Re-login
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const roles = result.data || [];
    const totalPermissions = roles.reduce((sum, role) => sum + role.permissions.length, 0);
    const avgPermissionsPerRole = roles.length > 0 ? Math.round(totalPermissions / roles.length) : 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
            <Toaster />

            {/* Animated Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
                <div className="absolute top-0 -right-4 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
            </div>

            <div className="relative max-w-7xl mx-auto p-8 space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 backdrop-blur-sm border border-purple-500/30">
                                <Shield className="h-8 w-8 text-cyan-400" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                                    Roles & Permissions
                                </h1>
                                <p className="text-slate-400 text-lg mt-1">
                                    Advanced access control management
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Button asChild variant="outline" className="border-cyan-500/30 bg-cyan-950/20 hover:bg-cyan-900/30 text-cyan-300 backdrop-blur-sm shadow-lg shadow-cyan-500/10">
                            <Link href="/settings/permissions">
                                <Key className="h-4 w-4 mr-2" />
                                Permission Registry
                            </Link>
                        </Button>
                        <SeedRolesButton />
                        <CreateRoleDialog />
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-6 md:grid-cols-3">
                    <Card className="relative group overflow-hidden border border-purple-500/20 bg-gradient-to-br from-purple-950/50 to-slate-950/50 backdrop-blur-xl hover:border-purple-500/40 transition-all duration-300 shadow-xl hover:shadow-purple-500/20">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative p-6">
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-sm font-medium text-purple-300">Total Roles</p>
                                <Crown className="h-5 w-5 text-purple-400" />
                            </div>
                            <div className="text-4xl font-bold text-white mb-1">{roles.length}</div>
                            <p className="text-xs text-purple-300/60">Active role definitions</p>
                        </div>
                    </Card>

                    <Card className="relative group overflow-hidden border border-cyan-500/20 bg-gradient-to-br from-cyan-950/50 to-slate-950/50 backdrop-blur-xl hover:border-cyan-500/40 transition-all duration-300 shadow-xl hover:shadow-cyan-500/20">
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative p-6">
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-sm font-medium text-cyan-300">Total Permissions</p>
                                <Key className="h-5 w-5 text-cyan-400" />
                            </div>
                            <div className="text-4xl font-bold text-white mb-1">{totalPermissions}</div>
                            <p className="text-xs text-cyan-300/60">Assigned permissions</p>
                        </div>
                    </Card>

                    <Card className="relative group overflow-hidden border border-pink-500/20 bg-gradient-to-br from-pink-950/50 to-slate-950/50 backdrop-blur-xl hover:border-pink-500/40 transition-all duration-300 shadow-xl hover:shadow-pink-500/20">
                        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative p-6">
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-sm font-medium text-pink-300">Average Permissions</p>
                                <Zap className="h-5 w-5 text-pink-400" />
                            </div>
                            <div className="text-4xl font-bold text-white mb-1">{avgPermissionsPerRole}</div>
                            <p className="text-xs text-pink-300/60">Per role</p>
                        </div>
                    </Card>
                </div>

                {/* Roles Table */}
                <Card className="relative overflow-hidden border border-slate-700/50 bg-gradient-to-br from-slate-900/80 to-slate-950/80 backdrop-blur-xl shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-cyan-500/5" />

                    <div className="relative p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <Sparkles className="h-6 w-6 text-cyan-400" />
                            <h2 className="text-2xl font-bold text-white">Role Definitions</h2>
                            <Badge variant="outline" className="ml-auto border-cyan-500/30 bg-cyan-950/20 text-cyan-300">
                                {roles.length} {roles.length === 1 ? 'role' : 'roles'}
                            </Badge>
                        </div>

                        {roles.length === 0 ? (
                            <div className="text-center py-16">
                                <div className="inline-block p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-cyan-500/10 backdrop-blur-sm border border-purple-500/20 mb-6">
                                    <Shield className="h-16 w-16 text-purple-400 mx-auto" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-3">No Roles Defined Yet</h3>
                                <p className="text-slate-400 mb-6 text-lg max-w-md mx-auto">
                                    Start by seeding default roles or create custom roles tailored to your organization
                                </p>
                                <div className="flex gap-4 justify-center">
                                    <SeedRolesButton />
                                    <CreateRoleDialog />
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {roles.map((role, index) => (
                                    <div
                                        key={role.id}
                                        className="group relative overflow-hidden rounded-xl border border-slate-700/50 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm hover:border-purple-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10"
                                        style={{ animationDelay: `${index * 50}ms` }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                                        <div className="relative p-6 flex items-center gap-6">
                                            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 backdrop-blur-sm border border-purple-500/30">
                                                <Shield className="h-6 w-6 text-purple-400" />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-lg font-semibold text-white mb-1">{role.name}</h3>
                                                <code className="text-sm text-slate-400 font-mono bg-slate-950/50 px-3 py-1 rounded-lg">
                                                    {role.key}
                                                </code>
                                            </div>

                                            <div className="flex items-center gap-4">
                                                <div className="flex flex-wrap gap-2 max-w-md">
                                                    {role.permissions.slice(0, 3).map((p) => (
                                                        <Badge key={p} className="bg-purple-950/50 text-purple-300 border-purple-500/30">
                                                            {p}
                                                        </Badge>
                                                    ))}
                                                    {role.permissions.length > 3 && (
                                                        <Badge className="bg-cyan-950/50 text-cyan-300 border-cyan-500/30">
                                                            +{role.permissions.length - 3} more
                                                        </Badge>
                                                    )}
                                                </div>

                                                <div className="text-right min-w-[120px]">
                                                    {role._count.role_permission > 0 ? (
                                                        <Badge className="bg-pink-950/50 text-pink-300 border-pink-500/30">
                                                            {role._count.role_permission} Custom
                                                        </Badge>
                                                    ) : (
                                                        <span className="text-sm text-slate-500">
                                                            Standard
                                                        </span>
                                                    )}
                                                </div>

                                                <RoleActions role={role} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </Card>
            </div>

            <style jsx global>{`
                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>
        </div>
    );
}
