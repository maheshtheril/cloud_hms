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
                        body { 
                            font-family: 'Inter', sans-serif; 
                            line-height: 1.6; 
                            padding: ${withLetterhead ? '4cm 2cm 2cm 2cm' : '2cm'};
                            color: #1a202c;
                        }
                        @media print {
                            @page { margin: 0; }
                            body { margin: 0; }
                        }
                        .header { 
                            text-align: center; 
                            margin-bottom: 2cm; 
                            display: ${withLetterhead ? 'none' : 'block'};
                        }
                        .header h1 { margin: 0; text-transform: uppercase; letter-spacing: 2px; }
                        .ticket-info {
                            display: flex;
                            justify-content: space-between;
                            border-bottom: 2px solid #000;
                            padding-bottom: 10px;
                            margin-bottom: 30px;
                        }
                        .info-grid {
                            display: grid;
                            grid-template-cols: 1fr 1fr;
                            gap: 20px;
                            margin-bottom: 40px;
                        }
                        .label { font-weight: bold; text-transform: uppercase; font-size: 10px; color: #718096; }
                        .value { font-weight: 900; font-size: 16px; margin-top: 4px; }
                        .rx-section {
                            border: 1px dashed #cbd5e0;
                            height: 15cm;
                            position: relative;
                            margin-top: 40px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        }
                        .rx-section::after {
                            content: '℞ (PRESCRIPTION SPACE)';
                            font-size: 40px;
                            font-weight: 900;
                            color: #edf2f7;
                            font-style: italic;
                        }
                        .footer {
                            margin-top: 50px;
                            text-align: right;
                            font-size: 10px;
                            color: #a0aec0;
                        }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>Hospital Visit Slip</h1>
                        <p>Clinical Out-Patient Department</p>
                    </div>
                    
                    <div class="ticket-info">
                        <div>
                            <span class="label">Token / OP No</span>
                            <div class="value">${tokenNumber}</div>
                        </div>
                        <div style="text-align: right;">
                            <span class="label">Date & Time</span>
                            <div class="value">${date} | ${time}</div>
                        </div>
                    </div>

                    <div class="info-grid">
                        <div>
                            <span class="label">Patient Name</span>
                            <div class="value">${patientName}</div>
                            <div style="font-size: 11px; font-weight: bold; color: #4a5568;">
                                ID: ${appointment.patient?.patient_number} | ${appointment.patient?.gender || 'N/A'}
                            </div>
                        </div>
                        <div>
                            <span class="label">Consulting Physician</span>
                            <div class="value">${doctorName}</div>
                            <div style="font-size: 11px; font-weight: bold; color: #4a5568;">
                                ${appointment.clinician?.role || 'General Practitioner'}
                            </div>
                        </div>
                    </div>

                    <div class="rx-section"></div>

                    <div class="footer">
                        System Generated Document. Valid for 24 hours.
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
