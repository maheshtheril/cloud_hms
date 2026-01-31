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

    // Explicit state for 3 levels
    const [states, setStates] = useState<any[]>([])
    const [districts, setDistricts] = useState<any[]>([])

    const [selectedStateId, setSelectedStateId] = useState<string>('')
    const [selectedDistrictId, setSelectedDistrictId] = useState<string>('')

    const [loading, setLoading] = useState(false)

    // Load Countries on Mount
    useEffect(() => {
        async function loadCountries() {
            setLoading(true)
            const data = await getCountries()
            setCountries(data)
            setLoading(false)
        }
        loadCountries()
    }, [])

    // Handle Country Change
    const handleCountrySelect = async (countryId: string | null) => {
        // Reset valid selection
        setSelectedStateId('')
        setSelectedDistrictId('')
        setStates([])
        setDistricts([])

        if (!countryId) {
            onCountryChange('')
            return
        }

        onCountryChange(countryId)
        setLoading(true)
        const countryStates = await getSubdivisions(countryId, null)
        setStates(countryStates)
        setLoading(false)
    }

    // Handle State Change
    const handleStateSelect = async (stateId: string | null) => {
        setSelectedDistrictId('')
        setDistricts([])

        if (!stateId) {
            setSelectedStateId('')
            // Notify parent: level 0 (state) cleared
            onSubdivisionChange('', 0)
            return
        }

        setSelectedStateId(stateId)
        onSubdivisionChange(stateId, 0) // Level 0 = State

        setLoading(true)
        const stateDistricts = await getSubdivisions(selectedCountryId || '', stateId)
        setDistricts(stateDistricts)
        setLoading(false)
    }

    // Handle District Change
    const handleDistrictSelect = (districtId: string | null) => {
        if (!districtId) {
            setSelectedDistrictId('')
            onSubdivisionChange(selectedStateId, 0) // Fallback to state
            return
        }
        setSelectedDistrictId(districtId)
        onSubdivisionChange(districtId, 1) // Level 1 = District
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* 1. Country Selector - Always Visible */}
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
                        placeholder="Select Country"
                        className="h-14 bg-white/50 border-slate-200/50 rounded-2xl shadow-sm transition-all focus-within:ring-4 focus-within:ring-indigo-500/10"
                    />
                </div>

                {/* 2. State Selector - Always Visible (Disabled if no country or empty) */}
                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">State / Province</Label>
                    <SearchableSelect
                        options={states.map(s => ({ id: s.id, label: s.name }))}
                        value={selectedStateId}
                        onChange={(val) => handleStateSelect(val)}
                        onSearch={async (q) => states
                            .filter(s => s.name.toLowerCase().includes(q.toLowerCase()))
                            .map(c => ({ id: c.id, label: c.name }))
                        }
                        placeholder={!selectedCountryId ? "Select Country First" : (states.length === 0 ? "No States Available" : "Select State")}
                        // Disable if no country selected OR if states fetched is empty (optional, keeping it interactive but empty is what user wants "visible")
                        // User said "dropdowns always visible and loaded".
                        // We strictly disable only if no country is picked. If country picked + no states, we show "No States Available" but keep widget visible.
                        disabled={!selectedCountryId}
                        className="h-14 bg-white/50 border-slate-200/50 rounded-2xl shadow-sm transition-all focus-within:ring-4 focus-within:ring-indigo-500/10 disabled:opacity-50"
                    />
                </div>

                {/* 3. District Selector - Always Visible */}
                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">District / Region</Label>
                    <SearchableSelect
                        options={districts.map(d => ({ id: d.id, label: d.name }))}
                        value={selectedDistrictId}
                        onChange={(val) => handleDistrictSelect(val)}
                        onSearch={async (q) => districts
                            .filter(d => d.name.toLowerCase().includes(q.toLowerCase()))
                            .map(c => ({ id: c.id, label: c.name }))
                        }
                        placeholder={!selectedStateId ? "Select State First" : (districts.length === 0 ? "No Districts Available" : "Select District")}
                        disabled={!selectedStateId}
                        className="h-14 bg-white/50 border-slate-200/50 rounded-2xl shadow-sm transition-all focus-within:ring-4 focus-within:ring-indigo-500/10 disabled:opacity-50"
                    />
                </div>

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
