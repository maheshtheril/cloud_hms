'use client'

import { useState, useEffect } from 'react'
import { getSyncStatus } from '@/app/actions/infra'
import { Cloud, CloudOff, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react'

export function SyncHealthIndicator() {
    const [status, setStatus] = useState<'loading' | 'online' | 'disconnected' | 'error'>('loading')
    const [lastChecked, setLastChecked] = useState<Date>(new Date())

    const checkStatus = async () => {
        const res = await getSyncStatus()
        if (res.success) {
            setStatus(res.status as any)
        } else {
            setStatus('error')
        }
        setLastChecked(new Date())
    }

    useEffect(() => {
        checkStatus()
        const interval = setInterval(checkStatus, 30000) // Check every 30s
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="flex items-center gap-3 px-4 py-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
            <div className="relative">
                {status === 'online' ? (
                    <div className="bg-emerald-500/10 p-2 rounded-xl text-emerald-600">
                        <Cloud className="h-5 w-5 animate-pulse" />
                        <CheckCircle2 className="h-3 w-3 absolute -bottom-1 -right-1 text-emerald-500 bg-white dark:bg-slate-900 rounded-full" />
                    </div>
                ) : status === 'disconnected' ? (
                    <div className="bg-amber-500/10 p-2 rounded-xl text-amber-600">
                        <CloudOff className="h-5 w-5" />
                        <AlertCircle className="h-3 w-3 absolute -bottom-1 -right-1 text-amber-500 bg-white dark:bg-slate-900 rounded-full" />
                    </div>
                ) : status === 'error' ? (
                    <div className="bg-red-500/10 p-2 rounded-xl text-red-600">
                        <AlertCircle className="h-5 w-5" />
                    </div>
                ) : (
                    <div className="bg-slate-100 p-2 rounded-xl text-slate-400">
                        <RefreshCw className="h-5 w-5 animate-spin" />
                    </div>
                )}
            </div>

            <div className="flex flex-col">
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Cloud Sync Status</span>
                    <div className={`h-1.5 w-1.5 rounded-full ${status === 'online' ? 'bg-emerald-500' : status === 'disconnected' ? 'bg-amber-500' : 'bg-red-500'}`} />
                </div>
                <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">
                        {status === 'online' ? 'Synchronized' : status === 'disconnected' ? 'Offline' : status === 'error' ? 'Engine Error' : 'Checking...'}
                    </p>
                    <span className="text-[8px] font-mono text-slate-400 uppercase">
                        {lastChecked.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>
            </div>

            <button
                onClick={() => { setStatus('loading'); checkStatus(); }}
                className="ml-2 p-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-indigo-600 transition-all"
            >
                <RefreshCw className={`h-3.5 w-3.5 ${status === 'loading' ? 'animate-spin' : ''}`} />
            </button>
        </div>
    )
}
