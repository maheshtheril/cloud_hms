
import { Metadata } from 'next'
import { TargetForm } from '@/components/crm/targets/target-form'
import { ArrowLeft, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
    title: 'Initialize Target | SAAS ERP',
    description: 'Establish new performance achievement parameters',
}

export default function NewTargetPage() {
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
                        <Link href="/crm/targets">
                            <Button variant="ghost" size="icon" className="rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md">
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-black text-gradient-primary uppercase tracking-tighter">Define Objective</h1>
                            <p className="text-slate-500 font-medium">Configure achievement vectors for performance synchronization.</p>
                        </div>
                    </div>
                </div>

                <div className="px-4 pb-12">
                    <TargetForm />
                </div>
            </div>
        </div>
    )
}

