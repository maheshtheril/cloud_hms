import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getUserPermissions } from "@/app/actions/rbac";
import { getMenuItems } from "@/app/actions/navigation";

export default async function DebugPage() {
    const session = await auth();
    if (!session?.user) return <div>Not Logged In</div>;

    const permissions = await getUserPermissions(session.user.id);

    // Fetch Menu Items directly to see raw data
    const rawMenus = await prisma.menu_items.findMany({
        where: { module_key: 'hms' },
        select: { key: true, module_key: true, permission_code: true }
    });

    const sidebar = await getMenuItems();

    const tenantModules = await prisma.tenant_module.findMany({
        where: { tenant_id: session.user.tenantId, enabled: true }
    });

    return (
        <div className="p-10 font-mono text-sm">
            <h1 className="text-2xl font-bold mb-4">Permissions Debugger</h1>

            <div className="grid grid-cols-2 gap-8">
                <div className="border p-4">
                    <h2 className="font-bold text-blue-600">User Info</h2>
                    <pre>{JSON.stringify({
                        email: session.user.email,
                        role: session.user.role,
                        tenantId: session.user.tenantId
                    }, null, 2)}</pre>

                    <h2 className="font-bold text-blue-600 mt-4">Active Tenant Modules</h2>
                    <pre>{JSON.stringify(tenantModules.map(m => m.module_key), null, 2)}</pre>
                </div>

                <div className="border p-4">
                    <h2 className="font-bold text-green-600">Effective Permissions (Computed)</h2>
                    <div className="h-64 overflow-auto border bg-gray-50 p-2">
                        {permissions.map(p => <div key={p}>{p}</div>)}
                    </div>
                </div>
            </div>

            <div className="mt-8 border p-4">
                <h2 className="font-bold text-purple-600">Sidebar Result (getMenuItems)</h2>
                <pre>{JSON.stringify(sidebar.map((g: any) => ({
                    module: g.module?.name,
                    itemCount: g.items.length,
                    items: g.items.map((i: any) => `${i.label} [${i.key}]`)
                })), null, 2)}</pre>
            </div>

            <div className="mt-8 border p-4">
                <h2 className="font-bold text-red-600">Raw HMS Menu Items (DB Check)</h2>
                <div className="h-64 overflow-auto">
                    <table className="w-full text-left">
                        <thead><tr><th>Key</th><th>Module</th><th>Permission Req</th><th>You Have It?</th></tr></thead>
                        <tbody>
                            {rawMenus.map(m => {
                                const hasIt = !m.permission_code || permissions.includes(m.permission_code) || permissions.includes('*');
                                return (
                                    <tr key={m.key} className={hasIt ? "bg-green-100" : "bg-red-100"}>
                                        <td>{m.key}</td>
                                        <td>{m.module_key}</td>
                                        <td>{m.permission_code || 'NULL'}</td>
                                        <td>{hasIt ? 'YES' : 'NO'}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
