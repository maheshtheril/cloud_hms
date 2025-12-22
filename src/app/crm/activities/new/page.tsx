import { ActivityForm } from '@/components/crm/activity-form'
import { Activity, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NewActivityPage() {
    return (
        <div className="min-h-screen bg-futuristic">
            {/* Animated Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 -left-4 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
                <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
            </div>

            <div className="relative container mx-auto py-8 space-y-8 max-w-4xl">
                <div className="flex items-center justify-between mb-8 px-4">
                    <div className="flex items-center gap-4">
                        <Link href="/crm/activities">
                            <Button variant="ghost" size="icon" className="rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md transition-all">
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-black text-gradient-primary uppercase tracking-tighter flex items-center gap-3">
                                Log Neural Activity
                                <Activity className="h-7 w-7 text-orange-600 animate-pulse" />
                            </h1>
                            <p className="text-slate-500 font-medium">Capture interactions and synchronize AI sentiment vectors.</p>
                        </div>
                    </div>
                </div>

                <div className="px-4 pb-12">
                    <ActivityForm />
                </div>
            </div>
        </div>
    )
}

