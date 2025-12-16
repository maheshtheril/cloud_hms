
'use client'

import { useRouter } from 'next/navigation'
import { LoginStatus } from '@/app/actions/crm/auth'
import { AttendanceModal } from './attendance-modal'
import { FollowupBlocker } from './followup-blocker'

interface LoginWorkflowWrapperProps {
    status: LoginStatus
    children: React.ReactNode
}

export function LoginWorkflowWrapper({ status, children }: LoginWorkflowWrapperProps) {
    const router = useRouter()

    if (!status.blocked) {
        return <>{children}</>
    }

    if (status.reason === 'attendance') {
        return (
            <>
                <div className="blur-sm pointer-events-none fixed inset-0">
                    {children}
                </div>
                <AttendanceModal onSuccess={() => router.refresh()} />
            </>
        )
    }

    if (status.reason === 'followups' && status.data) {
        return (
            <>
                <div className="blur-sm pointer-events-none fixed inset-0">
                    {children}
                </div>
                <FollowupBlocker followups={status.data} />
            </>
        )
    }

    // Fallback if blocked but no known reason (shouldn't happen)
    return <>{children}</>
}
