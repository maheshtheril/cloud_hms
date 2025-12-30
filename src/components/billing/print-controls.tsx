'use client'

import { Receipt, X } from "lucide-react"

export function PrintControls() {
    return (
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
    )
}
