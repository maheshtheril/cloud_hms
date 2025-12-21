import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import AcceptInviteForm from './accept-invite-form'
import Link from 'next/link'

export default async function AcceptInvitePage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
    const { token } = await searchParams

    if (!token) {
        redirect('/auth/login')
    }

    const tokenRecord = await prisma.email_verification_tokens.findFirst({
        where: { token: token },
        include: { app_user: true } // Need user details? Maybe just email from token if user deleted?
    })

    // In schema, email is stored in token table too.

    if (!tokenRecord || new Date() > tokenRecord.expires_at) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <div className="max-w-md w-full p-8 bg-white rounded-xl shadow-lg text-center">
                    <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">⚠️</span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid or Expired Link</h1>
                    <p className="text-gray-600 mb-8">This invitation link is invalid or has expired. Please ask your administrator to send a new invitation.</p>
                    <Link
                        href="/auth/login"
                        className="inline-block bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                    >
                        Return to Login
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 font-sans">
            <AcceptInviteForm token={token} email={tokenRecord.email} />
        </div>
    )
}
