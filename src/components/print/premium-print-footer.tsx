interface PremiumPrintFooterProps {
    note?: string;
    showSignature?: boolean;
    signatureLabel?: string;
    systemInfo?: string;
}

export function PremiumPrintFooter({
    note = "Thank you for choosing our services. We value your trust.",
    showSignature = true,
    signatureLabel = "Authorized Signatory",
    systemInfo = "HMS Enterprise Intelligence"
}: PremiumPrintFooterProps) {
    return (
        <div className="mt-auto pt-12">
            <div className="grid grid-cols-2 gap-12 mb-12">
                <div className="p-6 rounded-2xl border border-slate-200 flex flex-col justify-center">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Terms & Conditions</h3>
                    <p className="text-[10px] text-slate-500 leading-relaxed italic font-medium">
                        {note}
                    </p>
                </div>

                {showSignature && (
                    <div className="flex flex-col items-center justify-end">
                        <div className="h-20 w-56 border-b border-slate-200 border-dashed mb-4 flex items-center justify-center italic text-slate-300 text-[9px] uppercase tracking-widest">
                            Authorized Seal / Signature
                        </div>
                        <p className="text-[11px] font-bold text-slate-800 uppercase tracking-[0.2em]">{signatureLabel}</p>
                    </div>
                )}
            </div>

            <div className="pt-8 border-t border-slate-100 flex justify-between items-center text-[9px] text-slate-300 font-bold uppercase tracking-[0.3em]">
                <span>{systemInfo}</span>
                <span>{new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
            </div>
        </div>
    );
}
