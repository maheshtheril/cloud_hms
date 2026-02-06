'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Bed } from 'lucide-react'
import { createAdmission } from "@/app/actions/wards"
import { toast } from "sonner"
import { useRouter } from 'next/navigation'

export function AdmitPatientButton({ patientId, patientName }: { patientId: string, patientName: string }) {
    const [isPending, setIsPending] = useState(false)
    const router = useRouter()

    async function handleAdmit() {
        if (!confirm(`Are you sure you want to Admit ${patientName} to the hospital?`)) return

        setIsPending(true)
        const res = await createAdmission(patientId)
        if (res.success) {
            toast.success(`${patientName} has been admitted. Please assign a bed in the Wards section.`)
            router.push('/hms/wards')
        } else {
            toast.error(res.error)
        }
        setIsPending(false)
    }

    return (
        <button
            onClick={handleAdmit}
            disabled={isPending}
            className="text-emerald-600 hover:text-emerald-800 font-bold text-xs uppercase tracking-wider disabled:opacity-50"
        >
            {isPending ? 'Admitting...' : 'Admit'}
        </button>
    )
}
