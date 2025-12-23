'use client'

import { useState } from 'react'
import { useFormState } from 'react-dom'
import { updateProfile, ProfileFormState } from '@/app/actions/settings'
import { FileUpload } from '@/components/ui/file-upload'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SubmitButton } from '@/components/ui/submit-button'
import { User, Sparkles, Shield, Mail, CheckCircle2 } from 'lucide-react'

export function ProfileForm({ user }: { user: any }) {
    const initialState: ProfileFormState = {}
    const [state, dispatch] = useFormState(updateProfile, initialState)
    const [avatarUrl, setAvatarUrl] = useState<string>(user.metadata?.avatar_url || '')

    return (
        <form action={dispatch} className="space-y-8">
            {/* Hidden input for avatar URL */}
            <input type="hidden" name="avatar_url" value={avatarUrl} />

            <div className="flex flex-col xl:flex-row gap-8 items-start">

                {/* Avatar Section */}
                <div className="w-full xl:w-1/3 space-y-4">
                    <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/20 dark:border-white/10 p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-indigo-500/20 to-transparent pointer-events-none" />

                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-6 relative z-10">Visual Identity</h3>

                        <div className="flex flex-col items-center gap-6 relative z-10">
                            <div className="w-40 h-40 rounded-full overflow-hidden ring-4 ring-white dark:ring-slate-800 shadow-2xl relative group-hover:scale-105 transition-transform duration-500">
                                {avatarUrl ? (
                                    <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-5xl">
                                        {user.name?.substring(0, 2).toUpperCase()}
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Sparkles className="w-8 h-8 text-white/80" />
                                </div>
                            </div>

                            <div className="w-full space-y-4">
                                <FileUpload
                                    label="Update Avatar"
                                    onUploadComplete={(url) => setAvatarUrl(url)}
                                    folder="avatars"
                                    accept="image/*"
                                    currentFileUrl={avatarUrl}
                                />
                                <p className="text-[10px] text-center text-slate-400 font-medium leading-relaxed">
                                    High-res PNG or JPG recommended. <br /> Optimized for Neural Display.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Details Section */}
                <div className="flex-1 w-full space-y-6">
                    <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/20 dark:border-white/10 p-8 md:p-10 rounded-[2.5rem] shadow-xl space-y-8">
                        <div className="flex items-center gap-4 border-b border-white/10 pb-8">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                                <User className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">Personal Information</h3>
                                <p className="text-sm text-slate-500 font-medium mt-1">Manage your digital presence and identification credentials.</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Full Designation Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    defaultValue={user.name}
                                    required
                                    className="h-14 bg-white/50 dark:bg-slate-900/50 border-slate-200/50 rounded-2xl font-bold text-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Secure Uplink (Email)</Label>
                                <div className="relative group">
                                    <Input
                                        id="email"
                                        name="email"
                                        defaultValue={user.email}
                                        readOnly
                                        className="h-14 pl-12 bg-slate-100 dark:bg-slate-800/50 border-transparent rounded-2xl text-slate-500 font-mono text-sm cursor-not-allowed"
                                    />
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                        <Shield className="h-4 w-4 text-emerald-500" />
                                    </div>
                                </div>
                                <p className="text-[10px] text-amber-500 font-bold ml-1 flex items-center gap-1 mt-2">
                                    <Shield className="h-3 w-3" />
                                    Identity protocol locked. Contact System Administrator for modifications.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end items-center gap-4 pt-4">
                        <Button variant="ghost" type="button" onClick={() => window.history.back()} className="text-slate-500 hover:text-slate-900 font-bold">
                            Abort
                        </Button>
                        <SubmitButton className="h-14 px-10 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-2xl font-black shadow-xl shadow-indigo-500/20 active:scale-95 transition-all">
                            Save Changes
                        </SubmitButton>
                    </div>

                    {state?.message && (
                        <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-2xl font-bold text-sm flex items-center justify-center gap-3 animate-in fade-in slide-in-from-bottom-2">
                            <div className="p-1 bg-emerald-500 rounded-full text-white">
                                <CheckCircle2 className="h-4 w-4" />
                            </div>
                            {state.message}
                        </div>
                    )}

                    {state?.error && (
                        <div className="p-6 bg-rose-500/10 border border-rose-500/20 text-rose-600 rounded-2xl font-bold text-sm text-center">
                            {state.error}
                        </div>
                    )}

                </div>
            </div>
        </form>
    )
}
