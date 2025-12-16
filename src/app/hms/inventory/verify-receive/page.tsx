
'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { verifyReceiveStockScript } from "@/app/actions/verify-inventory"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function VerifyReceivePage() {
    const [logs, setLogs] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

    const runVerification = async () => {
        setIsLoading(true)
        setLogs(["Running verification..."])
        setStatus('idle')

        try {
            const result = await verifyReceiveStockScript()
            setLogs(result.logs || [])
            setStatus(result.success ? 'success' : 'error')
        } catch (e) {
            setLogs(p => [...p, "Client Error: Failed to invoke action."])
            setStatus('error')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto p-8 space-y-6">
            <h1 className="text-2xl font-bold">Inventory Verification Tool</h1>
            <p className="text-gray-500">
                This tool runs an automated test of the "Receive Stock" flow directly on the server.
                It creates a test product, receives stock, and verifies the database levels.
            </p>

            <Button onClick={runVerification} disabled={isLoading} size="lg" className={status === 'error' ? 'bg-red-600' : ''}>
                {isLoading ? "Running Test..." : "Run Test Verification"}
            </Button>

            {logs.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className={status === 'success' ? "text-green-600" : status === 'error' ? "text-red-600" : ""}>
                            {status === 'success' ? "Test Passed" : status === 'error' ? "Test Failed" : "Log Output"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="bg-slate-950 text-slate-50 p-4 rounded-b-lg font-mono text-sm overflow-x-auto">
                        <pre className="whitespace-pre-wrap">
                            {logs.join('\n')}
                        </pre>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
