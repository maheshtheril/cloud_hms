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
        <div className="container mx-auto py-8 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Shield className="h-8 w-8" />
                        Roles & Permissions
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Manage access control and permissions • {roles.length} roles
                    </p>
                </div>
                <div className="flex gap-3">
                    <SeedRolesButton />
                    <Link href="/settings/permissions">
                        <Button variant="outline">
                            <Key className="h-4 w-4 mr-2" />
                            View Permissions
                        </Button>
                    </Link>
                    <CreateRoleDialog />
                </div>
            </div>

            {/* Stats */}
            <div className="grid gap-6 md:grid-cols-3">
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Roles</p>
                        <Shield className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="text-3xl font-bold">{roles.length}</div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Permissions</p>
                        <Key className="h-5 w-5 text-cyan-600" />
                    </div>
                    <div className="text-3xl font-bold">{totalPermissions}</div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Permissions</p>
                        <Plus className="h-5 w-5 text-pink-600" />
                    </div>
                    <div className="text-3xl font-bold">{avgPermissions}</div>
                </Card>
            </div>

            {/* Roles List */}
            <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Role Definitions
                </h2>

                {roles.length === 0 ? (
                    <div className="text-center py-12">
                        <Shield className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            No Roles Found
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Get started by seeding default roles or creating a custom role
                        </p>
                        <div className="flex gap-3 justify-center">
                            <SeedRolesButton />
                            <CreateRoleDialog />
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {roles.map((role) => (
                            <div
                                key={role.id}
                                className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-purple-500/30 transition-all"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                        <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white">
                                            {role.name}
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {role.key}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Badge variant="outline">
                                        {role.permissions?.length || 0} permissions
                                    </Badge>
                                    <RoleActions role={role} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Card>
        </div>
    );
}
