'use client'

import { useState, useEffect } from 'react'
import { getCountries, getSubdivisions } from '@/app/actions/geography'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'

interface GeographySelectorProps {
    onCountryChange: (id: string) => void
    onSubdivisionChange: (id: string, level: number) => void
    selectedCountryId?: string
}

export function GeographySelector({ onCountryChange, onSubdivisionChange, selectedCountryId }: GeographySelectorProps) {
    const [countries, setCountries] = useState<any[]>([])
    const [selections, setSelections] = useState<{ id: string, name: string, type: string, children: any[] }[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadCountries() {
            const data = await getCountries()
            setCountries(data)
            setLoading(false)
        }
        loadCountries()
    }, [])

    const handleCountrySelect = async (countryId: string) => {
        onCountryChange(countryId)
        setLoading(true)
        const roots = await getSubdivisions(countryId, null)
        setSelections([{ id: '', name: 'Select State', type: 'root', children: roots }])
        setLoading(false)
    }

    const handleSubdivisionSelect = async (subId: string, level: number) => {
        const currentSelection = selections[level].children.find(c => c.id === subId)
        if (!currentSelection) return

        onSubdivisionChange(subId, level)

        setLoading(true)
        const children = await getSubdivisions(selectedCountryId || '', subId)

        const nextSelections = selections.slice(0, level + 1)
        if (children.length > 0) {
            nextSelections.push({
                id: '',
                name: `Select ${children[0].type}`,
                type: children[0].type,
                children: children
            })
        }
        setSelections(nextSelections)
        setLoading(false)
    }

    if (loading && countries.length === 0) {
        return <div className="flex items-center gap-2 text-sm text-slate-500"><Loader2 className="h-4 w-4 animate-spin" /> Intelligence loading...</div>
    }

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Country</Label>
                    <Select onValueChange={handleCountrySelect} value={selectedCountryId}>
                        <SelectTrigger className="h-12 bg-white/50 border-slate-200/50 rounded-xl">
                            <SelectValue placeholder="Select Country" />
                        </SelectTrigger>
                        <SelectContent>
                            {countries.map(c => (
                                <SelectItem key={c.id} value={c.id}>
                                    <span className="flex items-center gap-2">
                                        <span>{c.flag}</span>
                                        <span>{c.name}</span>
                                    </span>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {selections.map((level, i) => (
                    <div key={i} className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 capitalize">
                            {level.type === 'root' ? 'Subdivision' : level.type}
                        </Label>
                        <Select onValueChange={(val) => handleSubdivisionSelect(val, i)}>
                            <SelectTrigger className="h-12 bg-white/50 border-slate-200/50 rounded-xl">
                                <SelectValue placeholder={level.name} />
                            </SelectTrigger>
                            <SelectContent>
                                {level.children.map(c => (
                                    <SelectItem key={c.id} value={c.id}>
                                        {c.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                ))}
            </div>
        </div>
    )
}
