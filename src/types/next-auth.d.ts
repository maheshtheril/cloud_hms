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
            role?: string | null
            current_branch_id?: string | null
            dbUrl?: string | null
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
        role?: string | null
        current_branch_id?: string | null
        dbUrl?: string | null
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
        role?: string | null
        current_branch_id?: string | null
        dbUrl?: string | null
    }
}
