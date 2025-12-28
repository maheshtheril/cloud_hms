import { PrescriptionEditor } from "@/components/prescriptions/prescription-editor"
import { Suspense } from "react"

export default function NewPrescriptionPage() {
    return (
        <Suspense fallback={<div>Loading editor...</div>}>
            <PrescriptionEditor isModal={false} />
        </Suspense>
    )
}
