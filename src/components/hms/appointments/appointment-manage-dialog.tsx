'use client'

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { AppointmentForm } from "@/components/appointments/appointment-form"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

interface AppointmentManageDialogProps {
    patient: any
    doctors: any[]
    existingAppointment?: any
    trigger?: React.ReactNode
    open?: boolean
    onOpenChange?: (open: boolean) => void
}

export function AppointmentManageDialog({ patient, doctors, existingAppointment, trigger, open, onOpenChange }: AppointmentManageDialogProps) {
    const [internalOpen, setInternalOpen] = useState(false)
    const isControlled = open !== undefined && onOpenChange !== undefined
    const finalOpen = isControlled ? open : internalOpen
    const setFinalOpen = isControlled ? onOpenChange : setInternalOpen

    // Construct patients array for the form
    const patients = [patient]

    return (
        <Dialog open={finalOpen} onOpenChange={setFinalOpen}>
            {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
            <DialogContent className="max-w-6xl h-[95vh] p-0 gap-0 overflow-hidden bg-white">
                <div className="h-full overflow-y-auto">
                    <AppointmentForm
                        patients={patients}
                        doctors={doctors}
                        initialData={{
                            patient_id: patient.id
                        }}
                        editingAppointment={existingAppointment}
                        onClose={() => setFinalOpen(false)}
                    />
                </div>
            </DialogContent>
        </Dialog>
    )
}
