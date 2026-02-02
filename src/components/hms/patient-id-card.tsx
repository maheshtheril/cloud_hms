import { QRCodeSVG } from 'qrcode.react'
import { User, Phone, Calendar, MapPin, Activity, IndianRupee } from 'lucide-react'
import { useRef } from 'react'

interface PatientIDCardProps {
    patient: {
        id: string
        patient_number: string
        first_name: string
        last_name: string
        dob?: Date | string
        gender?: string
        blood_group?: string
        contact?: {
            phone?: string
            address?: {
                city?: string
                state?: string
            }
        }
        metadata?: {
            title?: string
            registration_date?: string
            registration_expiry?: string
        }
    }
    registrationFee?: number
    upiId?: string
    hospitalName?: string
    hospitalLogo?: string
}

export function PatientIDCard({
    patient,
    registrationFee = 100,
    upiId = 'hospital@upi',
    hospitalName = 'Cloud HMS',
    hospitalLogo
}: PatientIDCardProps) {
    const cardRef = useRef<HTMLDivElement>(null)
    const paymentQRRef = useRef<HTMLDivElement>(null)

    // Generate UPI payment link for swiping machines
    const generateUPIPaymentString = () => {
        const params = new URLSearchParams({
            pa: upiId, // UPI ID
            pn: hospitalName, // Payee name
            am: registrationFee.toString(), // Amount
            cu: 'INR', // Currency
            tn: `Registration Fee - ${patient.patient_number}` // Transaction note
        })
        return `upi://pay?${params.toString()}`
    }

    const handlePrint = () => {
        if (cardRef.current) {
            const printWindow = window.open('', '', 'width=800,height=600')
            if (printWindow) {
                printWindow.document.write(`
                    <html>
                        <head>
                            <title>Patient ID Card - ${patient.patient_number}</title>
                            <style>
                                @media print {
                                    @page { margin: 0; size: 85.6mm 53.98mm; }
                                    body { margin: 0; padding: 0; }
                                }
                                body {
                                    font-family: Arial, sans-serif;
                                    margin: 0;
                                    padding: 10mm;
                                    background: white;
                                }
                                .card {
                                    width: 85.6mm;
                                    height: 53.98mm;
                                    border: 2px solid #4F46E5;
                                    border-radius: 8px;
                                    overflow: hidden;
                                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                                    color: white;
                                    position: relative;
                                }
                                .header {
                                    background: rgba(255,255,255,0.95);
                                    color: #1e293b;
                                    padding: 8px 12px;
                                    text-align: center;
                                    border-bottom: 3px solid #4F46E5;
                                }
                                .hospital-name {
                                    font-size: 16px;
                                    font-weight: 900;
                                    text-transform: uppercase;
                                    letter-spacing: 1px;
                                }
                                .content {
                                    display: flex;
                                    padding: 12px;
                                    gap: 12px;
                                }
                                .info {
                                    flex: 1;
                                }
                                .patient-name {
                                    font-size: 18px;
                                    font-weight: 900;
                                    margin-bottom: 4px;
                                    text-transform: uppercase;
                                }
                                .patient-id {
                                    font-size: 12px;
                                    font-weight: 700;
                                    background: rgba(255,255,255,0.2);
                                    padding: 4px 8px;
                                    border-radius: 4px;
                                    display: inline-block;
                                    margin-bottom: 8px;
                                }
                                .details {
                                    font-size: 10px;
                                    line-height: 1.6;
                                }
                                .qr-section {
                                    background: white;
                                    padding: 8px;
                                    border-radius: 8px;
                                    display: flex;
                                    align-items: center;
                                    justify-center;
                                }
                                .footer {
                                    position: absolute;
                                    bottom: 0;
                                    left: 0;
                                    right: 0;
                                    background: rgba(0,0,0,0.2);
                                    padding: 4px 12px;
                                    font-size: 8px;
                                    text-align: center;
                                }
                            </style>
                        </head>
                        <body>
                            ${cardRef.current.innerHTML}
                        </body>
                    </html>
                `)
                printWindow.document.close()
                setTimeout(() => {
                    printWindow.print()
                    printWindow.close()
                }, 250)
            }
        }
    }

    const handlePrintPaymentQR = () => {
        if (paymentQRRef.current) {
            const printWindow = window.open('', '', 'width=600,height=800')
            if (printWindow) {
                printWindow.document.write(`
                    <html>
                        <head>
                            <title>Payment QR - ${patient.patient_number}</title>
                            <style>
                                @media print {
                                    @page { margin: 10mm; }
                                    body { margin: 0; padding: 0; }
                                }
                                body {
                                    font-family: Arial, sans-serif;
                                    display: flex;
                                    justify-content: center;
                                    align-items: center;
                                    min-height: 100vh;
                                    background: white;
                                }
                                .payment-card {
                                    text-align: center;
                                    padding: 20px;
                                    border: 3px solid #10b981;
                                    border-radius: 12px;
                                    max-width: 400px;
                                }
                                .title {
                                    font-size: 24px;
                                    font-weight: 900;
                                    color: #10b981;
                                    margin-bottom: 10px;
                                }
                                .amount {
                                    font-size: 48px;
                                    font-weight: 900;
                                    color: #059669;
                                    margin: 20px 0;
                                }
                                .patient-info {
                                    font-size: 14px;
                                    color: #64748b;
                                    margin-bottom: 20px;
                                }
                                .qr-container {
                                    background: white;
                                    padding: 20px;
                                    border-radius: 12px;
                                    display: inline-block;
                                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                                }
                                .instructions {
                                    margin-top: 20px;
                                    font-size: 12px;
                                    color: #64748b;
                                    line-height: 1.6;
                                }
                            </style>
                        </head>
                        <body>
                            ${paymentQRRef.current.innerHTML}
                        </body>
                    </html>
                `)
                printWindow.document.close()
                setTimeout(() => {
                    printWindow.print()
                    printWindow.close()
                }, 250)
            }
        }
    }

    const patientData = {
        id: patient.id,
        number: patient.patient_number,
        name: `${patient.metadata?.title || ''} ${patient.first_name} ${patient.last_name}`.trim(),
        phone: patient.contact?.phone,
        dob: patient.dob ? new Date(patient.dob).toLocaleDateString('en-IN') : '',
        gender: patient.gender,
        blood: patient.blood_group
    }

    const upiPaymentString = generateUPIPaymentString()

    return (
        <div className="space-y-6">
            {/* Patient ID Card */}
            <div ref={cardRef} className="card w-full max-w-[85.6mm] mx-auto" style={{ height: '53.98mm' }}>
                <div className="header">
                    <div className="hospital-name">{hospitalName}</div>
                    <div className="text-xs font-bold text-indigo-600">Patient Identification Card</div>
                </div>
                <div className="content">
                    <div className="info">
                        <div className="patient-name">{patientData.name}</div>
                        <div className="patient-id">ID: {patient.patient_number}</div>
                        <div className="details">
                            {patientData.phone && <div>📞 {patientData.phone}</div>}
                            {patientData.dob && <div>🎂 DOB: {patientData.dob}</div>}
                            {patientData.gender && <div>⚥ {patientData.gender.toUpperCase()}</div>}
                            {patientData.blood && <div>🩸 {patientData.blood}</div>}
                        </div>
                    </div>
                    <div className="qr-section">
                        <QRCodeSVG
                            value={JSON.stringify(patientData)}
                            size={80}
                            level="H"
                            includeMargin={false}
                        />
                    </div>
                </div>
                <div className="footer">
                    Scan QR code for instant patient verification • Emergency Contact: {patientData.phone || 'N/A'}
                </div>
            </div>

            {/* UPI Payment QR Code for Swiping Machines */}
            <div ref={paymentQRRef} className="payment-card bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 p-8 rounded-2xl border-2 border-emerald-200 dark:border-emerald-800">
                <div className="title text-2xl font-black text-emerald-600 dark:text-emerald-400 mb-2">
                    💳 Registration Fee Payment
                </div>
                <div className="amount text-5xl font-black text-emerald-700 dark:text-emerald-300 my-6">
                    ₹{registrationFee.toFixed(2)}
                </div>
                <div className="patient-info text-sm text-slate-600 dark:text-slate-400 mb-6">
                    <div className="font-bold">{patientData.name}</div>
                    <div>Patient ID: {patient.patient_number}</div>
                </div>
                <div className="qr-container bg-white p-6 rounded-xl inline-block shadow-xl">
                    <QRCodeSVG
                        value={upiPaymentString}
                        size={200}
                        level="H"
                        includeMargin={true}
                    />
                </div>
                <div className="instructions mt-6 text-xs text-slate-500 dark:text-slate-400">
                    <div className="font-bold mb-2">📱 Scan with any UPI app or payment terminal</div>
                    <div>Google Pay • PhonePe • Paytm • BHIM • Bank Apps</div>
                    <div className="mt-2 text-[10px] opacity-70">UPI ID: {upiId}</div>
                </div>
            </div>

            {/* Print Buttons */}
            <div className="flex gap-3 justify-center flex-wrap">
                <button
                    onClick={handlePrint}
                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                >
                    🪪 Print ID Card
                </button>
                <button
                    onClick={handlePrintPaymentQR}
                    className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                >
                    <IndianRupee className="h-4 w-4" />
                    Print Payment QR
                </button>
            </div>
        </div>
    )
}
