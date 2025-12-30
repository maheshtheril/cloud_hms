import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { notFound } from "next/navigation"
import { Receipt, Building2, User, Calendar, CreditCard } from "lucide-react"

export default async function PrintPage({ params, searchParams }: {
    params: Promise<{ id: string }>,
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const session = await auth();
    const { id } = await params;
    const { type } = await searchParams;

    if (!session?.user?.companyId) return <div>Unauthorized</div>;

    // --- Prescription Print View ---
    if (type === 'prescription') {
        const prescription = await (prisma.prescription as any).findFirst({
            where: { id }, // Prisma usually handles ID uniqueness well enough with findFirst or findUnique
            include: {
                hms_patient: true,
                prescription_items: {
                    include: { hms_product: true }
                }
            }
        });

        if (!prescription) return notFound();

        return (
            <div className="min-h-screen bg-white font-sans text-slate-900">
                {/* Print Styles */}
                <style dangerouslySetInnerHTML={{
                    __html: `
                    @media print {
                        @page {
                            size: A4;
                            margin: 20mm;
                        }
                        body {
                            print-color-adjust: exact;
                            -webkit-print-color-adjust: exact;
                        }
                        .no-print {
                            display: none !important;
                        }
                        #print-area {
                            margin: 0;
                            border: none;
                            padding: 0;
                        }
                    }
                    #print-area {
                        max-width: 850px;
                        margin: 0 auto;
                    }
                ` }} />

                {/* Toolbar for preview - hidden during print */}
                <div className="no-print sticky top-0 bg-slate-100 border-b border-slate-200 p-4 flex justify-center gap-4 z-50">
                    <button
                        onClick={() => window.print()}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-bold shadow-lg transition-all flex items-center gap-2"
                    >
                        <Receipt className="h-4 w-4" />
                        Print / Save as PDF
                    </button>
                    <button
                        onClick={() => window.close()}
                        className="bg-white hover:bg-slate-50 text-slate-600 px-6 py-2 rounded-lg font-bold border border-slate-200"
                    >
                        Close Preview
                    </button>
                </div>

                <div className="p-8 sm:p-12" id="print-area">
                    {/* Header */}
                    <div className="flex justify-between items-start border-b-2 border-slate-100 pb-6 mb-8">
                        <div className="flex items-center gap-4">
                            <div className="h-16 w-16 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                                <span className="font-black text-2xl">Rx</span>
                            </div>
                            <div>
                                <h1 className="text-3xl font-black tracking-tight text-slate-900">PRESCRIPTION</h1>
                                <p className="text-sm font-semibold text-slate-500 font-mono uppercase tracking-wider">#{prescription.id.substring(0, 8).toUpperCase()}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <h2 className="text-xl font-black text-slate-900">Cloud HMS Health</h2>
                            <p className="text-sm text-slate-500 font-medium">Professional Clinical Network</p>
                            <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-bold">Registration: 2025/HMS/789</p>
                        </div>
                    </div>

                    {/* Patient Info Card */}
                    <div className="grid grid-cols-2 gap-8 mb-8 bg-slate-50 p-8 rounded-2xl border border-slate-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                            <User className="h-24 w-24" />
                        </div>
                        <div className="relative z-10">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Patient Details</p>
                            <p className="text-2xl font-black text-slate-900 mb-1">{prescription.hms_patient?.first_name} {prescription.hms_patient?.last_name}</p>
                            <div className="flex gap-4 text-sm font-bold text-slate-600">
                                <span>{prescription.hms_patient?.gender}</span>
                                <span className="text-slate-300">|</span>
                                <span>{prescription.hms_patient?.age ? `${prescription.hms_patient.age} Years` : 'N/A'}</span>
                            </div>
                            <p className="text-xs font-mono text-slate-400 mt-2">UHID: {prescription.hms_patient?.patient_number || 'N/A'}</p>
                        </div>
                        <div className="text-right flex flex-col justify-end relative z-10">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Date of Visit</p>
                            <p className="text-xl font-bold text-slate-900">{new Date(prescription.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            <p className="text-xs text-slate-400 mt-1">{new Date(prescription.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                    </div>

                    {/* Clinical Summary Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
                        {prescription.vitals && (
                            <div className="bg-white border-l-4 border-emerald-500 pl-4 py-1">
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Clinical Vitals</h3>
                                <p className="text-base font-bold text-slate-800 leading-relaxed whitespace-pre-wrap">{prescription.vitals}</p>
                            </div>
                        )}
                        {prescription.diagnosis && (
                            <div className="bg-white border-l-4 border-blue-500 pl-4 py-1">
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Primary Diagnosis</h3>
                                <p className="text-base font-bold text-slate-900 leading-relaxed whitespace-pre-wrap">{prescription.diagnosis}</p>
                            </div>
                        )}
                        {prescription.complaint && (
                            <div className="col-span-2 border-t border-dashed border-slate-200 pt-6">
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Chief Complaints & History</h3>
                                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{prescription.complaint}</p>
                            </div>
                        )}
                    </div>

                    {/* Prescription Table */}
                    <div className="mb-16">
                        <div className="flex items-center gap-3 mb-6 border-b-2 border-slate-900 pb-2">
                            <div className="h-6 w-6 bg-slate-900 rounded-md flex items-center justify-center text-white text-[10px] font-bold">Rx</div>
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">Medication Schedule</h3>
                        </div>
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-900 text-[10px] text-slate-200 uppercase tracking-widest">
                                    <th className="px-6 py-4 rounded-tl-xl">Medicine Name & Formulation</th>
                                    <th className="px-6 py-4">Dosage Plan</th>
                                    <th className="px-6 py-4">Duration</th>
                                    <th className="px-6 py-4 text-right rounded-tr-xl">Total Qty</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 border-x border-b border-slate-100 rounded-b-xl">
                                {prescription.prescription_items.map((item: any, idx: number) => (
                                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-5">
                                            <p className="font-black text-base text-slate-900">{item.hms_product?.name || 'Unknown Medicine'}</p>
                                            <p className="text-xs text-slate-400 font-medium mt-1">Generic: {item.hms_product?.generic_name || 'Pharmacological Grade'}</p>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono text-base font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-100">
                                                    {item.morning}-{item.afternoon}-{item.evening}-{item.night}
                                                </span>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase ml-2 tracking-tighter">M - A - E - N</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <p className="text-sm font-black text-slate-700">{item.days} <span className="text-slate-400 font-bold uppercase text-[10px]">Days</span></p>
                                        </td>
                                        <td className="px-6 py-5 text-right font-black text-lg text-slate-900">
                                            {(item.morning + item.afternoon + item.evening + item.night) * item.days}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Signatures & Footer Component */}
                    <div className="mt-24 grid grid-cols-2 gap-12">
                        <div className="space-y-4">
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Instructions</h3>
                                <ul className="text-[10px] text-slate-500 space-y-1 font-medium list-disc ml-4">
                                    <li>Take medicines at scheduled times.</li>
                                    <li>In case of allergy, stop medicine and contact clinic.</li>
                                    <li>Follow up as advised by the consultant.</li>
                                </ul>
                            </div>
                        </div>
                        <div className="flex flex-col items-center justify-end">
                            <div className="h-20 w-48 border-b-2 border-slate-900 border-dashed mb-4 flex items-center justify-center italic text-slate-300">
                                digital signature encrypted
                            </div>
                            <p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Consultant In-Charge</p>
                            <p className="text-[10px] text-slate-400 font-bold">MCI Reg: 2024/09/2341</p>
                        </div>
                    </div>

                    <div className="mt-12 pt-8 border-t border-slate-100 text-center">
                        <p className="text-[9px] text-slate-300 font-mono uppercase tracking-[0.5em]">This is an authenticated electronic prescription valid for pharmacies</p>
                    </div>
                </div>

                <script dangerouslySetInnerHTML={{ __html: `setTimeout(() => { if(!window.location.search.includes('no-auto')) window.print() }, 1000)` }} />
            </div>
        );
    }

    // --- Standard Invoice Print View ---
    const invoice = await prisma.hms_invoice.findUnique({
        where: {
            id,
            company_id: session.user.companyId
        },
        include: {
            hms_patient: true,
            hms_invoice_lines: true,
            hms_invoice_payments: true
        }
    });

    if (!invoice) return notFound();

    return (
        <div className="min-h-screen bg-white p-8 sm:p-12 font-sans text-slate-900" id="invoice-print-area">
            {/* Header */}
            <div className="flex justify-between items-start border-b-2 border-slate-100 pb-8 mb-8">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                        <Receipt className="h-7 w-7" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">TAX INVOICE</h1>
                        <p className="text-sm font-semibold text-slate-500 font-mono uppercase tracking-wider">#{invoice.invoice_number}</p>
                    </div>
                </div>
                <div className="text-right">
                    <h2 className="text-lg font-bold text-slate-800">Hospital Management System</h2>
                    <p className="text-sm text-slate-500">123 Health Street, Clinic Tower</p>
                    <p className="text-sm text-slate-500">+91 99999 88888 | contact@hms.com</p>
                </div>
            </div>

            {/* Meta Info */}
            <div className="grid grid-cols-2 gap-12 mb-10">
                <div className="space-y-4">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <User className="h-3 w-3" /> Bill To
                    </h3>
                    <div>
                        <p className="text-lg font-bold text-slate-900">{invoice.hms_patient?.first_name} {invoice.hms_patient?.last_name}</p>
                        <p className="text-sm text-slate-600">Patient ID: {invoice.hms_patient?.patient_number || 'N/A'}</p>
                        <p className="text-sm text-slate-600">Contact: {((invoice.hms_patient?.contact as any)?.phone) || 'N/A'}</p>
                        {(invoice.hms_patient?.metadata as any)?.registration_expiry && (
                            <p className="text-sm font-bold text-red-600 mt-1">
                                Registration Valid Till: {new Date((invoice.hms_patient?.metadata as any).registration_expiry).toLocaleDateString()}
                            </p>
                        )}
                    </div>
                </div>
                <div className="space-y-4 text-right">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 justify-end">
                        <Calendar className="h-3 w-3" /> Details
                    </h3>
                    <div className="space-y-1 text-sm">
                        <div className="flex justify-end gap-4">
                            <span className="text-slate-500">Invoice Date:</span>
                            <span className="font-semibold text-slate-800">{invoice.invoice_date ? new Date(invoice.invoice_date).toLocaleDateString() : new Date(invoice.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-end gap-4">
                            <span className="text-slate-500">Due Date:</span>
                            <span className="font-semibold text-slate-800">{invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : 'Immediate'}</span>
                        </div>
                        <div className="flex justify-end gap-4">
                            <span className="text-slate-500">Status:</span>
                            <span className={`font-bold px-2 py-0.5 rounded-full text-[10px] uppercase ${invoice.status === 'paid' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-50 text-slate-600 border border-slate-200'}`}>
                                {invoice.status}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="mb-10 overflow-hidden border border-slate-100 rounded-xl shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-4">#</th>
                            <th className="px-6 py-4">Description</th>
                            <th className="px-6 py-4 text-right">Qty</th>
                            <th className="px-6 py-4 text-right">Rate</th>
                            <th className="px-6 py-4 text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 text-sm">
                        {invoice.hms_invoice_lines.map((item, idx) => (
                            <tr key={item.id} className="text-slate-700">
                                <td className="px-6 py-4 font-medium text-slate-400">{idx + 1}</td>
                                <td className="px-6 py-4">
                                    <p className="font-bold text-slate-900">{item.description}</p>
                                    <p className="text-xs text-slate-500">{item.uom}</p>
                                </td>
                                <td className="px-6 py-4 text-right">{Number(item.quantity)}</td>
                                <td className="px-6 py-4 text-right">₹{Number(item.unit_price).toFixed(2)}</td>
                                <td className="px-6 py-4 text-right font-bold text-slate-900">₹{Number(item.net_amount).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end">
                <div className="w-80 space-y-3">
                    <div className="flex justify-between items-center text-sm font-medium">
                        <span className="text-slate-500">Subtotal</span>
                        <span className="text-slate-900">₹{Number(invoice.subtotal).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-medium">
                        <span className="text-slate-500">Tax Total</span>
                        <span className="text-indigo-600">₹{Number(invoice.total_tax).toFixed(2)}</span>
                    </div>
                    {Number(invoice.total_discount) > 0 && (
                        <div className="flex justify-between items-center text-sm font-medium">
                            <span className="text-slate-500">Discount</span>
                            <span className="text-red-500">-₹{Number(invoice.total_discount).toFixed(2)}</span>
                        </div>
                    )}
                    <div className="flex justify-between items-center pt-3 border-t-2 border-slate-100">
                        <span className="text-lg font-bold text-slate-900 uppercase">Grand Total</span>
                        <span className="text-2xl font-black text-slate-900 tracking-tighter">₹{Number(invoice.total).toFixed(2)}</span>
                    </div>

                    <div className="pt-6">
                        <div className="bg-slate-900 text-white rounded-xl p-4 shadow-lg">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Amount Paid</span>
                                <span className="text-lg font-black text-emerald-400">₹{Number(invoice.total_paid).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center bg-white/10 rounded-lg px-2 py-1 mt-2">
                                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Balance Due</span>
                                <span className="text-xs font-bold text-white tracking-widest">₹{Number(invoice.outstanding_amount).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-20 pt-10 border-t border-slate-100 text-center text-slate-400 text-xs">
                <p className="mb-2 font-semibold text-slate-500">THANK YOU FOR YOUR TRUST</p>
                <p>This is a computer-generated tax invoice and does not require a physical signature.</p>
                <p className="mt-4 text-[10px] font-mono opacity-50 uppercase tracking-tighter italic">Generated by Cloud HMS Enterprise ERP | {new Date().toISOString()}</p>
            </div>

            {/* Print trigger */}
            <script dangerouslySetInnerHTML={{ __html: `setTimeout(() => window.print(), 500)` }} />
        </div>
    )
}
