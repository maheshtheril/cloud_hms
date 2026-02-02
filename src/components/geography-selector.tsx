'use client'

import { useState, useEffect } from 'react'
import { Check, ChevronsUpDown, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { getSubdivisions } from '@/app/actions/geography'

interface GeographySelectorProps {
    countryId: string
    value?: {
        stateId?: string
        districtId?: string
        zoneId?: string
        wardId?: string
    }
    onChange?: (level: string, id: string) => void
    maxLevel?: 'STATE' | 'DISTRICT' | 'ZONE' | 'WARD'
}

type GeoOption = { id: string, name: string, type: string }

/**
 * A reusable component for selecting geographical regions in forms.
 * Automatically handles the hierarchy (State -> District -> Zone -> etc.)
 */
export function GeographySelector({
    countryId,
    value,
    onChange,
    maxLevel = 'WARD'
}: GeographySelectorProps) {

    // --- State Lists ---
    const [states, setStates] = useState<GeoOption[]>([])
    const [districts, setDistricts] = useState<GeoOption[]>([])
    const [zones, setZones] = useState<GeoOption[]>([])
    const [wards, setWards] = useState<GeoOption[]>([])

    // --- Loading ---
    const [loadingLevel, setLoadingLevel] = useState<string | null>(null)

    // --- Load States on Mount or Country Change ---
    useEffect(() => {
        if (!countryId) return
        loadRegions(null, 'STATE', setStates)
    }, [countryId])

    // --- Load Children when Parent Changes ---
    useEffect(() => {
        if (value?.stateId && maxLevel !== 'STATE') {
            loadRegions(value.stateId, 'DISTRICT', setDistricts)
        } else {
            setDistricts([])
        }
    }, [value?.stateId])

    useEffect(() => {
        if (value?.districtId && (maxLevel === 'ZONE' || maxLevel === 'WARD')) {
            loadRegions(value.districtId, 'ZONE', setZones)
        } else {
            setZones([])
        }
    }, [value?.districtId])

    useEffect(() => {
        if (value?.zoneId && maxLevel === 'WARD') {
            loadRegions(value.zoneId, 'WARD', setWards)
        } else {
            setWards([])
        }
    }, [value?.zoneId])


    // --- Helper to fetch data ---
    const loadRegions = async (parentId: string | null, levelName: string, setter: (data: GeoOption[]) => void) => {
        setLoadingLevel(levelName)
        try {
            const data = await getSubdivisions(countryId, parentId)
            setter(data)
        } finally {
            setLoadingLevel(null)
        }
    }

    // --- Generic Selector UI ---
    const Selector = ({
        label,
        level,
        options,
        currentValue,
        disabled
    }: {
        label: string,
        level: string,
        options: GeoOption[],
        currentValue?: string,
        disabled?: boolean
    }) => {
        const [open, setOpen] = useState(false)
        const selected = options.find(o => o.id === currentValue)

        return (
            <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            disabled={disabled || (loadingLevel === level)}
                            className="w-full justify-between"
                        >
                            {loadingLevel === level ? (
                                <span className="flex items-center gap-2 text-slate-500">
                                    <Loader2 className="h-4 w-4 animate-spin" /> Loading...
                                </span>
                            ) : selected ? (
                                selected.name
                            ) : (
                                <span className="text-slate-500">Select {label}...</span>
                            )}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-0">
                        <Command>
                            <CommandInput placeholder={`Search ${label}...`} />
                            <CommandList>
                                <CommandEmpty>No {label.toLowerCase()} found.</CommandEmpty>
                                <CommandGroup>
                                    {options.map((option) => (
                                        <CommandItem
                                            key={option.id}
                                            value={option.name}
                                            onSelect={() => {
                                                onChange?.(level, option.id)
                                                setOpen(false)
                                            }}
                                        >
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    currentValue === option.id ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                            {option.name}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Selector
                label="State / Province"
                level="STATE"
                options={states}
                currentValue={value?.stateId}
            />

            {(maxLevel !== 'STATE') && (
                <Selector
                    label="District"
                    level="DISTRICT"
                    options={districts}
                    currentValue={value?.districtId}
                    disabled={!value?.stateId}
                />
            )}

            {(maxLevel === 'ZONE' || maxLevel === 'WARD') && (
                <Selector
                    label="Zone / Taluk"
                    level="ZONE"
                    options={zones}
                    currentValue={value?.zoneId}
                    disabled={!value?.districtId}
                />
            )}

            {maxLevel === 'WARD' && (
                <Selector
                    label="Ward / Village"
                    level="WARD"
                    options={wards}
                    currentValue={value?.wardId}
                    disabled={!value?.zoneId}
                />
            )}
        </div>
    )
}
