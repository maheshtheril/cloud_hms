'use client'

import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getRoles } from '@/app/actions/role'
import {
    UserPlus, Mail, Shield, Loader2, Check, Copy,
    Globe, Phone, Tag, UserCircle, Briefcase,
    Fingerprint, MapPin, ChevronRight, Save
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

            const isEmailFailed = result.emailStatus === 'failed'
            toast({
                title: isEmailFailed ? 'Account Created (Email Delayed)' : 'User Onboarded Successfully',
                description: result.message,
                className: isEmailFailed ? 'border-indigo-500 bg-slate-900 text-white shadow-2xl' : 'bg-indigo-600 text-white border-none shadow-2xl',
                duration: 10000,
            })
        }
    }

    return (
        <Dialog open={open} onOpenChange={(val) => {
            setOpen(val)
            if (!val) setActiveTab('profile')
        }}>
            <DialogTrigger asChild>
                <Button className="bg-indigo-600 hover:bg-slate-900 text-white shadow-[0_10px_30px_rgba(79,70,229,0.4)] h-14 px-8 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all hover:translate-y-[-4px] active:translate-y-[0px] group">
                    <UserPlus className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform" />
                    Expand Team
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[750px] bg-white/95 backdrop-blur-3xl border-white/20 shadow-[0_40px_100px_rgba(0,0,0,0.2)] p-0 overflow-hidden rounded-[40px]">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

                <form onSubmit={handleSubmit} className="flex flex-col h-full">
                    <div className="p-10 pb-6">
                        <DialogHeader className="mb-8">
                            <div className="flex items-center gap-6 mb-2">
                                <div className="w-16 h-16 rounded-[24px] bg-gradient-to-br from-indigo-600 to-violet-700 flex items-center justify-center text-white shadow-2xl shadow-indigo-200 ring-8 ring-indigo-50">
                                    <UserCircle className="w-9 h-9" />
                                </div>
                                <div>
                                    <DialogTitle className="text-3xl font-black text-slate-900 tracking-tightest">Create Enterprise User</DialogTitle>
                                    <DialogDescription className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1">Global Organization Intelligence Hub</DialogDescription>
                                </div>
                            </div>
                        </DialogHeader>

                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="bg-slate-100/80 p-1.5 rounded-2xl h-16 w-full mb-8 grid grid-cols-2">
                                <TabsTrigger
                                    value="profile"
                                    className="rounded-xl font-black uppercase tracking-widest text-[10px] data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-lg shadow-indigo-100 transition-all flex items-center gap-2"
                                >
                                    <Fingerprint className="w-4 h-4" />
                                    1. Personal Alpha
                                </TabsTrigger>
                                <TabsTrigger
                                    value="access"
                                    className="rounded-xl font-black uppercase tracking-widest text-[10px] data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-lg shadow-indigo-100 transition-all flex items-center gap-2"
                                >
                                    <Globe className="w-4 h-4" />
                                    2. Regional & Access
                                </TabsTrigger>
                            </TabsList>

                            <div className="min-h-[400px]">
                                <TabsContent value="profile" className="m-0 space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
                                    <div className="grid grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">First Identity *</Label>
                                            <Input
                                                placeholder="First Name"
                                                className={cn("h-14 bg-white border-slate-200/60 rounded-2xl shadow-sm focus:ring-4 focus:ring-indigo-500/10 font-bold", errors.firstName && "border-red-500 ring-4 ring-red-500/10")}
                                                value={formData.firstName}
                                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                            />
                                        </div>

                                        <div className="space-y-3">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Last Identity</Label>
                                            <Input
                                                placeholder="Last Name"
                                                className="h-14 bg-white border-slate-200/60 rounded-2xl shadow-sm focus:ring-4 focus:ring-indigo-500/10 font-bold"
                                                value={formData.lastName}
                                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                            />
                                        </div>

                                        <div className="space-y-3">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">System Username *</Label>
                                            <Input
                                                placeholder="username.exclusive"
                                                className={cn("h-14 bg-white border-slate-200/60 rounded-2xl shadow-sm focus:ring-4 focus:ring-indigo-500/10 font-bold", errors.userName && "border-red-500 ring-4 ring-red-500/10")}
                                                value={formData.userName}
                                                onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                                            />
                                        </div>

                                        <div className="space-y-3">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Primary Mobile</Label>
                                            <div className="phone-input-container h-14 flex items-center bg-white border border-slate-200/60 rounded-2xl px-4 shadow-sm focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all">
                                                <PhoneInput
                                                    international
                                                    defaultCountry="IN"
                                                    value={formData.mobile}
                                                    onChange={(val) => setFormData({ ...formData, mobile: val || '' })}
                                                    className="w-full font-bold outline-none"
                                                />
                                            </div>
                                        </div>

                                        <div className="col-span-2 space-y-3">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
                                                <Mail className="w-3 h-3" /> Digital Communications Address *
                                            </Label>
                                            <Input
                                                type="email"
                                                placeholder="professional@organization.com"
                                                className={cn("h-14 bg-white border-slate-200/60 rounded-2xl shadow-sm focus:ring-4 focus:ring-indigo-500/10 font-bold", errors.email && "border-red-500 ring-4 ring-red-500/10")}
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="access" className="m-0 space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-3 bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100">
                                            <MapPin className="w-5 h-5 text-indigo-600" />
                                            <span className="text-xs font-black text-indigo-900 uppercase tracking-widest">Global Positioning Intelligence</span>
                                        </div>

                                        <GeographySelector
                                            selectedCountryId={formData.countryId}
                                            onCountryChange={(id) => setFormData({ ...formData, countryId: id })}
                                            onSubdivisionChange={(id) => setFormData({ ...formData, subdivisionId: id })}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-8 pt-6 border-t border-slate-100">
                                        <div className="space-y-4">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 ml-1">
                                                <Shield className="w-3.5 h-3.5" /> Authority Bracket
                                            </Label>
                                            <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200/50">
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, systemRole: 'user' })}
                                                    className={cn(
                                                        "py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all",
                                                        formData.systemRole === 'user' ? "bg-white text-indigo-600 shadow-md ring-1 ring-black/5" : "text-slate-500 hover:bg-white/50"
                                                    )}
                                                >
                                                    Standard
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, systemRole: 'admin' })}
                                                    className={cn(
                                                        "py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all",
                                                        formData.systemRole === 'admin' ? "bg-white text-indigo-600 shadow-md ring-1 ring-black/5" : "text-slate-500 hover:bg-white/50"
                                                    )}
                                                >
                                                    Admin
                                                </button>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 ml-1">
                                                <Briefcase className="w-3.5 h-3.5" /> Functional Role Core
                                            </Label>
                                            <SearchableSelect
                                                options={currentRoles.map(r => ({ label: r.name, id: r.id }))}
                                                value={formData.roleId}
                                                onChange={(val) => setFormData({ ...formData, roleId: val || '' })}
                                                onSearch={async (q) => currentRoles.filter(r => r.name.toLowerCase().includes(q.toLowerCase())).map(r => ({ label: r.name, id: r.id }))}
                                                placeholder="Select Specialty Role"
                                                className="h-14 bg-white border-slate-200/60 rounded-2xl shadow-sm"
                                            />
                                        </div>
                                    </div>
                                </TabsContent>
                            </div>
                        </Tabs>
                    </div>

                    <DialogFooter className="p-10 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <span className={cn("w-2 h-2 rounded-full", activeTab === 'profile' ? "bg-indigo-600 scale-125" : "bg-slate-300")} />
                            <span className={cn("w-2 h-2 rounded-full", activeTab === 'access' ? "bg-indigo-600 scale-125" : "bg-slate-300")} />
                        </div>

                        <div className="flex gap-4">
                            {activeTab === 'profile' ? (
                                <Button
                                    type="button"
                                    onClick={() => {
                                        if (validateProfile()) setActiveTab('access')
                                    }}
                                    className="bg-slate-900 text-white font-black h-16 px-10 rounded-[20px] shadow-2xl transition-all active:scale-95 group flex items-center gap-3"
                                >
                                    Proceed to Governance
                                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            ) : (
                                <>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => setActiveTab('profile')}
                                        className="font-black text-[10px] uppercase tracking-widest text-slate-400 hover:text-slate-950 h-16 px-8 transition-all"
                                    >
                                        Return to Profile
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="bg-indigo-600 hover:bg-slate-900 text-white font-black h-16 px-12 rounded-[20px] shadow-[0_20px_50px_rgba(79,70,229,0.3)] transition-all flex items-center gap-3 active:scale-95 group"
                                    >
                                        {loading ? (
                                            <Loader2 className="h-6 w-6 animate-spin" />
                                        ) : (
                                            <>
                                                <Save className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                                                Finalize Onboarding
                                            </>
                                        )}
                                    </Button>
                                </>
                            )}
                        </div>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
