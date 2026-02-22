'use client';
import { PatientPaymentDialog } from "@/components/hms/billing/patient-payment-dialog";
export default function TestDialog() {
    return (
        <div className="p-20">
            <PatientPaymentDialog
                patientId="TEST"
                patientName="Test Patient"
                fixedAmount={150}
            />
        </div>
    );
}
