'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UploadCloud, FileSpreadsheet, CheckCircle2, AlertCircle, ArrowRight, Table, Database } from 'lucide-react'
import { FileUpload } from '@/components/ui/file-upload'
import { motion, AnimatePresence } from 'framer-motion'

// Placeholder for Step 2: Mapping
const MappingStep = ({ file, onNext, onBack }: { file: string, onNext: () => void, onBack: () => void }) => (
    <div className="space-y-6">
        <div className="bg-slate-50 p-4 rounded-lg border flex items-center gap-3">
            <FileSpreadsheet className="h-8 w-8 text-green-600" />
            <div>
                <p className="font-medium text-slate-900">File Selected</p>
                <p className="text-sm text-slate-500 truncate max-w-md">{file}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onBack} className="ml-auto text-red-500 hover:text-red-700 hover:bg-red-50">
                Change File
            </Button>
        </div>

        <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                    <Table className="h-4 w-4" /> Map Columns
                </h3>
                <p className="text-sm text-slate-500">
                    Match the columns from your uploaded file to the system fields. We've auto-detected some for you.
                </p>

                {/* MOCK MAPPING UI */}
                <div className="border rounded-lg overflow-hidden">
                    <div className="bg-slate-100 p-3 grid grid-cols-2 font-medium text-xs text-slate-500 uppercase tracking-wider">
                        <div>CSV Header</div>
                        <div>System Field</div>
                    </div>
                    <div className="divide-y">
                        {['First Name', 'Last Name', 'Email', 'Phone', 'Company'].map((field, i) => (
                            <div key={i} className="p-3 grid grid-cols-2 items-center gap-4 bg-white hover:bg-slate-50 transition-colors">
                                <div className="text-sm font-medium text-slate-700">{field}</div>
                                <div className="flex items-center gap-2 text-sm text-blue-600 font-medium">
                                    <ArrowRight className="h-3 w-3 text-slate-400" />
                                    <span className="bg-blue-50 px-2 py-1 rounded border border-blue-100 w-full">
                                        {field.toLowerCase().replace(' ', '_')}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <Card className="bg-blue-50/50 border-blue-100">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-blue-900">Import Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Total Rows</span>
                            <span className="font-medium">142</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Mapped Fields</span>
                            <span className="font-medium text-green-600">5/5</span>
                        </div>
                    </CardContent>
                </Card>

                <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={onNext}>
                    Start Import <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
        </div>
    </div>
)

export default function ImportLeadsPage() {
    const [step, setStep] = useState(1);
    const [fileUrl, setFileUrl] = useState<string | null>(null);

    return (
        <div className="container mx-auto p-8 max-w-5xl space-y-8">
            <header>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700">
                    Import Lead Data
                </h1>
                <p className="text-slate-500 mt-2 text-lg">
                    Bulk import leads from CSV, Excel, or Google Sheets.
                </p>
            </header>

            {/* Steps Indicator */}
            <div className="flex items-center gap-4 text-sm font-medium">
                <div className={`flex items-center gap-2 ${step >= 1 ? 'text-blue-600' : 'text-slate-400'}`}>
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center border-2 ${step >= 1 ? 'border-blue-600 bg-blue-50' : 'border-slate-200'}`}>1</div>
                    Upload
                </div>
                <div className="h-px w-12 bg-slate-200" />
                <div className={`flex items-center gap-2 ${step >= 2 ? 'text-blue-600' : 'text-slate-400'}`}>
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center border-2 ${step >= 2 ? 'border-blue-600 bg-blue-50' : 'border-slate-200'}`}>2</div>
                    Map Fields
                </div>
                <div className="h-px w-12 bg-slate-200" />
                <div className={`flex items-center gap-2 ${step >= 3 ? 'text-blue-600' : 'text-slate-400'}`}>
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center border-2 ${step >= 3 ? 'border-blue-600 bg-blue-50' : 'border-slate-200'}`}>3</div>
                    Review & Import
                </div>
            </div>

            <Card className="border-slate-200 shadow-sm overflow-hidden">
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="p-8"
                        >
                            <div className="max-w-xl mx-auto text-center space-y-6">
                                <div className="h-16 w-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <CloudUploadIcon className="h-8 w-8" />
                                </div>

                                <h2 className="text-xl font-semibold">Upload your file</h2>
                                <p className="text-slate-500">
                                    Drag and drop your CSV or Excel file here. We'll analyze it and help you map the columns.
                                </p>

                                <FileUpload
                                    label="Drop CSV or Excel file here"
                                    accept=".csv,.xlsx,.xls"
                                    onUploadComplete={(url) => {
                                        setFileUrl(url);
                                        setTimeout(() => setStep(2), 500); // Auto advance for smooth UX
                                    }}
                                />

                                <div className="text-xs text-slate-400 pt-4 flex items-center justify-center gap-6">
                                    <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Auto-header detection</span>
                                    <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Smart field mapping</span>
                                    <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Duplicate check</span>
                                </div>

                                <div className="pt-6 border-t">
                                    <Button variant="outline" size="sm" className="text-slate-500">
                                        Download Sample Template
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="p-6"
                        >
                            {fileUrl && <MappingStep file="leads_import_Q4.csv" onNext={() => setStep(3)} onBack={() => setStep(1)} />}
                        </motion.div>
                    )}

                    {/* Step 3 Placeholder */}
                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="p-12 text-center"
                        >
                            <div className="h-20 w-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                                <Database className="h-10 w-10" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900">Importing Data...</h2>
                            <p className="text-slate-500 mt-2">Processing 142 records. Please wait.</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Card>
        </div>
    )
}

function CloudUploadIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
            <path d="M12 12v9" />
            <path d="m16 16-4-4-4 4" />
        </svg>
    )
}
