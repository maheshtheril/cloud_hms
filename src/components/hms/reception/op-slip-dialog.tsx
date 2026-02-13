'use client'

import { useState } from "react"
import {
    Dialog, DialogContent, DialogHeader,
    DialogTitle, DialogTrigger, DialogFooter,
    DialogDescription
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Printer, FileText, Layout, X, Check } from "lucide-react"

interface OpSlipDialogProps {
    appointment: any
    trigger?: React.ReactNode
}

export function OpSlipDialog({ appointment, trigger }: OpSlipDialogProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [withLetterhead, setWithLetterhead] = useState(false)

    const handlePrint = () => {
        const printWindow = window.open('', '_blank')
        if (!printWindow) return

        const patientName = `${appointment.patient?.first_name} ${appointment.patient?.last_name || ''}`
        const doctorName = `Dr. ${appointment.clinician?.first_name} ${appointment.clinician?.last_name || ''}`
        const date = new Date(appointment.start_time).toLocaleDateString()
        const time = new Date(appointment.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        const tokenNumber = appointment.id.split('-')[0].toUpperCase()

        const html = `
            <!DOCTYPE html>
            <html>
                <head>
                    <title>OP Slip - ${patientName}</title>
                    <style>
                        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
                        body { 
                            font-family: 'Inter', sans-serif; 
                            line-height: 1.4; 
                            padding: ${withLetterhead ? '4.5cm 1.5cm 1.5cm 1.5cm' : '1.5cm'};
                            color: #1a202c;
                            background: white;
                        }
                        @media print {
                            @page { margin: 0; size: A4; }
                            body { margin: 0; }
                        }
                        .header { 
                            text-align: center; 
                            margin-bottom: 1cm; 
                            display: ${withLetterhead ? 'none' : 'block'};
                            border-bottom: 3px solid #000;
                            padding-bottom: 10px;
                        }
                        .header h1 { margin: 0; font-size: 28px; font-weight: 900; text-transform: uppercase; letter-spacing: -1px; }
                        .header p { margin: 0; font-weight: 700; font-size: 12px; color: #4a5568; text-transform: uppercase; tracking: 2px; }
                        
                        .ticket-info {
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            margin-top: 20px;
                            margin-bottom: 25px;
                            background: #f7fafc;
                            padding: 15px;
                            border-radius: 8px;
                        }
                        .token-box {
                            background: #000;
                            color: #white;
                            padding: 10px 20px;
                            border-radius: 6px;
                            text-align: center;
                        }
                        .token-label { font-size: 10px; font-weight: 900; color: #cbd5e0; text-transform: uppercase; }
                        .token-value { font-size: 24px; font-weight: 900; color: white; }

                        .info-grid {
                            display: grid;
                            grid-template-cols: 1.5fr 1fr;
                            gap: 30px;
                            margin-bottom: 30px;
                        }
                        .section-title { 
                            font-size: 11px; 
                            font-weight: 900; 
                            text-transform: uppercase; 
                            color: white; 
                            background: #2d3748;
                            padding: 4px 10px;
                            display: inline-block;
                            margin-bottom: 10px;
                            border-radius: 4px;
                        }
                        .label { font-weight: bold; text-transform: uppercase; font-size: 10px; color: #718096; display: block; }
                        .value { font-weight: 900; font-size: 16px; margin-bottom: 4px; line-height: 1.1; }

                        /* CLINICAL SECTIONS */
                        .vitals-grid {
                            display: grid;
                            grid-template-cols: repeat(5, 1fr);
                            gap: 10px;
                            border: 2px solid #edf2f7;
                            padding: 15px;
                            border-radius: 12px;
                            margin-bottom: 30px;
                        }
                        .vital-box {
                            border-right: 1px solid #edf2f7;
                            padding-right: 10px;
                        }
                        .vital-box:last-child { border: none; }
                        .vital-input { border-bottom: 1px dashed #cbd5e0; height: 25px; margin-top: 5px; }

                        .clinical-container {
                            border: 2px solid #2d3748;
                            border-radius: 12px;
                            min-height: 16cm;
                            padding: 20px;
                            position: relative;
                        }
                        .rx-symbol {
                            font-size: 60px;
                            font-weight: 900;
                            color: #edf2f7;
                            position: absolute;
                            top: 10px;
                            left: 20px;
                            font-style: italic;
                            z-index: -1;
                        }
                        
                        .footer {
                            margin-top: 30px;
                            display: flex;
                            justify-content: space-between;
                            font-size: 10px;
                            color: #a0aec0;
                            border-top: 1px solid #edf2f7;
                            padding-top: 10px;
                        }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>Clinical OP Visit Slip</h1>
                        <p>Ziona Medical Center - Outpatient Department</p>
                    </div>
                    
                    <div class="ticket-info">
                        <div>
                            <span class="label">Patient Name & ID</span>
                            <div class="value">${patientName}</div>
                            <div style="font-size: 12px; font-weight: 700;">ID: ${appointment.patient?.patient_number} | ${appointment.patient?.gender || 'N/A'}</div>
                        </div>
                        <div class="token-box">
                            <span class="token-label">OP TOKEN</span>
                            <div class="token-value">#${tokenNumber}</div>
                        </div>
                    </div>

                    <div class="info-grid">
                        <div>
                            <span class="section-title">Encounter Details</span>
                            <div style="display: grid; grid-template-cols: 1fr 1fr; gap: 15px;">
                                <div>
                                    <span class="label">Consulting With</span>
                                    <div class="value">${doctorName}</div>
                                    <div style="font-size: 10px; font-weight: bold;">${appointment.clinician?.role || 'Clinician'}</div>
                                </div>
                                <div>
                                    <span class="label">Date & Time</span>
                                    <div class="value">${date}</div>
                                    <div style="font-size: 10px; font-weight: bold;">${time}</div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <span class="section-title">Visit Protocol</span>
                            <div class="value" style="text-transform: uppercase; font-size: 12px;">${appointment.type || 'Standard Consultation'}</div>
                            <div style="font-size: 10px; font-weight: bold;">Priority: ${appointment.priority?.toUpperCase() || 'NORMAL'}</div>
                        </div>
                    </div>

                    <span class="section-title">Nurse Vitals Audit</span>
                    <div class="vitals-grid">
                        <div class="vital-box">
                            <span class="label">BP (mmHg)</span>
                            <div class="vital-input"></div>
                        </div>
                        <div class="vital-box">
                            <span class="label">Pulse (bpm)</span>
                            <div class="vital-input"></div>
                        </div>
                        <div class="vital-box">
                            <span class="label">Temp (°F)</span>
                            <div class="vital-input"></div>
                        </div>
                        <div class="vital-box">
                            <span class="label">SPO2 (%)</span>
                            <div class="vital-input"></div>
                        </div>
                        <div class="vital-box">
                            <span class="label">Weight (kg)</span>
                            <div class="vital-input"></div>
                        </div>
                    </div>

                    <span class="section-title">Clinical Consultation & Rx</span>
                    <div class="clinical-container">
                        <div class="rx-symbol">℞</div>
                    </div>

                    <div class="footer">
                        <div>V10-OPP-PROTOCOL | SYSTEM GENERATED</div>
                        <div>SIGNATURE: __________________________</div>
                    </div>

                    <script>
                        window.onload = () => {
                            window.print();
                            window.close();
                        };
                    </script>
                </body>
            </html>
        `

        printWindow.document.write(html)
        printWindow.document.close()
        setIsOpen(false)
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="outline" size="sm" className="h-8 gap-2 border-slate-200">
                        <Printer className="h-3.5 w-3.5" />
                        Print OP Slip
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-w-md rounded-[2rem] p-0 border-none shadow-2xl overflow-hidden bg-slate-50">
                <div className="p-8">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-14 w-14 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-100">
                            <FileText className="h-7 w-7 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 leading-tight uppercase italic tracking-tighter">
                                OP Slip <span className="text-indigo-600">Protocol</span>
                            </h2>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Select Print Configuration</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <button
                            onClick={() => setWithLetterhead(false)}
                            className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center justify-between group ${!withLetterhead ? 'bg-white border-indigo-600 shadow-xl shadow-indigo-50' : 'bg-white/50 border-transparent hover:border-slate-200'}`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${!withLetterhead ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                                    <Layout className="h-5 w-5" />
                                </div>
                                <div className="text-left">
                                    <p className="font-black text-slate-800 uppercase tracking-tight text-sm">Full Standard Print</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Includes Hospital Header & Info</p>
                                </div>
                            </div>
                            {!withLetterhead && <Check className="h-5 w-5 text-indigo-600" />}
                        </button>

                        <button
                            onClick={() => setWithLetterhead(true)}
                            className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center justify-between group ${withLetterhead ? 'bg-white border-indigo-600 shadow-xl shadow-indigo-50' : 'bg-white/50 border-transparent hover:border-slate-200'}`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${withLetterhead ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                                    <Layout className="h-5 w-5" />
                                </div>
                                <div className="text-left">
                                    <p className="font-black text-slate-800 uppercase tracking-tight text-sm">Letterhead Optimized</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Leaves 10cm space for pre-printed paper</p>
                                </div>
                            </div>
                            {withLetterhead && <Check className="h-5 w-5 text-indigo-600" />}
                        </button>
                    </div>

                    <div className="mt-8 flex gap-3">
                        <Button
                            variant="ghost"
                            onClick={() => setIsOpen(false)}
                            className="flex-1 h-14 rounded-2xl font-black uppercase tracking-widest text-slate-400 hover:bg-slate-100"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handlePrint}
                            className="flex-[2] h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest shadow-xl shadow-indigo-100 flex items-center gap-2"
                        >
                            <Printer className="h-5 w-5" />
                            Launch Print
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
