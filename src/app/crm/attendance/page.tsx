import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { AttendanceWidget } from '@/components/crm/attendance-widget'
import { format } from 'date-fns'

export const dynamic = 'force-dynamic'

export default async function AttendancePage() {
    const session = await auth()
    const user = session?.user

    if (!user) return <div>Unauthorized</div>

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Get today's record
    const todaysRecord = await prisma.crm_attendance.findFirst({
        where: {
            user_id: user.id,
            date: { gte: today }
        }
    })

    // Get History
    const history = await prisma.crm_attendance.findMany({
        where: { user_id: user.id },
        orderBy: { date: 'desc' },
        take: 10
    })

    return (
        <div className="container mx-auto py-8 max-w-2xl">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Field Attendance</h1>
                <p className="text-gray-500 mt-2">Track your daily visits and location.</p>
            </div>

            <div className="mb-12">
                <AttendanceWidget latestRecord={todaysRecord} />
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Recent History</h3>
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm divide-y">
                    {history.map((record) => (
                        <div key={record.id} className="p-4 flex items-center justify-between">
                            <div>
                                <p className="font-medium text-gray-900">{format(new Date(record.date), 'EEE, MMM d, yyyy')}</p>
                                <p className="text-sm text-gray-500">
                                    {record.check_in ? format(new Date(record.check_in), 'h:mm a') : '-'} — {record.check_out ? format(new Date(record.check_out), 'h:mm a') : 'Active'}
                                </p>
                            </div>
                            <div>
                                <span className={`px-2 py-1 rounded text-xs font-bold uppercase
                            ${record.status === 'present' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                         `}>
                                    {record.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
