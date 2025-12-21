import { getRoles } from "@/app/actions/role";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Shield, Key, AlertCircle, RefreshCw } from "lucide-react";
import Link from "next/link";
import { SeedRolesButton } from "@/components/settings/seed-roles-button";
import { CreateRoleDialog } from "@/components/settings/create-role-dialog";
import { RoleActions } from "@/components/settings/role-actions";
import { Toaster } from "@/components/ui/toaster";

export default async function RolesPage() {
    const result = await getRoles();

    if (result.error) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Roles & Permissions</h1>
                        <p className="text-muted-foreground">
                            Manage roles and access control for your organization.
                        </p>
                    </div>
                </div>

                <Card className="border-red-200 bg-red-50">
                    <CardContent className="pt-6">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                            <div className="flex-1">
                                <h3 className="font-semibold text-red-900">Error Loading Roles</h3>
                                <p className="text-sm text-red-700 mt-1">{result.error}</p>
                                {result.error.includes('tenant ID') && (
                                    <p className="text-sm text-red-600 mt-2">
                                        This usually happens when your session is missing tenant information.
                                        Please try logging out and logging back in.
                                    </p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex gap-3">
                    <Button asChild variant="outline">
                        <Link href="/api/auth/signout">
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Sign Out & Re-login
                        </Link>
                    </Button>
                </div>
            </div>
        );
    }

    const roles = result.data || [];
    const totalPermissions = roles.reduce((sum, role) => sum + role.permissions.length, 0);
    const avgPermissionsPerRole = roles.length > 0 ? Math.round(totalPermissions / roles.length) : 0;

    return (
        <div className="space-y-6">
            <Toaster />

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Roles & Permissions</h1>
                    <p className="text-muted-foreground">
                        Manage roles and access control for your organization.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button asChild variant="outline">
                        <Link href="/settings/permissions">
                            <Key className="h-4 w-4 mr-2" />
                            View Permissions
                        </Link>
                    </Button>
                    <SeedRolesButton />
                    <CreateRoleDialog />
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Roles</CardTitle>
                        <Shield className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{roles.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Permissions</CardTitle>
                        <Key className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalPermissions}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg Permissions/Role</CardTitle>
                        <Key className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{avgPermissionsPerRole}</div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Defined Roles
                        <Badge variant="secondary" className="ml-auto">
                            {roles.length} {roles.length === 1 ? 'role' : 'roles'}
                        </Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {roles.length === 0 ? (
                        <div className="text-center py-12">
                            <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No Roles Found</h3>
                            <p className="text-muted-foreground mb-4">
                                Get started by creating default roles or defining custom roles for your organization
                            </p>
                            <div className="flex gap-3 justify-center">
                                <SeedRolesButton />
                                <CreateRoleDialog />
                            </div>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Role Name</TableHead>
                                    <TableHead>Key</TableHead>
                                    <TableHead>Permissions</TableHead>
                                    <TableHead className="text-right">Custom Permissions</TableHead>
                                    <TableHead className="w-[80px]">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {roles.map((role) => (
                                    <TableRow key={role.id}>
                                        <TableCell className="font-medium">
                                            {role.name}
                                        </TableCell>
                                        <TableCell>
                                            <code className="bg-muted px-2 py-1 rounded text-sm font-mono">
                                                {role.key}
                                            </code>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1">
                                                {role.permissions.slice(0, 3).map((p) => (
                                                    <Badge key={p} variant="outline" className="text-xs">
                                                        {p}
                                                    </Badge>
                                                ))}
                                                {role.permissions.length > 3 && (
                                                    <Badge variant="outline" className="text-xs">
                                                        +{role.permissions.length - 3} more
                                                    </Badge>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {role._count.role_permission > 0 ? (
                                                <Badge variant="secondary">
                                                    {role._count.role_permission} Custom
                                                </Badge>
                                            ) : (
                                                <span className="text-muted-foreground text-sm">
                                                    Standard
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <RoleActions role={role} />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
