'use client'

import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getRoles } from '@/app/actions/role'
import Link from 'next/link'
import { UserPlus, Mail, Shield, User, Loader2, Check, Copy, Globe, Phone, Tag, UserCircle } from 'lucide-react'
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

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        // Basic validation
        const newErrors: Record<string, string> = {}
        if (!formData.firstName) newErrors.firstName = 'First name required'
        if (!formData.userName) newErrors.userName = 'User name required'
        if (!formData.mobile) newErrors.mobile = 'Phone number required'
        if (!formData.email) newErrors.email = 'Email required'

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
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
            router.refresh()

            const isEmailFailed = result.emailStatus === 'failed'
            toast({
                title: isEmailFailed ? 'Account Created (Email Delayed)' : 'User Onboarded Successfully',
                variant: 'default',
                className: isEmailFailed ? 'border-indigo-500 bg-slate-900 text-white shadow-[0_20px_50px_rgba(79,70,229,0.3)]' : 'bg-indigo-600 text-white border-none shadow-2xl',
                description: (
                    <div className="flex flex-col gap-5 mt-3">
                        <div className="flex items-center gap-3">
                            <div className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                                isEmailFailed ? "bg-amber-500/20 text-amber-400" : "bg-white/20 text-white"
                            )}>
                                {isEmailFailed ? <Mail className="w-5 h-5 animate-pulse" /> : <Check className="w-5 h-5" />}
                            </div>
                            <p className="text-sm font-bold leading-tight">
                                {result.message}
                            </p>
                        </div>

                        {result.inviteLink && (
                            <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 space-y-3">
                                <div className="flex items-center justify-between">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-indigo-300">Manual Activation Route</p>
                                    <span className="px-2 py-0.5 bg-indigo-500 text-[9px] font-bold rounded-full uppercase tracking-tighter">Instant Link</span>
                                </div>
                                <Button
                                    size="sm"
                                    onClick={() => {
                                        navigator.clipboard.writeText(result.inviteLink!)
                                        toast({
                                            title: "Link Copied!",
                                            description: "Send this to the user via WhatsApp or DM.",
                                            className: "bg-emerald-600 text-white border-none shadow-lg"
                                        })
                                    }}
                                    className="w-full bg-indigo-500 hover:bg-white hover:text-indigo-600 text-white font-black h-11 shadow-xl transition-all active:scale-95 group"
                                >
                                    <Copy className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform" />
                                    Copy Secure Invite Link
                                </Button>
                            </div>
                        )}
                    </div>
                ),
                duration: 10000,
            })
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-[0_10px_20px_rgba(79,70,229,0.3)] h-12 px-6 rounded-xl font-bold transition-all hover:translate-y-[-2px] active:translate-y-[0px]">
                    <UserPlus className="h-5 w-5 mr-2" />
                    Create Global User
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] bg-white/95 backdrop-blur-2xl border-white/20 shadow-[0_20px_70px_rgba(0,0,0,0.1)] p-0 overflow-hidden rounded-[32px]">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

                <form onSubmit={handleSubmit}>
                    <div className="p-8 space-y-8 max-h-[80vh] overflow-y-auto custom-scrollbar">
                        <DialogHeader>
                            <div className="flex items-center gap-4 mb-2">
                                <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                                    <UserCircle className="w-7 h-7" />
                                </div>
                                <div>
                                    <DialogTitle className="text-2xl font-black text-slate-900 tracking-tight">Create User</DialogTitle>
                                    <DialogDescription className="text-slate-500 font-medium">Configure profile and regional settings for the new member.</DialogDescription>
                                </div>
                            </div>
                        </DialogHeader>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Personal Details */}
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">First Name *</Label>
                                <Input
                                    placeholder="First name"
                                    className={cn("h-12 bg-white/50 border-slate-200/50 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 transition-all", errors.firstName && "border-red-500 bg-red-50")}
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                />
                                {errors.firstName && <p className="text-[10px] font-bold text-red-500 uppercase">{errors.firstName}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Last Name</Label>
                                <Input
                                    placeholder="Last name"
                                    className="h-12 bg-white/50 border-slate-200/50 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">User Name *</Label>
                                <Input
                                    placeholder="User Name"
                                    className={cn("h-12 bg-white/50 border-slate-200/50 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 transition-all", errors.userName && "border-red-500 bg-red-50")}
                                    value={formData.userName}
                                    onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                                />
                                {errors.userName && <p className="text-[10px] font-bold text-red-500 uppercase">{errors.userName}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Mobile *</Label>
                                <div className={cn("phone-input-container h-12 flex items-center bg-white/50 border border-slate-200/50 rounded-xl px-3 transition-all focus-within:ring-2 focus-within:ring-indigo-500", errors.mobile && "border-red-500 bg-red-50")}>
                                    <PhoneInput
                                        international
                                        defaultCountry="IN"
                                        value={formData.mobile}
                                        onChange={(val) => setFormData({ ...formData, mobile: val || '' })}
                                        className="w-full outline-none bg-transparent"
                                    />
                                </div>
                                {errors.mobile && <p className="text-[10px] font-bold text-red-500 uppercase mt-1">{errors.mobile}</p>}
                            </div>

                            <div className="md:col-span-2 space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email Address *</Label>
                                <Input
                                    type="email"
                                    placeholder="Email Address"
                                    className={cn("h-12 bg-white/50 border-slate-200/50 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 transition-all", errors.email && "border-red-500 bg-red-50")}
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                                {errors.email && <p className="text-[10px] font-bold text-red-500 uppercase">{errors.email}</p>}
                            </div>
                        </div>

                        {/* Region & Logic */}
                        <div className="pt-6 border-t border-slate-100 space-y-6">
                            <div className="flex items-center gap-2 mb-2">
                                <Globe className="w-4 h-4 text-indigo-500" />
                                <span className="text-sm font-bold text-slate-800">Regional & System Configuration</span>
                            </div>

                            <GeographySelector
                                selectedCountryId={formData.countryId}
                                onCountryChange={(id) => setFormData({ ...formData, countryId: id })}
                                onSubdivisionChange={(id) => setFormData({ ...formData, subdivisionId: id })}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                        <Shield className="w-3 h-3" /> System Role
                                    </Label>
                                    <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, systemRole: 'user' })}
                                            className={cn(
                                                "py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all",
                                                formData.systemRole === 'user' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:bg-white/50"
                                            )}
                                        >
                                            Standard
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, systemRole: 'admin' })}
                                            className={cn(
                                                "py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all",
                                                formData.systemRole === 'admin' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:bg-white/50"
                                            )}
                                        >
                                            Administrator
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                        <Tag className="w-3 h-3" /> Primary Core Role
                                    </Label>
                                    <SearchableSelect
                                        options={currentRoles.map(r => ({ label: r.name, value: r.id }))}
                                        value={formData.roleId}
                                        onValueChange={(val) => setFormData({ ...formData, roleId: val })}
                                        placeholder="Select Core Role"
                                        className="h-12 bg-white/50 border-slate-200/50 rounded-xl"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="p-8 bg-slate-50 border-t border-slate-100 gap-3">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setOpen(false)}
                            className="font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-200/50 h-12 rounded-xl transition-all"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-indigo-600 hover:bg-slate-900 text-white font-black h-12 px-10 rounded-xl shadow-xl shadow-indigo-200 transition-all flex items-center gap-2 active:scale-95"
                        >
                            {loading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <>
                                    <UserPlus className="h-5 w-5" />
                                    Dispatch Invitation
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
