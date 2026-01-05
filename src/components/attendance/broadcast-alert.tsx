'use client'

import { useState, useEffect } from 'react'
import { Megaphone, X, Zap, ShieldAlert, CheckCircle2 } from 'lucide-react'
import { acknowledgeBroadcast, getActiveBroadcasts } from '@/app/actions/broadcast'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'

export function BroadcastAlert() {
    const [broadcasts, setBroadcasts] = useState<any[]>([])
    const [dismissed, setDismissed] = useState<string[]>([])

    useEffect(() => {
        const fetchAlerts = async () => {
            const data = await getActiveBroadcasts()
            setBroadcasts(data)
        }
        fetchAlerts()

        // Poll for new emergency signals every 30 seconds
        const interval = setInterval(fetchAlerts, 30000)
        return () => clearInterval(interval)
    }, [])

    const handleAcknowledge = async (id: string) => {
        await acknowledgeBroadcast(id)
        setDismissed(prev => [...prev, id])
    }

    const activeAlerts = broadcasts.filter(b => !dismissed.includes(b.id))

    return (
        <div className="fixed bottom-10 left-10 z-[100] w-[400px] flex flex-col gap-4 pointer-events-none">
            <AnimatePresence>
                {activeAlerts.map((alert) => (
                    <motion.div
                        key={alert.id}
                        initial={{ opacity: 0, x: -50, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -20, scale: 0.95 }}
                        className="pointer-events-auto"
                    >
                        <div className={`
                            relative overflow-hidden p-6 rounded-[2rem] border shadow-2xl backdrop-blur-3xl
                            ${alert.priority === 'critical'
                                ? 'bg-rose-900/40 border-rose-500/50 text-white'
                                : alert.priority === 'high'
                                    ? 'bg-orange-600/30 border-orange-500/50 text-white'
                                    : 'bg-card/90 border-border text-foreground'}
                        `}>
                            {/* Animated Background Pulse for Critical Alerts */}
                            {alert.priority === 'critical' && (
                                <div className="absolute inset-0 bg-rose-600/10 animate-pulse pointer-events-none" />
                            )}

                            <div className="flex gap-4 relative z-10">
                                <div className={`
                                    h-12 w-12 rounded-2xl flex items-center justify-center shrink-0
                                    ${alert.priority === 'critical' ? 'bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.5)]' : 'bg-indigo-500'}
                                `}>
                                    <Zap className="h-6 w-6 text-white" />
                                </div>

                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">
                                            {alert.type || 'EMERGENCY SIGNAL'}
                                        </span>
                                        <button
                                            onClick={() => handleAcknowledge(alert.id)}
                                            className="hover:rotate-90 transition-transform"
                                        >
                                            <X className="h-4 w-4 opacity-40 hover:opacity-100" />
                                        </button>
                                    </div>
                                    <p className="text-sm font-black leading-tight tracking-tight mb-4">
                                        {alert.message}
                                    </p>

                                    <Button
                                        onClick={() => handleAcknowledge(alert.id)}
                                        className={`
                                            w-full h-10 rounded-xl font-black text-[10px] uppercase tracking-widest border-none
                                            ${alert.priority === 'critical' ? 'bg-white text-rose-600 hover:bg-white/90' : 'bg-muted text-foreground hover:bg-muted/80'}
                                        `}
                                    >
                                        <CheckCircle2 className="h-3 w-3 mr-2" />
                                        ACKNOWLEDGE RECEIPT
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    )
}
