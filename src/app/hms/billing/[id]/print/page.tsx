import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { notFound } from "next/navigation"
import { Receipt, Building2, User, Calendar, CreditCard } from "lucide-react"

export default async function PrintInvoicePage({ params }: { params: Promise<{ id: string }> }) {
    const session = await auth();
    const { id } = await params;

    if (!session?.user?.companyId) return <div>Unauthorized</div>;

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
            <script dangerouslySetInnerHTML={{ __html: `window.print()` }} />
        </div>
    )
}
