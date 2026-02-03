import { ReactNode } from "react";
import { PrintControls } from "@/components/billing/print-controls";

interface PremiumPrintWrapperProps {
    children: ReactNode;
}

export function PremiumPrintWrapper({ children }: PremiumPrintWrapperProps) {
    return (
        <div className="min-h-screen bg-white font-sans text-slate-900 overflow-visible">
            {/* Print Styles */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    @page {
                        size: A4;
                        margin: 15mm;
                    }
                    body {
                        background-color: white !important;
                        print-color-adjust: exact !important;
                        -webkit-print-color-adjust: exact !important;
                    }
                    .no-print {
                        display: none !important;
                    }
                    #print-area {
                        margin: 0 !important;
                        border: none !important;
                        padding: 0 !important;
                        width: 100% !important;
                        max-width: none !important;
                        box-shadow: none !important;
                    }
                }
                
                #print-area {
                    max-width: 890px;
                    margin: 20px auto;
                    padding: 40px;
                    background: white;
                    min-height: 1000px;
                    display: flex;
                    flex-col: column;
                }

                /* Modern Typography for Prints */
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
                
                .hms-print-container {
                    font-family: 'Inter', sans-serif;
                }
            ` }} />

            <div className="no-print sticky top-0 z-50">
                <PrintControls />
            </div>

            <div id="print-area" className="hms-print-container border border-slate-200 flex flex-col">
                {children}
            </div>

            {/* Auto-print disabled to allow payment interaction first */}
            {/* <script dangerouslySetInnerHTML={{ __html: `setTimeout(() => { if(!window.location.search.includes('no-auto')) window.print() }, 1500)` }} /> */}
        </div>
    );
}
