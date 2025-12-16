import { DefaultSession } from "next-auth"

declare module "next-auth" {
    interface Session {
        user: {
            id: string
            companyId: string | null
            tenantId: string
            isAdmin: boolean
            isTenantAdmin: boolean
            industry: string
            hasCRM: boolean
            hasHMS: boolean
        } & DefaultSession["user"]
    }

    interface User {
        id: string
        companyId: string | null
        tenantId: string
        isAdmin: boolean
        isTenantAdmin: boolean
        industry: string
        hasCRM: boolean
        hasHMS: boolean
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string
        companyId: string | null
        tenantId: string
        isAdmin: boolean
        isTenantAdmin: boolean
        industry: string
        hasCRM: boolean
        hasHMS: boolean
    }
}
