'use client'

import { useState, useEffect } from "react"
import { Plus, Trash2, Calendar as CalendarIcon, MapPin, Globe } from "lucide-react"
import { format } from "date-fns"
import { toast } from "sonner"
import {
    Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
    DialogFooter, DialogClose
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createHoliday, deleteHoliday } from "@/app/actions/holidays"
import { getCountries, getSubdivisions } from "@/app/actions/geography"

export type Holiday = {
    id: string
    name: string
    date: Date | string // Date from server comes as string usually
    type: string
    country_id?: string | null
    subdivision_id?: string | null
    country?: { name: string, flag?: string } | null
    subdivision?: { name: string } | null
    description?: string | null
}

interface HolidayManagerProps {
    initialHolidays: Holiday[]
    tenantId: string
    defaultCountryId?: string
}

export function HolidayManager({ initialHolidays, tenantId, defaultCountryId }: HolidayManagerProps) {
    const [holidays, setHolidays] = useState<Holiday[]>(initialHolidays)
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    // Form State
    const [countries, setCountries] = useState<any[]>([])
    const [subdivisions, setSubdivisions] = useState<any[]>([])

    const [formData, setFormData] = useState({
        name: '',
        date: new Date().toISOString().split('T')[0],
        type: 'NATIONAL' as 'NATIONAL' | 'REGIONAL',
        countryId: defaultCountryId || '',
        subdivisionId: '',
        description: ''
    })

    useEffect(() => {
        setHolidays(initialHolidays)
    }, [initialHolidays])

    useEffect(() => {
        if (open) {
            getCountries().then(setCountries)
        }
    }, [open])

    useEffect(() => {
        if (formData.countryId && formData.type === 'REGIONAL') {
            getSubdivisions(formData.countryId).then(setSubdivisions)
        } else {
            setSubdivisions([])
        }
    }, [formData.countryId, formData.type])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            await createHoliday(tenantId, formData)
            toast.success("Holiday created successfully")
            setOpen(false)
            setFormData({
                name: '',
                date: new Date().toISOString().split('T')[0],
                type: 'NATIONAL',
                countryId: defaultCountryId || '',
                subdivisionId: '',
                description: ''
            })
            // In a real app we'd re-fetch, but server action revalidatePath handles refreshing the server component prop.
            // But we need to wait for parent re-render or push to local state?
            // Since we are in a client component, we rely on the parent causing a re-render or we can splice it in if we returned the created object.
            // For simplicity, we just rely on Next.js Server Action router refresh (which happens automatically if we used `router.refresh()` in the action, 
            // but `revalidatePath` works too if this component is inside a valid tree).
            // Actually, we should call router.refresh() here to be sure.
        } catch (error) {
            toast.error("Failed to create holiday")
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure?")) return
        try {
            await deleteHoliday(id)
            toast.success("Holiday deleted")
        } catch (error) {
            toast.error("Failed to delete")
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-lg border shadow-sm">
                <div>
                    <h2 className="text-lg font-semibold text-slate-900">Holiday Master List</h2>
                    <p className="text-sm text-slate-500">Manage national and regional holidays for your organization.</p>
                </div>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-indigo-600 hover:bg-indigo-700">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Holiday
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Add New Holiday</DialogTitle>
                            <DialogDescription>
                                Create a holiday entry. For Regional holidays, select the specific state/province.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <Label>Holiday Name</Label>
                                <Input
                                    placeholder="e.g. Independence Day"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Date</Label>
                                    <Input
                                        type="date"
                                        value={formData.date}
                                        onChange={e => setFormData({ ...formData, date: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Type</Label>
                                    <Select
                                        value={formData.type}
                                        onValueChange={(val: any) => setFormData({ ...formData, type: val })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="NATIONAL">National</SelectItem>
                                            <SelectItem value="REGIONAL">Regional</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Country</Label>
                                <Select
                                    value={formData.countryId}
                                    onValueChange={(val) => setFormData({ ...formData, countryId: val, subdivisionId: '' })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Country" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {countries.map(c => (
                                            <SelectItem key={c.id} value={c.id}>
                                                {c.flag} {c.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {formData.type === 'REGIONAL' && (
                                <div className="space-y-2">
                                    <Label>Region / State</Label>
                                    <Select
                                        value={formData.subdivisionId}
                                        onValueChange={(val) => setFormData({ ...formData, subdivisionId: val })}
                                        disabled={!formData.countryId}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Region" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {subdivisions.map(s => (
                                                <SelectItem key={s.id} value={s.id}>
                                                    {s.name} ({s.type})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}

                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? "Creating..." : "Create Holiday"}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {holidays.map(holiday => (
                    <div key={holiday.id} className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow relative group">
                        <button
                            onClick={() => handleDelete(holiday.id)}
                            className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>

                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <h3 className="font-semibold text-slate-900">{holiday.name}</h3>
                                <div className="flex items-center text-sm text-slate-500 mt-1">
                                    <CalendarIcon className="w-3.5 h-3.5 mr-1.5" />
                                    {format(new Date(holiday.date), "MMMM d, yyyy")}
                                </div>
                            </div>
                            <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${holiday.type === 'NATIONAL'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-purple-100 text-purple-700'
                                }`}>
                                {holiday.type}
                            </span>
                        </div>

                        <div className="flex items-center gap-3 pt-3 border-t text-xs text-slate-500">
                            {holiday.country && (
                                <div className="flex items-center">
                                    <Globe className="w-3.5 h-3.5 mr-1" />
                                    {holiday.country.name}
                                </div>
                            )}
                            {holiday.subdivision && (
                                <div className="flex items-center">
                                    <MapPin className="w-3.5 h-3.5 mr-1" />
                                    {holiday.subdivision.name}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {holidays.length === 0 && (
                <div className="text-center py-12 bg-slate-50 rounded-lg border border-dashed">
                    <p className="text-slate-500">No holidays found. Add your first holiday master.</p>
                </div>
            )}
        </div>
    )
}
