'use client'

import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getRoles } from '@/app/actions/role'
import {
    UserPlus, Mail, Shield, Loader2, Copy,
    Globe, Phone, Tag, UserCircle, Briefcase,
    Fingerprint, MapPin, ChevronRight, Save, X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { inviteUser } from '@/app/actions/users'
import { useToast } from '@/components/ui/use-toast'
import { SearchableSelect } from '@/components/ui/searchable-select'
import { GeographySelector } from './geography-selector'
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface InviteUserDialogProps {
    roles?: Array<{
        id: string
        name: string
        description?: string | null
    }>
}

export function InviteUserDialog({ roles = [] }: InviteUserDialogProps) {
    const router = useRouter()
    const { toast } = useToast()
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [currentRoles, setCurrentRoles] = useState<any[]>([])
    const [activeTab, setActiveTab] = useState('profile')

    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        userName: '',
        mobile: '',
        countryId: '',
        subdivisionId: '',
        systemRole: 'user' as 'admin' | 'user',
        roleId: '',
    })

    const [errors, setErrors] = useState<Record<string, string>>({})

    useEffect(() => {
        if (open) {
            const fetchRoles = async () => {
                try {
                    const result = await getRoles()
                    if (result.data) {
                        setCurrentRoles(result.data as any[])
                    }
                } catch (e) {
                    console.error(e)
                }
            }
            fetchRoles()
        }
    }, [open])

    const validateProfile = () => {
        const newErrors: Record<string, string> = {}
        if (!formData.firstName) newErrors.firstName = 'First name required'
        if (!formData.userName) newErrors.userName = 'User name required'
        if (!formData.email) newErrors.email = 'Email required'
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!validateProfile()) {
            setActiveTab('profile')
            return
        }

        setLoading(true)

        const result = await inviteUser({
            email: formData.email,
            fullName: `${formData.firstName} ${formData.lastName}`.trim(),
            systemRole: formData.systemRole,
            roleId: formData.roleId === 'no-role' ? undefined : formData.roleId,
            mobile: formData.mobile,
            countryId: formData.countryId,
            subdivisionId: formData.subdivisionId,
        })

        setLoading(true)
        setTimeout(() => setLoading(false), 500)

        if (result.error) {
            toast({
                title: 'Operation Failed',
                description: result.error,
                variant: 'destructive',
                className: "bg-red-500 text-white border-none shadow-2xl"
            })
            setLoading(false)
        } else {
            setOpen(false)
            setFormData({
                email: '', firstName: '', lastName: '', userName: '',
                mobile: '', countryId: '', subdivisionId: '',
                systemRole: 'user', roleId: ''
            })
            setErrors({})
            setActiveTab('profile')
            router.refresh()

            toast({
                title: 'User Onboarded Successfully',
                description: result.message,
                className: 'bg-indigo-600 text-white border-none shadow-2xl',
                duration: 5000,
            })
        }
    }

    return (
        <Dialog open={open} onOpenChange={(val) => {
            setOpen(val)
            if (!val) {
                setActiveTab('profile')
                setErrors({})
            }
        }}>
            <DialogTrigger asChild>
                <Button className="bg-indigo-600 hover:bg-slate-900 text-white shadow-xl h-12 px-6 rounded-xl font-bold transition-all hover:-translate-y-1 active:translate-y-0 group">
                    <UserPlus className="h-4 w-4 mr-2" />
                    New Team Member
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] w-[95vw] max-h-[90vh] p-0 overflow-hidden flex flex-col bg-white border-none rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.1)]">
                <form onSubmit={handleSubmit} className="flex flex-col h-full overflow-hidden">
                    {/* Header */}
                    <div className="p-6 md:p-8 border-b border-slate-100 shrink-0 bg-slate-50/50">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-100 shrink-0">
                                <UserCircle className="w-7 h-7" />
                            </div>
                            <div className="flex-1">
                                <DialogTitle className="text-xl font-black text-slate-900 tracking-tight">Onboard Global Talent</DialogTitle>
                                <DialogDescription className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-0.5">Configure access and regional identity</DialogDescription>
                            </div>
                            <button type="button" onClick={() => setOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors hidden md:block">
                                <X className="w-5 h-5 text-slate-400" />
                            </button>
                        </div>
                    </div>

                    {/* Scrollable Content Area */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8">
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="bg-slate-100 p-1 rounded-xl h-12 w-full mb-8 grid grid-cols-2">
                                <TabsTrigger
                                    value="profile"
                                    className="rounded-lg font-bold text-xs uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm transition-all flex items-center gap-2"
                                >
                                    <Fingerprint className="w-3.5 h-3.5" />
                                    1. Identity
                                </TabsTrigger>
                                <TabsTrigger
                                    value="access"
                                    className="rounded-lg font-bold text-xs uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm transition-all flex items-center gap-2"
                                >
                                    <Globe className="w-3.5 h-3.5" />
                                    2. Regional
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="profile" className="m-0 space-y-6 animate-in fade-in slide-in-from-left-4 duration-300 focus-visible:outline-none">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">First Name *</Label>
                                        <Input
                                            placeholder="First Name"
                                            className={cn("h-12 bg-white border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10", errors.firstName && "border-red-500")}
                                            value={formData.firstName}
                                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Last Name</Label>
                                        <Input
                                            placeholder="Last Name"
                                            className="h-12 bg-white border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10"
                                            value={formData.lastName}
                                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">System Username *</Label>
                                        <Input
                                            placeholder="username"
                                            className={cn("h-12 bg-white border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10", errors.userName && "border-red-500")}
                                            value={formData.userName}
                                            onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Mobile Contact</Label>
                                        <div className="h-12 flex items-center bg-white border border-slate-200 rounded-xl px-3 focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all">
                                            <PhoneInput
                                                international
                                                defaultCountry="IN"
                                                value={formData.mobile}
                                                onChange={(val) => setFormData({ ...formData, mobile: val || '' })}
                                                className="w-full text-sm outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="md:col-span-2 space-y-1.5">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address *</Label>
                                        <Input
                                            type="email"
                                            placeholder="user@example.com"
                                            className={cn("h-12 bg-white border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10", errors.email && "border-red-500")}
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="access" className="m-0 space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 focus-visible:outline-none">
                                <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 flex items-center gap-3">
                                    <Globe className="w-5 h-5 text-indigo-600" />
                                    <p className="text-xs font-bold text-indigo-900">Configure regional scaling and system permissions.</p>
                                </div>

                                <GeographySelector
                                    selectedCountryId={formData.countryId}
                                    onCountryChange={(id) => setFormData({ ...formData, countryId: id })}
                                    onSubdivisionChange={(id) => setFormData({ ...formData, subdivisionId: id })}
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5 ml-1">
                                            <Shield className="w-3.5 h-3.5" /> System Power
                                        </Label>
                                        <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-xl">
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, systemRole: 'user' })}
                                                className={cn(
                                                    "py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all",
                                                    formData.systemRole === 'user' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500"
                                                )}
                                            >
                                                Standard
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, systemRole: 'admin' })}
                                                className={cn(
                                                    "py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all",
                                                    formData.systemRole === 'admin' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500"
                                                )}
                                            >
                                                Admin
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5 ml-1">
                                            <Briefcase className="w-3.5 h-3.5" /> HMS Core Role
                                        </Label>
                                        <SearchableSelect
                                            options={currentRoles.map(r => ({ label: r.name, id: r.id }))}
                                            value={formData.roleId}
                                            onChange={(val) => setFormData({ ...formData, roleId: val || '' })}
                                            onSearch={async (q) => currentRoles.filter(r => r.name.toLowerCase().includes(q.toLowerCase())).map(r => ({ label: r.name, id: r.id }))}
                                            placeholder="Select Core Role"
                                            className="h-12 bg-white border-slate-200 rounded-xl"
                                        />
                                    </div>
                                </div>
                            </TabsContent>
                    </div>
                </div>

                {/* Footer - Sticky with fixed height */}
                <div className="p-6 md:p-8 border-t border-slate-100 shrink-0 bg-slate-50/50 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex gap-1.5">
                        <div className={cn("w-6 h-1 rounded-full transition-all", activeTab === 'profile' ? "bg-indigo-600" : "bg-slate-200")} />
                        <div className={cn("w-6 h-1 rounded-full transition-all", activeTab === 'access' ? "bg-indigo-600" : "bg-slate-200")} />
                    </div>

                    <div className="flex gap-3 w-full md:w-auto">
                        {activeTab === 'profile' ? (
                            <Button
                                type="button"
                                onClick={() => {
                                    if (validateProfile()) setActiveTab('access')
                                }}
                                className="w-full md:w-auto bg-slate-900 text-white font-bold h-12 px-8 rounded-xl flex items-center gap-2 group"
                            >
                                Regional Settings
                                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        ) : (
                            <>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => setActiveTab('profile')}
                                    className="font-bold text-slate-500 h-12 px-6"
                                >
                                    Back
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 md:flex-none bg-indigo-600 hover:bg-slate-900 text-white font-bold h-12 px-10 rounded-xl shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2"
                                >
                                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Save className="h-4 w-4" /> Create User</>}
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </form>
        </DialogContent>
        </Dialog >
    )
}
