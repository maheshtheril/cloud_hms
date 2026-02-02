'use client'

import { useState, useEffect } from "react"
import { GeographySelector } from "@/components/geography-selector"
import { getCountries, getCompanyCountry } from "@/app/actions/geography"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function GeoPlaygroundPage() {
    const [countries, setCountries] = useState<any[]>([])
    const [selectedCountry, setSelectedCountry] = useState<string>('')
    const [formData, setFormData] = useState({
        stateId: '',
        districtId: '',
        zoneId: '',
        wardId: ''
    })

    // Load available countries
    useEffect(() => {
        async function load() {
            const list = await getCountries()
            setCountries(list)

            // Default to company country or first in list
            const defaultId = await getCompanyCountry()
            if (defaultId) setSelectedCountry(defaultId)
            else if (list.length > 0) setSelectedCountry(list[0].id)
        }
        load()
    }, [])

    const handleGeoChange = (level: string, id: string) => {
        setFormData(prev => {
            const updated = { ...prev }

            // When a parent changes, we must reset children
            if (level === 'STATE') {
                updated.stateId = id
                updated.districtId = ''
                updated.zoneId = ''
                updated.wardId = ''
            } else if (level === 'DISTRICT') {
                updated.districtId = id
                updated.zoneId = ''
                updated.wardId = ''
            } else if (level === 'ZONE') {
                updated.zoneId = id
                updated.wardId = ''
            } else if (level === 'WARD') {
                updated.wardId = id
            }
            return updated
        })
    }

    return (
        <div className="container mx-auto p-10 max-w-4xl space-y-8">
            <div className="space-y-2">
                <h1 className="text-3xl font-black tracking-tight">Geography Input Playground</h1>
                <p className="text-slate-500 text-lg">
                    This is a demo of how to use the <code className="bg-slate-100 p-1 rounded text-sm text-indigo-600 font-mono">GeographySelector</code> in your forms.
                </p>
            </div>

            <Card className="bg-slate-50 border-indigo-100 dark:bg-slate-900/50">
                <CardHeader>
                    <CardTitle>1. Choose a Context (Form Setup)</CardTitle>
                    <CardDescription>Normally this is your Company's default country, but you can switch it here to test.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="max-w-xs">
                        <Label className="mb-2 block">Form Country Scope</Label>
                        <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                            <SelectTrigger className="bg-white">
                                <SelectValue placeholder="Select Country" />
                            </SelectTrigger>
                            <SelectContent>
                                {countries.map(c => (
                                    <SelectItem key={c.id} value={c.id}>{c.flag} {c.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-2 border-indigo-500 shadow-xl shadow-indigo-500/10">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        2. The Input Component
                        <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold uppercase">Ready to Use</span>
                    </CardTitle>
                    <CardDescription>
                        This is the actual component interacting with your database.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">

                    {selectedCountry ? (
                        <GeographySelector
                            countryId={selectedCountry}
                            maxLevel="WARD" // Change this to 'DISTRICT' or 'ZONE' to test limits
                            value={formData}
                            onChange={handleGeoChange}
                        />
                    ) : (
                        <div className="text-center p-8 text-slate-400 italic">Select a country first</div>
                    )}

                    <div className="mt-8 p-4 bg-slate-900 text-slate-50 rounded-lg font-mono text-sm">
                        <div className="text-slate-400 text-xs uppercase tracking-widest mb-2 font-bold">Form Data Output (JSON)</div>
                        {JSON.stringify(formData, null, 2)}
                    </div>

                </CardContent>
            </Card>
        </div>
    )
}
