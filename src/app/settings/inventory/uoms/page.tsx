'use client'

import { useState, useEffect } from 'react'
import { seedPharmacyUOMs, getUOMs } from '@/app/actions/uom'
import { Button } from '@/components/ui/button'
import { Loader2, Plus, Package } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

export default function UOMManagementPage() {
    const [uoms, setUoms] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [seeding, setSeeding] = useState(false)
    const { toast } = useToast()

    useEffect(() => {
        loadUOMs()
    }, [])

    async function loadUOMs() {
        setLoading(true)
        const result = await getUOMs()
        if (result.success && result.data) {
            setUoms(result.data)
        }
        setLoading(false)
    }

    async function handleSeed() {
        setSeeding(true)
        const result = await seedPharmacyUOMs()
        if (result.success) {
            toast({ title: 'Success', description: result.message })
            loadUOMs()
        } else {
            toast({ title: 'Error', description: result.error, variant: 'destructive' })
        }
        setSeeding(false)
    }

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Units of Measure (UOM)</h1>
                    <p className="text-muted-foreground mt-2">Manage packaging units for products</p>
                </div>
                <Button onClick={handleSeed} disabled={seeding}>
                    {seeding ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Package className="h-4 w-4 mr-2" />}
                    Seed Pharmacy UOMs
                </Button>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            ) : uoms.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed rounded-lg">
                    <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No UOMs Found</h3>
                    <p className="text-muted-foreground mb-4">Click "Seed Pharmacy UOMs" to get started</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {uoms.map((uom) => (
                        <div key={uom.id} className="border rounded-lg p-4 flex items-center justify-between hover:bg-accent/50 transition-colors">
                            <div>
                                <div className="flex items-center gap-3">
                                    <h3 className="font-semibold text-lg">{uom.name}</h3>
                                    <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                                        {uom.uom_type}
                                    </span>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Category: {uom.hms_uom_category?.name}
                                </p>
                            </div>
                            <div className="text-right">
                                <div className="text-sm text-muted-foreground">Ratio</div>
                                <div className="text-2xl font-bold font-mono">{Number(uom.ratio).toFixed(1)}×</div>
                                {uom.ratio > 1 && (
                                    <div className="text-xs text-muted-foreground mt-1">
                                        1 {uom.name} = {Number(uom.ratio)} PCS
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    How UOM Works
                </h3>
                <ul className="text-sm space-y-2 text-muted-foreground">
                    <li>• <strong>PCS</strong> (Pieces) is the base unit - all stock is tracked in PCS</li>
                    <li>• <strong>PACK-10</strong> means 1 pack = 10 pieces</li>
                    <li>• Purchase 5 PACK-10 → Adds 50 PCS to stock</li>
                    <li>• Sell 2 PACK-10 → Deducts 20 PCS from stock</li>
                    <li>• You can sell in any UOM (packs or individual pieces)</li>
                </ul>
            </div>
        </div>
    )
}
