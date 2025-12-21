import { getAllPermissions } from "@/app/actions/rbac";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Shield, Key, Lock } from "lucide-react";

export default async function PermissionsPage() {
    const result = await getAllPermissions();

    if ('error' in result) {
        return (
            <div className="p-4">
                <div className="bg-red-50 text-red-600 p-4 rounded-md">
                    Error loading permissions: {result.error}
                </div>
            </div>
        );
    }

    const permissions = result.data || [];

    // Group permissions by module
    const permissionsByModule = permissions.reduce((acc, perm) => {
        if (!acc[perm.module]) {
            acc[perm.module] = [];
        }
        acc[perm.module].push(perm);
        return acc;
    }, {} as Record<string, typeof permissions>);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Permission Registry</h1>
                    <p className="text-muted-foreground">
                        View all system permissions and their modules
                    </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Key className="h-4 w-4" />
                    <span>{permissions.length} Total Permissions</span>
                </div>
            </div>

            <div className="grid gap-6">
                {Object.entries(permissionsByModule).map(([module, perms]) => (
                    <Card key={module}>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="h-5 w-5 text-blue-600" />
                                {module}
                                <Badge variant="secondary" className="ml-auto">
                                    {perms.length} permissions
                                </Badge>
                            </CardTitle>
                            <CardDescription>
                                Permissions available in the {module} module
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Permission Code</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead className="text-right">Type</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {perms.map((perm) => {
                                        const [, action] = perm.code.split(':');
                                        const isAdmin = action === 'admin';
                                        const isWrite = ['create', 'edit', 'delete', 'manage'].includes(action);

                                        return (
                                            <TableRow key={perm.code}>
                                                <TableCell>
                                                    <code className="bg-muted px-2 py-1 rounded text-sm font-mono">
                                                        {perm.code}
                                                    </code>
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    {perm.name}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {isAdmin ? (
                                                        <Badge variant="destructive" className="gap-1">
                                                            <Lock className="h-3 w-3" />
                                                            Admin
                                                        </Badge>
                                                    ) : isWrite ? (
                                                        <Badge variant="default" className="bg-orange-500">
                                                            Write
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="outline">
                                                            Read
                                                        </Badge>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
