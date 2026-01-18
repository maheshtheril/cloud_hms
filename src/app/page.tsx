// DEBUG MODE: REPLACING REDIRECTS WITH MANUAL NAVIGATION
import { auth } from '@/auth';
import Link from 'next/link';

export default async function Home() {
  const session = await auth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8">
      <div className="max-w-2xl w-full bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Cloud HMS Portal</h1>
        <p className="text-gray-500 mb-8">Central Navigation Hub</p>

        {session?.user ? (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="font-medium text-green-900">✅ Authenticated as {session.user.email}</p>
              <p className="text-sm text-green-700 mt-1">Role: {session.user.role || 'None'} | Tenant: {session.user.tenantId}</p>
              <div className="flex gap-2 mt-2 text-xs">
                <span className={`px-2 py-1 rounded ${session.user.hasHMS ? 'bg-green-200' : 'bg-red-200'}`}>HMS: {session.user.hasHMS ? 'Yes' : 'No'}</span>
                <span className={`px-2 py-1 rounded ${session.user.hasCRM ? 'bg-green-200' : 'bg-red-200'}`}>CRM: {session.user.hasCRM ? 'Yes' : 'No'}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/hms/dashboard" className="flex items-center justify-center p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all shadow-md">
                🏥 Enter HMS Dashboard
              </Link>
              <Link href="/crm/dashboard" className="flex items-center justify-center p-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-all shadow-md">
                💼 Enter CRM Dashboard
              </Link>
              <Link href="/settings" className="flex items-center justify-center p-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all">
                ⚙️ Settings
              </Link>
              <Link href="/api/auth/signout" className="flex items-center justify-center p-4 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-medium transition-all">
                🚪 Sign Out
              </Link>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-6">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-amber-800">⚠️ No active session found.</p>
            </div>
            <Link href="/login" className="block w-full py-4 bg-black text-white rounded-xl font-bold hover:scale-[1.02] transition-transform">
              Sign In Now
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
