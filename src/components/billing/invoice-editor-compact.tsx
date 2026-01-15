"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Plus,
  Trash2,
  Search,
  Save,
  FileText,
  Calendar,
  User,
  DollarSign,
  Receipt,
  X,
  Loader2,
  CreditCard,
  Banknote,
  Smartphone,
  Landmark,
  MessageCircle,
  Maximize2,
  Minimize2,
  Check,
  Send,
  CheckCircle2,
  QrCode,
  Clock,
  ArrowRight,
} from "lucide-react";
import {
  createInvoice,
  updateInvoice,
  getPatientBalance,
  createQuickPatient,
} from "@/app/actions/billing";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";

export function CompactInvoiceEditor({
  patients,
  billableItems,
  taxConfig,
  initialPatientId,
  initialMedicines,
  appointmentId,
  initialInvoice,
  onClose,
}: {
  patients: any[];
  billableItems: any[];
  taxConfig: { defaultTax: any; taxRates: any[] };
  initialPatientId?: string;
  initialMedicines?: any[];
  appointmentId?: string;
  initialInvoice?: any;
  onClose?: () => void;
}) {
  interface Payment {
    method: "cash" | "card" | "upi" | "bank_transfer" | "advance";
    amount: number;
    reference?: string;
  }

  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isQuickPatientOpen, setIsQuickPatientOpen] = useState(false);
  const [quickPatientName, setQuickPatientName] = useState("");
  const [quickPatientPhone, setQuickPatientPhone] = useState("");
  const [isCreatingPatient, setIsCreatingPatient] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isWalkIn, setIsWalkIn] = useState(false);
  const [walkInName, setWalkInName] = useState("");
  const [walkInPhone, setWalkInPhone] = useState("");

  const urlPatientId = searchParams.get("patientId");
  const urlMedicines = searchParams.get("medicines");
  const urlAppointmentId = searchParams.get("appointmentId");

  const [selectedPatientId, setSelectedPatientId] = useState(
    initialInvoice?.patient_id || initialPatientId || urlPatientId || "",
  );
  const [date, setDate] = useState(
    initialInvoice?.invoice_date
      ? new Date(initialInvoice.invoice_date).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
  );

  const defaultTaxId = taxConfig.defaultTax?.id || "";

  const [lines, setLines] = useState<any[]>(
    initialInvoice?.hms_invoice_lines
      ? initialInvoice.hms_invoice_lines
          .filter((l: any) => l.description || l.product_id)
          .map((l: any) => ({
            id: l.id || Date.now() + Math.random(),
            product_id: l.product_id || "",
            description: l.description,
            quantity: Number(l.quantity),
            uom: l.uom || "PCS",
            unit_price: Number(l.unit_price),
            tax_rate_id: l.tax_rate_id,
            tax_amount: Number(l.tax_amount),
            discount_amount: Number(l.discount_amount),
          }))
      : [
          {
            id: 1,
            product_id: "",
            description: "",
            quantity: 1,
            uom: "PCS",
            unit_price: 0,
            tax_rate_id: defaultTaxId,
            tax_amount: 0,
            discount_amount: 0,
          },
        ],
  );

  const [payments, setPayments] = useState<Payment[]>([
    { method: "cash", amount: 0, reference: "" },
  ]);
  const [globalDiscount, setGlobalDiscount] = useState(
    Number(initialInvoice?.total_discount || 0),
  );

  const subtotal = lines.reduce(
    (sum, line) =>
      sum + (line.quantity * line.unit_price - (line.discount_amount || 0)),
    0,
  );
  const totalTax = lines.reduce((sum, line) => sum + (line.tax_amount || 0), 0);
  const grandTotal = Math.max(0, subtotal + totalTax - globalDiscount);
  const totalPaid = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const balanceDue = Math.max(0, grandTotal - totalPaid);
  const changeAmount = Math.max(0, totalPaid - grandTotal);

  useEffect(() => {
    if (selectedPatientId) setIsWalkIn(false);
  }, [selectedPatientId]);

  const handleQuickPatientCreate = async () => {
    if (!quickPatientName || !quickPatientPhone) return;
    setIsCreatingPatient(true);
    const res = (await createQuickPatient(
      quickPatientName,
      quickPatientPhone,
    )) as any;
    if (res.success && res.data) {
      setSelectedPatientId(res.data.id);
      setIsQuickPatientOpen(false);
    }
    setIsCreatingPatient(false);
  };

  const handleAddItem = () => {
    setLines([
      ...lines,
      {
        id: Date.now(),
        product_id: "",
        description: "",
        quantity: 1,
        uom: "PCS",
        unit_price: 0,
        tax_rate_id: defaultTaxId,
        tax_amount: 0,
        discount_amount: 0,
      },
    ]);
  };

  const handleRemoveItem = (id: number) => {
    if (lines.length > 1) setLines(lines.filter((l) => l.id !== id));
  };

  const updateLine = (id: number, field: string, value: any) => {
    setLines(
      lines.map((line) => {
        if (line.id === id) {
          const updated = { ...line, [field]: value };
          if (field === "product_id") {
            const product = billableItems.find((i) => i.id === value);
            if (product) {
              updated.description = product.description || product.label;
              updated.unit_price = product.price || 0;
              updated.tax_rate_id = product.categoryTaxId || defaultTaxId;
            }
          }
          const taxRateObj = taxConfig.taxRates.find(
            (t: any) => t.id === updated.tax_rate_id,
          );
          const rate = taxRateObj ? taxRateObj.rate : 0;
          updated.tax_amount =
            (updated.quantity *
              (updated.unit_price -
                (updated.discount_amount / updated.quantity || 0)) *
              rate) /
            100;
          return updated;
        }
        return line;
      }),
    );
  };

  const handleSave = async (status: "draft" | "posted" | "paid") => {
    if (loading) return;
    setLoading(true);
    const payload = {
      patient_id: isWalkIn ? null : selectedPatientId,
      appointment_id: appointmentId || urlAppointmentId,
      date,
      line_items: lines.filter((l) => l.description || l.product_id),
      status,
      total_discount: globalDiscount,
      payments: payments.filter((p) => p.amount > 0),
      billing_metadata: isWalkIn
        ? {
            is_walk_in: true,
            patient_name: walkInName,
            patient_phone: walkInPhone,
          }
        : {},
    };
    const res = await (initialInvoice?.id
      ? updateInvoice(initialInvoice.id, payload)
      : createInvoice(payload));
    if (res.success) {
      toast({ title: "Success", description: "Invoiced processed." });
      if (onClose) onClose();
      else router.replace(`/hms/billing/${res.data?.id}`);
    } else {
      setLoading(false);
      toast({ title: "Error", description: res.error, variant: "destructive" });
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm ${isMaximized ? "p-0" : "p-4"}`}
      onClick={() => (onClose ? onClose() : router.back())}
    >
      <div
        className={`relative flex flex-col bg-white dark:bg-slate-900 shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 transition-all ${isMaximized ? "w-full h-full" : "w-full max-w-[95vw] h-[90vh] rounded-2xl"}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 shrink-0">
          <div className="flex items-center gap-4">
            <div className="bg-indigo-600 p-2.5 rounded-xl text-white shadow-lg shadow-indigo-500/20">
              <Receipt className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-800 dark:text-slate-100 tracking-tight">
                Billing Terminal
              </h2>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                Enterprise Edition v4.2
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setIsWalkIn(false)}
                className={`px-4 py-1.5 text-[11px] font-black rounded-lg transition-all ${!isWalkIn ? "bg-white dark:bg-slate-700 text-indigo-600 shadow-sm" : "text-slate-500"}`}
              >
                REGISTERED
              </button>
              <button
                onClick={() => {
                  setIsWalkIn(true);
                  setSelectedPatientId("");
                }}
                className={`px-4 py-1.5 text-[11px] font-black rounded-lg transition-all ${isWalkIn ? "bg-white dark:bg-slate-700 text-pink-600 shadow-sm" : "text-slate-500"}`}
              >
                WALK-IN
              </button>
            </div>

            <div className="w-80 h-10">
              {isWalkIn ? (
                <div className="flex gap-2">
                  <Input
                    value={walkInPhone}
                    onChange={(e) => setWalkInPhone(e.target.value)}
                    placeholder="Phone..."
                    className="h-10 text-xs bg-white dark:bg-slate-950"
                  />
                  <Input
                    value={walkInName}
                    onChange={(e) => setWalkInName(e.target.value)}
                    placeholder="Full Name..."
                    className="h-10 text-xs bg-white dark:bg-slate-950"
                  />
                </div>
              ) : (
                <SearchableSelect
                  value={selectedPatientId}
                  onChange={(id) => setSelectedPatientId(id || "")}
                  onCreate={(q) => {
                    setQuickPatientName(q);
                    setIsQuickPatientOpen(true);
                    return Promise.resolve(null);
                  }}
                  onSearch={async (q) =>
                    patients
                      .filter((p) =>
                        p.first_name.toLowerCase().includes(q.toLowerCase()),
                      )
                      .map((p) => ({
                        id: p.id,
                        label: `${p.first_name} ${p.last_name}`,
                        subLabel: p.patient_number,
                      }))
                  }
                  placeholder="Search Patient..."
                />
              )}
            </div>

            <button
              onClick={() => setIsMaximized(!isMaximized)}
              className="p-2 text-slate-400 hover:text-slate-600"
            >
              <Maximize2 className="h-5 w-5" />
            </button>
            <button
              onClick={() => (onClose ? onClose() : router.back())}
              className="p-2 text-slate-400 hover:text-red-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Main Table Area */}
        <div className="flex-1 overflow-auto p-8 bg-slate-50/30 dark:bg-slate-900/10">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white dark:bg-slate-950 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-900/50 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 border-b border-slate-100 dark:border-slate-800">
                  <tr>
                    <th className="px-8 py-5">Service Description</th>
                    <th className="px-4 py-5 w-24">Qty</th>
                    <th className="px-4 py-5 w-32">Unit Price</th>
                    <th className="px-4 py-5 w-40">Tax</th>
                    <th className="px-8 py-5 w-32 text-right">Total</th>
                    <th className="px-4 py-5 w-12"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-900">
                  {lines.map((line) => (
                    <tr
                      key={line.id}
                      className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors"
                    >
                      <td className="px-8 py-4">
                        <SearchableSelect
                          value={line.product_id}
                          onChange={(v) => updateLine(line.id, "product_id", v)}
                          onSearch={async (q) =>
                            billableItems
                              .filter((i) =>
                                i.name.toLowerCase().includes(q.toLowerCase()),
                              )
                              .map((i) => ({
                                id: i.id,
                                label: i.name,
                                subLabel: `₹${i.price}`,
                              }))
                          }
                          placeholder="Select Service..."
                        />
                      </td>
                      <td className="px-4 py-4">
                        <Input
                          type="number"
                          value={line.quantity}
                          onChange={(e) =>
                            updateLine(
                              line.id,
                              "quantity",
                              parseFloat(e.target.value) || 0,
                            )
                          }
                          className="h-10 text-xs font-bold bg-transparent"
                        />
                      </td>
                      <td className="px-4 py-4">
                        <Input
                          type="number"
                          value={line.unit_price}
                          onChange={(e) =>
                            updateLine(
                              line.id,
                              "unit_price",
                              parseFloat(e.target.value) || 0,
                            )
                          }
                          className="h-10 text-xs font-mono bg-transparent"
                        />
                      </td>
                      <td className="px-4 py-4">
                        <select
                          className="w-full h-10 bg-transparent border border-slate-200 dark:border-slate-800 rounded-xl px-3 text-[11px] font-bold outline-none"
                          value={line.tax_rate_id || ""}
                          onChange={(e) =>
                            updateLine(line.id, "tax_rate_id", e.target.value)
                          }
                        >
                          <option value="">No Tax</option>
                          {taxConfig.taxRates.map((t: any) => (
                            <option key={t.id} value={t.id}>
                              {t.name} ({t.rate}%)
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-8 py-4 text-right font-black text-slate-800 dark:text-slate-100">
                        ₹{(line.quantity * line.unit_price).toFixed(2)}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <button
                          onClick={() => handleRemoveItem(line.id)}
                          className="text-slate-300 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="p-6 bg-slate-50/30 dark:bg-slate-900/30 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={handleAddItem}
                  className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 hover:text-indigo-700 transition-all"
                >
                  <Plus className="h-5 w-5" /> Add New Row
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <div className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 p-8 shadow-[0_-10px_40px_rgba(0,0,0,0.03)]">
          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-10">
            <div className="flex gap-12">
              <div className="flex gap-4 items-center">
                <div className="p-4 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl">
                  <Receipt className="h-7 w-7 text-indigo-600" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">
                    Items To Bill
                  </p>
                  <p className="text-2xl font-black text-slate-900 dark:text-white italic">
                    {lines.filter((l) => l.description || l.product_id).length}{" "}
                    Services
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-center">
                <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl">
                  <DollarSign className="h-7 w-7 text-emerald-600" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">
                    Net Payable
                  </p>
                  <p className="text-4xl font-black text-emerald-600 tracking-tighter italic">
                    ₹{grandTotal.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <button
                onClick={() => setIsPaymentModalOpen(true)}
                disabled={loading || lines.length === 0}
                className="px-10 py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[2rem] shadow-2xl flex items-center justify-center gap-3 transition-all hover:-translate-y-1 active:scale-95 text-lg font-black italic uppercase tracking-tight"
              >
                Collect Funds <ArrowRight className="h-6 w-6" />
              </button>
              <div className="flex gap-3">
                <button
                  onClick={() => handleSave("draft")}
                  disabled={loading}
                  className="px-8 py-5 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all"
                >
                  Draft
                </button>
                <button
                  onClick={() => handleSave("posted")}
                  disabled={loading}
                  className="px-8 py-5 bg-slate-100 dark:bg-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 hover:bg-slate-200 transition-all"
                >
                  Credit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ZENITH SETTLE TERMINAL */}
      <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-[#0f172a] border-none shadow-[0_50px_100px_rgba(0,0,0,0.8)] rounded-[3rem] ring-1 ring-white/10 z-[80]">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-12 bg-slate-900/50 border-r border-white/5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-4 mb-12">
                  <div className="bg-indigo-500/20 p-4 rounded-2xl border border-indigo-500/30">
                    <Receipt className="h-7 w-7 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-black tracking-widest text-xs uppercase opacity-40">
                      System
                    </h3>
                    <p className="text-indigo-400 font-bold italic">
                      Zenith Interface v4.0
                    </p>
                  </div>
                </div>
                <div className="space-y-10">
                  <div className="flex flex-col border-b border-white/10 pb-8">
                    <span className="text-slate-500 font-black uppercase tracking-[0.4em] text-[9px] mb-2">
                      Recipient
                    </span>
                    <span className="text-white font-black text-3xl tracking-tight">
                      {isWalkIn
                        ? walkInName
                        : patients.find((p) => p.id === selectedPatientId)
                            ?.name || "Guest"}
                    </span>
                  </div>
                  <div className="space-y-4">
                    <span className="text-slate-500 font-black uppercase tracking-[0.4em] text-[9px]">
                      Value Ledger
                    </span>
                    <div className="space-y-3">
                      {lines
                        .filter((l) => l.description || l.product_id)
                        .slice(0, 4)
                        .map((l, i) => (
                          <div
                            key={i}
                            className="flex justify-between text-xs font-black"
                          >
                            <span className="text-slate-400 uppercase tracking-widest">
                              {l.description}{" "}
                              <span className="opacity-30">x{l.quantity}</span>
                            </span>
                            <span className="text-slate-200">
                              ₹{(l.quantity * l.unit_price).toFixed(2)}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-16">
                <p className="text-slate-600 font-black uppercase tracking-[0.6em] text-[10px] mb-4">
                  Net Outstanding
                </p>
                <div className="flex items-baseline gap-4">
                  <span className="text-8xl font-black text-white tracking-tighter italic">
                    ₹{grandTotal.toFixed(2)}
                  </span>
                  <span className="text-green-500 font-black text-xs animate-pulse">
                    ● LIVE
                  </span>
                </div>
              </div>
            </div>
            <div className="p-12 flex flex-col gap-10 bg-[#0c1222]">
              <div className="text-center">
                <h2 className="text-4xl font-black text-white tracking-tight mb-2 italic">
                  SETTLE NOW
                </h2>
                <div className="h-1 w-16 bg-indigo-600 mx-auto rounded-full"></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    id: "cash",
                    label: "CASH",
                    icon: Banknote,
                    color: "text-emerald-400",
                  },
                  {
                    id: "upi",
                    label: "UPI / QR",
                    icon: QrCode,
                    color: "text-indigo-400",
                  },
                  {
                    id: "card",
                    label: "CARD",
                    icon: CreditCard,
                    color: "text-blue-400",
                  },
                  {
                    id: "bank_transfer",
                    label: "DEBT",
                    icon: Clock,
                    color: "text-amber-400",
                  },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      if (m.id === "bank_transfer") {
                        setIsPaymentModalOpen(false);
                        handleSave("posted");
                      } else {
                        setPayments([
                          { method: m.id as any, amount: grandTotal },
                        ]);
                        setIsPaymentModalOpen(false);
                        handleSave("paid");
                      }
                    }}
                    className="group relative h-40 bg-slate-900 border border-white/5 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 transition-all hover:-translate-y-2 hover:border-white/20 active:scale-95"
                  >
                    <div className="p-4 rounded-3xl bg-slate-950 border border-white/10 group-hover:border-current transition-all">
                      <m.icon className={`h-8 w-8 ${m.color}`} />
                    </div>
                    <span className="block text-xs font-black tracking-widest text-white">
                      {m.label}
                    </span>
                  </button>
                ))}
              </div>
              <div className="bg-slate-950 border border-white/5 p-10 rounded-[2.5rem] mt-auto shadow-inner relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-5">
                  <DollarSign className="h-20 w-20 text-white" />
                </div>
                <span className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] mb-6">
                  Adjustment Entry
                </span>
                <div className="flex gap-4 items-center relative z-10">
                  <div className="flex-1 relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-700 font-black text-2xl italic">
                      ₹
                    </span>
                    <input
                      type="number"
                      className="w-full bg-[#0c1222] border-2 border-slate-900 h-16 rounded-3xl pl-12 pr-6 text-white font-black text-3xl focus:border-indigo-600 outline-none transition-all"
                      value={payments[0]?.amount || ""}
                      onChange={(e) =>
                        setPayments([
                          {
                            ...payments[0],
                            amount: parseFloat(e.target.value) || 0,
                          },
                        ])
                      }
                      placeholder="0.00"
                    />
                  </div>
                  <button
                    onClick={() => {
                      setIsPaymentModalOpen(false);
                      handleSave("paid");
                    }}
                    disabled={loading || !payments[0]?.amount}
                    className="bg-indigo-600 hover:bg-indigo-500 h-16 w-16 rounded-3xl text-white flex items-center justify-center transition-all active:scale-90 shadow-xl shadow-indigo-500/20"
                  >
                    <ArrowRight className="h-8 w-8" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* QUICK PATIENT */}
      <Dialog open={isQuickPatientOpen} onOpenChange={setIsQuickPatientOpen}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-slate-900 rounded-[2rem] border-none p-10">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black italic tracking-tight">
              Quick Registration
            </DialogTitle>
            <DialogDescription className="text-xs font-medium text-slate-500">
              Add basic details to proceed with billing for {quickPatientName}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Mobile Number
              </Label>
              <Input
                value={quickPatientPhone}
                onChange={(e) => setQuickPatientPhone(e.target.value)}
                className="h-12 border-slate-100 dark:border-slate-800 rounded-xl"
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setIsQuickPatientOpen(false)}
              className="text-[10px] font-black uppercase tracking-widest"
            >
              Cancel
            </Button>
            <Button
              onClick={handleQuickPatientCreate}
              disabled={!quickPatientPhone || isCreatingPatient}
              className="bg-indigo-600 hover:bg-indigo-700 h-12 rounded-xl text-xs font-black uppercase tracking-widest px-8 shadow-xl shadow-indigo-500/20"
            >
              {isCreatingPatient ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Verify & Use"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
