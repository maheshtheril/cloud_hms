'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Edit2, Zap, Thermometer, Brain, Heart, Activity as ActivityIcon, Loader2, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { motion, AnimatePresence } from 'framer-motion'

export default function PrescriptionMastersPage() {
    const [templates, setTemplates] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [expandedId, setExpandedId] = useState<string | null>(null)

    useEffect(() => {
        fetchTemplates()
    }, [])

    const fetchTemplates = async () => {
        try {
            const res = await fetch('/api/prescriptions/templates')
            const data = await res.json()
            if (data.success) setTemplates(data.templates)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const deleteTemplate = async (id: string) => {
        if (!confirm('Are you sure you want to delete this master protocol?')) return

        try {
            const res = await fetch(`/api/prescriptions/templates/${id}`, {
                method: 'DELETE'
            })
            const data = await res.json()
            if (data.success) {
                setTemplates(templates.filter(t => t.id !== id))
            }
        } catch (error) {
            alert('Failed to delete')
        }
    }

    const getIcon = (name: string) => {
        const lower = name.toLowerCase()
        if (lower.includes('fever') || lower.includes('cold')) return <Thermometer className="h-5 w-5 text-orange-500" />
        if (lower.includes('heart') || lower.includes('tension')) return <Heart className="h-5 w-5 text-red-500" />
        if (lower.includes('brain') || lower.includes('migraine')) return <Brain className="h-5 w-5 text-purple-500" />
        if (lower.includes('diabetes') || lower.includes('sugar')) return <ActivityIcon className="h-5 w-5 text-emerald-500" />
        return <Zap className="h-5 w-5 text-indigo-500" />
    }

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            </div>
        )
    }

    return (
        <div className="p-8 space-y-8 max-w-6xl mx-auto">
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Clinical Protocols</h1>
                <p className="text-slate-500 font-medium">Manage your clinical master data and prescription protocols.</p>
            </div>

            <div className="grid gap-6">
                {templates.length === 0 ? (
                    <Card className="border-dashed border-2 bg-slate-50/50">
                        <CardContent className="flex flex-col items-center py-20 text-center gap-4">
                            <div className="h-16 w-16 bg-white border rounded-2xl flex items-center justify-center shadow-sm">
                                <Zap className="h-8 w-8 text-slate-200" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-lg font-bold text-slate-900">No Protocols Found</p>
                                <p className="text-sm text-slate-500 max-w-xs">Create protocols directly from the Prescription Editor by using the "Save as Master" tool.</p>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    templates.map((template) => (
                        <Card
                            key={template.id}
                            className="group overflow-hidden border-slate-100 hover:border-slate-200 transition-all hover:shadow-lg rounded-3xl"
                        >
                            <CardHeader className="flex flex-row items-center justify-between p-6">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-white transition-colors border border-transparent group-hover:border-slate-100">
                                        {getIcon(template.name)}
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl font-bold text-slate-900">{template.name}</CardTitle>
                                        <CardDescription>{template.medicines.length} Medicines</CardDescription>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setExpandedId(expandedId === template.id ? null : template.id)}
                                        className="rounded-xl"
                                    >
                                        {expandedId === template.id ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => deleteTemplate(template.id)}
                                        className="rounded-xl hover:bg-red-50 hover:text-red-600 transition-colors"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <AnimatePresence>
                                {expandedId === template.id && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden bg-slate-50/50 border-t border-slate-50"
                                    >
                                        <div className="p-8 grid md:grid-cols-2 gap-8">
                                            {/* Findings */}
                                            <div className="space-y-6">
                                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Clinical Findings</h3>
                                                <div className="space-y-4">
                                                    {[
                                                        { label: 'Diagnosis', val: template.diagnosis },
                                                        { label: 'Plan', val: template.plan },
                                                        { label: 'Complaint', val: template.complaint },
                                                        { label: 'Examination', val: template.examination }
                                                    ].filter(f => f.val).map(finding => (
                                                        <div key={finding.label} className="space-y-1.5">
                                                            <label className="text-xs font-bold text-slate-500 uppercase">{finding.label}</label>
                                                            <div className="bg-white p-4 rounded-2xl border border-slate-100 text-sm font-medium text-slate-700 leading-relaxed shadow-sm">
                                                                {finding.val}
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {!template.diagnosis && !template.plan && (
                                                        <p className="text-sm text-slate-400 italic">No clinical findings saved for this protocol.</p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Medicines */}
                                            <div className="space-y-6">
                                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Medicines</h3>
                                                <div className="space-y-3">
                                                    {template.medicines.map((med: any, idx: number) => (
                                                        <div key={idx} className="flex flex-col gap-1 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                                                            <p className="font-bold text-slate-900">{med.name}</p>
                                                            <div className="flex items-center gap-3 text-xs font-bold text-slate-500 uppercase">
                                                                <span className="bg-slate-50 px-2 py-0.5 rounded border border-slate-100">{med.dosage}</span>
                                                                <span>•</span>
                                                                <span>{med.days} Days</span>
                                                                <span>•</span>
                                                                <span className="text-blue-600">{med.timing}</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
