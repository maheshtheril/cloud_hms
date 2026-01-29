import { SignupForm } from "@/components/auth/signup-form"
import { getTenantBrandingByHost } from "@/app/actions/branding"

export const dynamic = 'force-dynamic'

export default async function SignupPage(props: {
    searchParams: Promise<{ org?: string }>
}) {
    // Standard Next.js 15 pattern: Await props
    const searchParams = await props.searchParams;
    const branding = await getTenantBrandingByHost(searchParams?.org);

    return (
        <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100 via-slate-50 to-white dark:from-slate-900 dark:via-slate-950 dark:to-black">
            <SignupForm setIsLogin={() => { }} branding={branding} />
        </div>
    )
}
