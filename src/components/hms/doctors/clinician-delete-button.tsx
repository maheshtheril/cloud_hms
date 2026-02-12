'use client'

import { useState } from 'react'
import { Trash2, Loader2 } from 'lucide-react'
import { deleteClinician } from '@/app/actions/doctor'
import { useToast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'

export function ClinicianDeleteButton({ clinicianId }: { clinicianId: string }) {
    const [isPending, setIsPending] = useState(false)
    const { toast } = useToast()
    const router = useRouter()

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        if (!confirm('Are you absolutely sure you want to PERMANENTLY DELETE this personnel record? This will remove them from the Staff Directory. This cannot be undone.')) return

        setIsPending(true)
        try {
            const result = await deleteClinician(clinicianId)
            if (result.success) {
                toast({
                    title: "Record Deleted",
                    description: "Staff record has been permanently removed from the directory.",
                    className: "bg-emerald-600 text-white"
                })
                router.push('/hms/doctors')
                router.refresh()
            } else {
                toast({
                    title: "Action Blocked",
                    description: result.error || "Could not delete record. They may have clinical history.",
                    variant: "destructive"
                })
            }
        } catch (error: any) {
            toast({
                title: "System Error",
                description: error.message,
                variant: "destructive"
            })
        } finally {
            setIsPending(false)
        }
    }

    return (
        <button
            onClick={handleDelete}
            disabled={isPending}
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100 flex items-center justify-center"
            title="Delete Staff Record"
        >
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
        </button>
    )
}
