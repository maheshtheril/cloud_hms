'use client'

import { useState, useEffect, useCallback } from "react"
import { Check, ChevronsUpDown, Plus, Search, UserPlus } from "lucide-react"
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
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { searchPatients } from "@/app/actions/patient-search"
import { createPatientV10 } from "@/app/actions/patient-v10"
import { useToast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Patient {
    id: string
    name: string
    patient_number?: string
    phone?: string
}

interface PatientSearchWithCreateProps {
    onSelect: (patient: Patient) => void
    selectedPatientId?: string
}

export function PatientSearchWithCreate({ onSelect, selectedPatientId }: PatientSearchWithCreateProps) {
    const [open, setOpen] = useState(false)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [query, setQuery] = useState("")
    const [patients, setPatients] = useState<Patient[]>([])
    const [loading, setLoading] = useState(false)
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
    const { toast } = useToast()

    const fetchPatients = useCallback(async (q: string) => {
        if (q.length < 2) {
            setPatients([])
            return
        }
        setLoading(true)
        const results = await searchPatients(q)
        setPatients(results as any)
        setLoading(false)
    }, [])

    useEffect(() => {
        const timer = setTimeout(() => {
            if (query) fetchPatients(query)
        }, 300)
        return () => clearTimeout(timer)
    }, [query, fetchPatients])

    async function handleCreatePatient(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)

        try {
            const res = await createPatientV10(null, formData)
            if (res.error) {
                toast({ title: "Error", description: res.error, variant: "destructive" })
            } else if (res.success && res.data) {
                const newPatient = {
                    id: res.data.id,
                    name: `${res.data.first_name} ${res.data.last_name || ''}`.trim(),
                    patient_number: res.data.patient_number,
                    phone: (res.data.contact as any)?.phone || ''
                }
                toast({ title: "Success", description: "Patient registered successfully." })
                onSelect(newPatient)
                setSelectedPatient(newPatient)
                setDialogOpen(false)
                setOpen(false)
            }
        } catch (err: any) {
            toast({ title: "Crash", description: err.message, variant: "destructive" })
        }
    }

    return (
        <div className="flex items-center gap-2">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                    >
                        {selectedPatient ? (
                            <span className="flex items-center gap-2">
                                <Search className="h-4 w-4 text-slate-400" />
                                <span className="font-medium">{selectedPatient.name}</span>
                                <span className="text-xs text-slate-400">({selectedPatient.patient_number})</span>
                            </span>
                        ) : (
                            <span className="flex items-center gap-2 text-slate-400">
                                <Search className="h-4 w-4" />
                                Search Patient by Name or Phone...
                            </span>
                        )}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-0 shadow-2xl border-slate-200 dark:border-slate-800" align="start">
                    <Command shouldFilter={false}>
                        <CommandInput
                            placeholder="Type name or phone..."
                            value={query}
                            onValueChange={setQuery}
                        />
                        <CommandList>
                            <CommandEmpty>
                                {loading ? "Searching..." : "No patient found."}
                            </CommandEmpty>
                            <CommandGroup>
                                {patients.map((patient) => (
                                    <CommandItem
                                        key={patient.id}
                                        value={patient.id}
                                        onSelect={() => {
                                            onSelect(patient)
                                            setSelectedPatient(patient)
                                            setOpen(false)
                                        }}
                                        className="flex flex-col items-start py-3 cursor-pointer"
                                    >
                                        <div className="flex items-center justify-between w-full">
                                            <span className="font-semibold text-slate-900 dark:text-slate-100">{patient.name}</span>
                                            {selectedPatientId === patient.id && <Check className="h-4 w-4 text-blue-500" />}
                                        </div>
                                        <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                                            <span>ID: {patient.patient_number}</span>
                                            <span>•</span>
                                            <span>Ph: {patient.phone}</span>
                                        </div>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                    <Button variant="secondary" className="bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-100 flex items-center gap-2 shrink-0">
                        <UserPlus className="h-4 w-4" />
                        <span>New Patient</span>
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold flex items-center gap-2 text-slate-900">
                            <Plus className="h-5 w-5 bg-blue-500 text-white rounded-full p-0.5" />
                            Register New Patient
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreatePatient} className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="first_name">First Name</Label>
                                <Input id="first_name" name="first_name" required placeholder="John" className="bg-slate-50 border-slate-200" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="last_name">Last Name</Label>
                                <Input id="last_name" name="last_name" placeholder="Doe" className="bg-slate-50 border-slate-200" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input id="phone" name="phone" required placeholder="9876543210" className="bg-slate-50 border-slate-200" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="gender">Gender</Label>
                                <select
                                    name="gender"
                                    className="w-full h-10 px-3 rounded-md border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    defaultValue="male"
                                >
                                    <SelectItem value="male">Male</SelectItem>
                                    <SelectItem value="female">Female</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="dob">Date of Birth</Label>
                            <Input id="dob" name="dob" type="date" className="bg-slate-50 border-slate-200" />
                        </div>

                        <div className="flex items-center gap-2 pt-2 text-xs text-slate-500 italic bg-amber-50 p-2 rounded border border-amber-100">
                            <Search className="h-3 w-3" />
                            Patient will be added to the voucher after registration.
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
                            <Button type="button" variant="ghost" onClick={() => setDialogOpen(false)}>Cancel</Button>
                            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8">Register & Auto-Select</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

function SelectItem({ children, value }: { children: React.ReactNode, value: string }) {
    return <option value={value}>{children}</option>
}
