'use client'

import { useState, useEffect } from 'react'
import { getCountries, getSubdivisions } from '@/app/actions/geography'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import { SearchableSelect } from '@/components/ui/searchable-select'

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
            setLoading(true)
            const data = await getCountries()
            setCountries(data)
            setLoading(false)
        }
        loadCountries()
    }, [])

    const handleCountrySelect = async (countryId: string) => {
        if (!countryId) return
        onCountryChange(countryId)
        setLoading(true)
        const roots = await getSubdivisions(countryId, null)
        setSelections([{ id: '', name: 'Select State', type: 'state', children: roots }])
        setLoading(false)
    }

    const handleSubdivisionSelect = async (subId: string, level: number) => {
        if (!subId) return
        const currentLevel = selections[level]
        const currentSelection = currentLevel.children.find(c => c.id === subId)
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

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Country</Label>
                    <SearchableSelect
                        options={countries.map(c => ({ id: c.id, label: `${c.flag} ${c.name}` }))}
                        value={selectedCountryId}
                        onChange={(val) => handleCountrySelect(val || '')}
                        onSearch={async (q) => countries
                            .filter(c => c.name.toLowerCase().includes(q.toLowerCase()))
                            .map(c => ({ id: c.id, label: `${c.flag} ${c.name}` }))
                        }
                        placeholder="Search Country..."
                        className="h-12 bg-white/50 border-slate-200/50 rounded-xl"
                    />
                </div>

                {selections.map((level, i) => (
                    <div key={i} className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 capitalize">
                            {level.type}
                        </Label>
                        <SearchableSelect
                            options={level.children.map(c => ({ id: c.id, label: c.name }))}
                            value={null} // We don't need to track the value here locally as it's handled by parent
                            onChange={(val) => handleSubdivisionSelect(val || '', i)}
                            onSearch={async (q) => level.children
                                .filter(c => c.name.toLowerCase().includes(q.toLowerCase()))
                                .map(c => ({ id: c.id, label: c.name }))
                            }
                            placeholder={level.name}
                            className="h-12 bg-white/50 border-slate-200/50 rounded-xl transition-all"
                        />
                    </div>
                ))}
            </div>
            {loading && selections.length === 0 && selectedCountryId && (
                <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-500 uppercase tracking-widest">
                    <Loader2 className="h-3 w-3 animate-spin" /> Fetching Subdivisions...
                </div>
            )}
        </div>
    )
}
