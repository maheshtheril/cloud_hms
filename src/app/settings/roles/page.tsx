import { getRoles } from "@/app/actions/role";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Shield } from "lucide-react";

export default async function RolesPage() {
    const result = await getRoles();

    if (result.error) {
        return (
            <div className="p-4">
                <div className="bg-red-50 text-red-600 p-4 rounded-md">
                    Error loading roles: {result.error}
                </div>
            </div>
        );
    }

    const roles = result.data || [];

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

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Defined Roles
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Role Name</TableHead>
                                <TableHead>Key</TableHead>
                                <TableHead>Permissions</TableHead>
                                <TableHead className="text-right">Permission Count</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {roles.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                        No roles found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                roles.map((role) => (
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
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
