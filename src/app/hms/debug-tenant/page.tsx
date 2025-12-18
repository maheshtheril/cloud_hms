import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export default async function DebugTenantPage() {
    const session = await auth()

    if (!session?.user) {
        return <div className="p-8 text-red-600">Not logged in</div>
    }

    const myTenantId = session.user.tenantId
    const myCompanyId = session.user.companyId

    // Get MY purchase orders
    const myOrders = await prisma.hms_purchase_order.findMany({
        where: {
            tenant_id: myTenantId!,
            company_id: myCompanyId!
        },
        include: {
            hms_supplier: { select: { name: true } }
        },
        orderBy: { created_at: 'desc' }
    })

    // Get ALL purchase orders in database
    const allOrders = await prisma.hms_purchase_order.findMany({
        include: {
            hms_supplier: { select: { name: true } }
        },
        orderBy: { created_at: 'desc' },
        take: 50
    })

    // Get my tenant info
    const myTenant = await prisma.tenant.findUnique({
        where: { id: myTenantId! }
    })

    // Get all tenants
    const allTenants = await prisma.tenant.findMany({
        orderBy: { created_at: 'desc' }
    })

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* YOUR INFO */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h1 className="text-3xl font-bold mb-4">🔍 YOUR SESSION INFO</h1>
                    <div className="space-y-2 font-mono text-sm">
                        <p><strong>Email:</strong> {session.user.email}</p>
                        <p><strong>User ID:</strong> {session.user.id}</p>
                        <p className="text-lg"><strong className="bg-yellow-200 px-2">YOUR TENANT ID:</strong> <span className="bg-yellow-100 px-2 py-1">{myTenantId}</span></p>
                        <p><strong>Company ID:</strong> {myCompanyId}</p>
                    </div>
                </div>

                {/* YOUR TENANT */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-2xl font-bold mb-4">📋 YOUR TENANT</h2>
                    {myTenant ? (
                        <div className="font-mono text-sm">
                            <p><strong>Name:</strong> {myTenant.name}</p>
                            <p><strong>Created:</strong> {myTenant.created_at?.toLocaleString() || 'N/A'}</p>
                            <p className="text-red-600 font-bold mt-2">
                                👆 This shows when YOUR tenant was created
                            </p>
                        </div>
                    ) : (
                        <p className="text-red-600">⚠️ TENANT NOT FOUND!</p>
                    )}
                </div>

                {/* YOUR PURCHASE ORDERS */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-2xl font-bold mb-4">📦 YOUR PURCHASE ORDERS (Filtered by your tenant_id)</h2>
                    <p className="mb-4"><strong>Count:</strong> {myOrders.length}</p>

                    {myOrders.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm border">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-4 py-2 text-left">PO #</th>
                                        <th className="px-4 py-2 text-left">Supplier</th>
                                        <th className="px-4 py-2 text-left">Amount</th>
                                        <th className="px-4 py-2 text-left">Tenant ID</th>
                                        <th className="px-4 py-2 text-left">Created</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {myOrders.map((order) => (
                                        <tr key={order.id} className="border-b bg-yellow-50">
                                            <td className="px-4 py-2 font-mono">{order.name}</td>
                                            <td className="px-4 py-2">{order.hms_supplier?.name}</td>
                                            <td className="px-4 py-2">{order.total_amount?.toString()}</td>
                                            <td className="px-4 py-2 font-mono text-xs">{order.tenant_id.slice(0, 16)}...</td>
                                            <td className="px-4 py-2">{order.created_at.toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <p className="text-red-600 font-bold mt-4">
                                ☝️ THESE ARE THE ORDERS YOU SEE ON /hms/purchasing/orders
                            </p>
                        </div>
                    ) : (
                        <p className="text-green-600">✅ Good! No orders for your tenant.</p>
                    )}
                </div>

                {/* ALL PURCHASE ORDERS */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-2xl font-bold mb-4">🗂️ ALL PURCHASE ORDERS IN DATABASE</h2>
                    <p className="mb-4"><strong>Total Count:</strong> {allOrders.length}</p>

                    {allOrders.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm border">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-4 py-2 text-left">PO #</th>
                                        <th className="px-4 py-2 text-left">Supplier</th>
                                        <th className="px-4 py-2 text-left">Tenant ID</th>
                                        <th className="px-4 py-2 text-left">Match?</th>
                                        <th className="px-4 py-2 text-left">Created</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allOrders.map((order) => {
                                        const isMyTenant = order.tenant_id === myTenantId
                                        return (
                                            <tr key={order.id} className={`border-b ${isMyTenant ? 'bg-red-100' : ''}`}>
                                                <td className="px-4 py-2 font-mono">{order.name}</td>
                                                <td className="px-4 py-2">{order.hms_supplier?.name}</td>
                                                <td className="px-4 py-2 font-mono text-xs">{order.tenant_id.slice(0, 16)}...</td>
                                                <td className="px-4 py-2">
                                                    {isMyTenant ? (
                                                        <span className="bg-red-600 text-white px-2 py-1 text-xs">YOUR TENANT</span>
                                                    ) : (
                                                        <span className="text-gray-400">Other</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-2">{order.created_at.toLocaleString()}</td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-gray-500">No purchase orders in database</p>
                    )}
                </div>

                {/* ALL TENANTS */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-2xl font-bold mb-4">👥 ALL TENANTS</h2>
                    <table className="min-w-full text-sm border">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-2 text-left">Name</th>
                                <th className="px-4 py-2 text-left">Tenant ID</th>
                                <th className="px-4 py-2 text-left">Created</th>
                                <th className="px-4 py-2 text-left">Match?</th>
                                <th className="px-4 py-2 text-left">PO Count</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allTenants.map((tenant) => {
                                const isMe = tenant.id === myTenantId
                                const orderCount = allOrders.filter(o => o.tenant_id === tenant.id).length
                                return (
                                    <tr key={tenant.id} className={`border-b ${isMe ? 'bg-yellow-100' : ''}`}>
                                        <td className="px-4 py-2">{tenant.name}</td>
                                        <td className="px-4 py-2 font-mono text-xs">{tenant.id.slice(0, 16)}...</td>
                                        <td className="px-4 py-2">{tenant.created_at?.toLocaleString() || 'N/A'}</td>
                                        <td className="px-4 py-2">
                                            {isMe && <span className="bg-yellow-600 text-white px-2 py-1 text-xs">YOU</span>}
                                        </td>
                                        <td className="px-4 py-2 font-bold">{orderCount}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>

                {/* DIAGNOSIS */}
                <div className="bg-blue-50 border-2 border-blue-600 p-6 rounded-lg">
                    <h2 className="text-2xl font-bold mb-4">🔬 DIAGNOSIS</h2>
                    <div className="space-y-2">
                        <p><strong>Your Tenant Created:</strong> {myTenant?.created_at?.toLocaleString() || 'N/A'}</p>
                        <p><strong>Purchase Orders for Your Tenant:</strong> {myOrders.length}</p>

                        {myOrders.length > 0 && (
                            <>
                                <p className="text-red-600 font-bold">⚠️ YOUR TENANT HAS PURCHASE ORDERS!</p>
                                <p>First order created: {myOrders[myOrders.length - 1]?.created_at.toLocaleString()}</p>
                                <p>Latest order created: {myOrders[0]?.created_at.toLocaleString()}</p>

                                <div className="mt-4 bg-red-100 p-4 rounded">
                                    <p className="font-bold">🚨 CONCLUSION:</p>
                                    {myTenant && myTenant.created_at && myOrders[0] && myOrders[0].created_at > myTenant.created_at ? (
                                        <p>These orders were created AFTER your tenant signup → You or someone created them</p>
                                    ) : (
                                        <p>These orders existed BEFORE your tenant signup → Database has old data OR you're using an old tenant</p>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>

            </div>
        </div>
    )
}
