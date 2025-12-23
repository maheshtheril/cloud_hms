
import { getUserProfile } from '@/app/actions/settings'
import { ProfileForm } from '@/components/settings/profile-form'
import { redirect } from 'next/navigation'

export default async function ProfilePage() {
    const user = await getUserProfile()

    if (!user) {
        redirect('/login')
    }

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <div className="flex flex-col gap-2 mb-10">
                <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                    User Profile
                </h1>
                <p className="text-lg text-slate-500 font-medium">
                    Personalize your workspace identity.
                </p>
            </div>

            <ProfileForm user={user} />
        </div>
    )
}
