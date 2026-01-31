'use client'

import { useState, useEffect } from 'react'
import { getCountries, getSubdivisions } from '@/app/actions/geography'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import { SearchableSelect } from '@/components/ui/searchable-select'

interface SelectionLevel {
    id: string
    name: string
    type: string
    children: any[]
}

interface GeographySelectorProps {
    onCountryChange: (id: string) => void
    onSubdivisionChange: (id: string, level: number) => void
    selectedCountryId?: string
}

export function GeographySelector({ onCountryChange, onSubdivisionChange, selectedCountryId }: GeographySelectorProps) {
    const [countries, setCountries] = useState<any[]>([])
    const [selections, setSelections] = useState<SelectionLevel[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        async function loadCountries() {
            setLoading(true)
            const data = await getCountries()
            setCountries(data)
            setLoading(false)
        }
        loadCountries()
    }, [])

    const handleCountrySelect = async (countryId: string | null) => {
        if (!countryId) {
            setSelections([])
            onCountryChange('')
            return
        }
        onCountryChange(countryId)
        setLoading(true)
        const roots = await getSubdivisions(countryId, null)

        if (roots.length > 0) {
            setSelections([{
                id: '',
                name: `Select ${roots[0].type || 'Region'}`,
                type: roots[0].type || 'state',
                children: roots
            }])
        } else {
            setSelections([])
        }
        setLoading(false)
    }

    const handleSubdivisionSelect = async (subId: string | null, levelIndex: number) => {
        if (!subId) {
            // Clear current and subsequent levels
            const newSelections = selections.slice(0, levelIndex)
            const currentLevel = selections[levelIndex]
            newSelections.push({ ...currentLevel, id: '' })
            setSelections(newSelections)
            return
        }

        const currentLevel = selections[levelIndex]
        const currentSelection = currentLevel.children.find(c => c.id === subId)
        if (!currentSelection) return

        onSubdivisionChange(subId, levelIndex)

        setLoading(true)
        const children = await getSubdivisions(selectedCountryId || '', subId)

        const nextSelections = selections.slice(0, levelIndex)
        // Update current level with the selected ID
        nextSelections.push({ ...currentLevel, id: subId })

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
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Country / Nation</Label>
                    <SearchableSelect
                        options={countries.map(c => ({ id: c.id, label: `${c.flag} ${c.name}` }))}
                        value={selectedCountryId}
                        onChange={(val) => handleCountrySelect(val)}
                        onSearch={async (q) => countries
                            .filter(c => c.name.toLowerCase().includes(q.toLowerCase()))
                            .map(c => ({ id: c.id, label: `${c.flag} ${c.name}` }))
                        }
                        placeholder="Search Country..."
                        className="h-14 bg-white/50 border-slate-200/50 rounded-2xl shadow-sm transition-all focus-within:ring-4 focus-within:ring-indigo-500/10"
                    />
                </div>

                {selections.map((level, i) => (
                    <div key={i} className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 capitalize ml-1">
                            {level.type}
                        </Label>
                        <SearchableSelect
                            options={level.children.map(c => ({ id: c.id, label: c.name }))}
                            value={level.id}
                            onChange={(val) => handleSubdivisionSelect(val, i)}
                            onSearch={async (q) => level.children
                                .filter(c => c.name.toLowerCase().includes(q.toLowerCase()))
                                .map(c => ({ id: c.id, label: c.name }))
                            }
                            placeholder={level.name}
                            className="h-14 bg-white/50 border-slate-200/50 rounded-2xl shadow-sm transition-all focus-within:ring-4 focus-within:ring-indigo-500/10"
                        />
                    </div>
                ))}
            </div>

            {loading && (
                <div className="flex items-center gap-2 text-[10px] font-black text-indigo-500 uppercase tracking-widest bg-indigo-50/50 p-3 rounded-xl border border-indigo-100/50 animate-pulse">
                    <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
                    Synchronizing Regional Data...
                </div>
            )}
        </div>
    )
}
