
import LoginClient from "./login-client"
import { getTenantBrandingByHost } from "../actions/branding"

export const dynamic = 'force-dynamic'

export default async function LoginPage() {
    const branding = await getTenantBrandingByHost();

    return <LoginClient branding={branding} />
}
