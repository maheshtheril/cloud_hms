import { PrescriptionEditor } from "@/components/prescriptions/prescription-editor"
import { Suspense } from "react"

export default function NewPrescriptionModal() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PrescriptionEditor isModal={true} />
        </Suspense>
    )
}
