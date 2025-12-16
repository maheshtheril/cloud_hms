
import { auth } from '@/auth';
import { runDiagnostics } from '@/app/actions/debug-check';
import { redirect } from 'next/navigation';

export default async function DebugPage() {
    const session = await auth();
    const email = session?.user?.email || '';

    let dbResult = null;
    if (email) {
        dbResult = await runDiagnostics(email);
    }

    return (
        <div className="p-8 max-w-4xl mx-auto font-mono text-sm">
            <h1 className="text-2xl font-bold mb-6 border-b pb-2">System Diagnostics</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* LEFT: SESSION STATE */}
                <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h2 className="font-bold text-yellow-800 mb-4">1. Browser Session (NextAuth)</h2>
                    <pre className="whitespace-pre-wrap break-all text-xs">
                        {JSON.stringify(session, null, 2)}
                    </pre>
                    <div className="mt-4 pt-4 border-t border-yellow-200 text-yellow-900">
                        <p>Has CRM? <strong>{String(session?.user?.hasCRM)}</strong></p>
                        <p>Has HMS? <strong>{String(session?.user?.hasHMS)}</strong></p>
                    </div>
                </div>

                {/* RIGHT: DATABASE STATE */}
                <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
                    <h2 className="font-bold text-blue-800 mb-4">2. Real Database State</h2>
                    {dbResult ? (
                        <>
                            <pre className="whitespace-pre-wrap break-all text-xs">
                                {JSON.stringify(dbResult, null, 2)}
                            </pre>
                            <div className="mt-4 pt-4 border-t border-blue-200 text-blue-900">
                                <p>DB Has CRM? <strong>{String(dbResult.analysis?.hasCRM)}</strong></p>
                                <p>DB Has HMS? <strong>{String(dbResult.analysis?.hasHMS)}</strong></p>
                                <p>DB Is Healthcare? <strong>{String(dbResult.analysis?.isHealthcare)}</strong></p>
                            </div>
                        </>
                    ) : (
                        <p className="text-gray-500">No user logged in to check.</p>
                    )}
                </div>
            </div>

            <div className="mt-8 p-6 bg-gray-100 rounded-lg flex justify-between items-center">
                <div>
                    <h3 className="font-bold text-lg">Action Required</h3>
                    <p className="text-gray-600">If "Real Database" says TRUE but "Browser Session" says UNDEFINED/FALSE, you must logout.</p>
                </div>

                <form action={async () => {
                    'use server';
                    const { signOut } = await import('@/auth');
                    await signOut({ redirectTo: '/login' });
                }}>
                    <button className="bg-red-600 text-white px-8 py-4 rounded-lg font-bold hover:bg-red-700 shadow-lg">
                        FORCE SIGN OUT
                    </button>
                </form>
            </div>
        </div>
    );
}
