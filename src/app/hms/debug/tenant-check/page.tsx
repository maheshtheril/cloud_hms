import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export default async function TenantDebugPage() {
    const session = await auth()

    if (!session?.user) {
        return <div className="p-8">Not authenticated</div>
    }

    const tenantId = session.user.tenantId
    const companyId = session.user.companyId

    // Get purchase orders for this tenant
    const myOrders = await prisma.hms_purchase_order.findMany({
        where: {
            tenant_id: tenantId!,
            company_id: companyId!
        },
        select: {
            id: true,
            name: true,
            tenant_id: true,
            company_id: true,
            created_at: true
        },
        orderBy: {
            created_at: 'desc'
        },
        take: 10
    })

    // Get ALL purchase orders (just count and tenant distribution)
    const allOrdersGrouped = await prisma.hms_purchase_order.groupBy({
        by: ['tenant_id'],
        _count: {
            id: true
        }
    })

    // Get tenant info
    const tenantInfo = await prisma.tenant.findUnique({
        where: { id: tenantId! },
        select: {
            id: true,
            name: true,
            created_at: true
        }
    })

    // Get all tenants for comparison
    const allTenants = await prisma.tenant.findMany({
        select: {
            id: true,
            name: true,
            created_at: true
        },
        orderBy: {
            created_at: 'desc'
        },
        take: 10
    })

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h1 className="text-2xl font-bold mb-4">🔍 Tenant Isolation Debug</h1>
                    <div className="space-y-2 text-sm font-mono">
                        <p><strong>Your User ID:</strong> {session.user.id}</p>
                        <p><strong>Your Email:</strong> {session.user.email}</p>
                        <p><strong>Your Tenant ID:</strong> <span className="bg-yellow-100 px-2 py-1 rounded">{tenantId}</span></p>
                        <p><strong>Your Company ID:</strong> {companyId}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-bold mb-4">Your Tenant Info</h2>
                    {tenantInfo ? (
                        <div className="text-sm">
                            <p><strong>Name:</strong> {tenantInfo.name}</p>
                            <p><strong>Created:</strong> {tenantInfo.created_at ? new Date(tenantInfo.created_at).toLocaleString() : 'N/A'}</p>
                        </div>
                    ) : (
                        <p className="text-red-600">⚠️ Tenant not found!</p>
                    )}
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-bold mb-4">Your Purchase Orders</h2>
                    <p className="text-sm mb-4">Found: <strong>{myOrders.length}</strong> orders</p>
                    {myOrders.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-4 py-2 text-left">Order #</th>
                                        <th className="px-4 py-2 text-left">Tenant ID</th>
                                        <th className="px-4 py-2 text-left">Company ID</th>
                                        <th className="px-4 py-2 text-left">Created</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {myOrders.map((order) => (
                                        <tr key={order.id} className="border-b">
                                            <td className="px-4 py-2 font-mono">{order.name}</td>
                                            <td className="px-4 py-2 font-mono">
                                                <span className={`px-2 py-1 rounded ${order.tenant_id === tenantId ? 'bg-green-100' : 'bg-red-100'}`}>
                                                    {order.tenant_id?.slice(0, 8)}...
                                                </span>
                                            </td>
                                            <td className="px-4 py-2 font-mono">{order.company_id?.slice(0, 8)}...</td>
                                            <td className="px-4 py-2">{new Date(order.created_at).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-gray-500">✓ Good! No orders found (expected for new tenant)</p>
                    )}
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-bold mb-4">All Purchase Orders by Tenant</h2>
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-2 text-left">Tenant ID</th>
                                <th className="px-4 py-2 text-left">Order Count</th>
                                <th className="px-4 py-2 text-left">Match?</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allOrdersGrouped.map((group) => (
                                <tr key={group.tenant_id} className="border-b">
                                    <td className="px-4 py-2 font-mono">{group.tenant_id.slice(0, 8)}...</td>
                                    <td className="px-4 py-2">{group._count.id}</td>
                                    <td className="px-4 py-2">
                                        {group.tenant_id === tenantId ? (
                                            <span className="bg-yellow-100 px-2 py-1 rounded text-xs">👈 YOU</span>
                                        ) : (
                                            <span className="text-gray-400">Other tenant</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-bold mb-4">Recent Tenants</h2>
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-2 text-left">Tenant Name</th>
                                <th className="px-4 py-2 text-left">Tenant ID</th>
                                <th className="px-4 py-2 text-left">Created</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allTenants.map((tenant) => (
                                <tr key={tenant.id} className={`border-b ${tenant.id === tenantId ? 'bg-yellow-50' : ''}`}>
                                    <td className="px-4 py-2">{tenant.name}</td>
                                    <td className="px-4 py-2 font-mono">{tenant.id.slice(0, 8)}...</td>
                                    <td className="px-4 py-2">{tenant.created_at ? new Date(tenant.created_at).toLocaleString() : 'N/A'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
                    <h3 className="font-bold mb-2">🔍 Diagnostic Summary</h3>
                    <ul className="text-sm space-y-1">
                        <li>• If you see purchase orders above, check if their tenant_id matches yours</li>
                        <li>• If tenant_ids don't match → Database has data from another tenant</li>
                        <li>• If tenant_ids DO match → Either you created them, or there's a tenant_id collision</li>
                        <li>• Check if your tenant is the newest in the list above</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}
