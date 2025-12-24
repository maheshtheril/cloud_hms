'use client'

import { useState } from "react"
import { CreatePatientForm } from "@/components/hms/create-patient-form"
import { Edit } from "lucide-react"

export function EditPatientButton({ patient }: { patient: any }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium flex items-center gap-2"
            >
                <Edit className="h-4 w-4" />
                Edit Profile
            </button>

            {isOpen && (
                <CreatePatientForm
                    isDialog={false} // Use full screen overlay mode for maximum focus
                    initialData={patient}
                    onClose={() => setIsOpen(false)}
                    onSuccess={() => {
                        setIsOpen(false);
                        window.location.reload(); // Refresh to show updates
                    }}
                />
            )}
        </>
    )
}
