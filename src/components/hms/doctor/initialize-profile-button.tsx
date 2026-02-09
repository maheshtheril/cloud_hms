'use client';

import { useState } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { initializeDoctorProfile } from '@/app/actions/doctor';

export function InitializeProfileButton() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleClick = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const formData = new FormData();
            await initializeDoctorProfile(formData);

            // The redirect happens in the server action
            // If we reach here, there might be an error
        } catch (err: any) {
            console.error('Profile initialization error:', err);
            setError(err.message || 'Failed to initialize profile');
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {error}
                </div>
            )}

            <button
                onClick={handleClick}
                disabled={isLoading}
                className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl shadow-lg hover:bg-black transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Initializing...
                    </>
                ) : (
                    <>
                        <CheckCircle2 className="h-5 w-5" />
                        Initialize Profile
                    </>
                )}
            </button>
        </div>
    );
}
