'use client'

import { seedRolesAndPermissions } from "@/app/actions/rbac"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Sparkles } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export function SeedRolesButton() {
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()
    const router = useRouter()

    const handleSeed = async () => {
        setLoading(true)
        try {
            const result = await seedRolesAndPermissions()

            if ('error' in result) {
                toast({
                    title: "Error",
                    description: result.error,
                    variant: "destructive"
                })
            } else {
                toast({
                    title: "Success",
                    description: result.message
                })
                router.refresh()
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to seed roles",
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Button
            onClick={handleSeed}
            disabled={loading}
            className="gap-2"
        >
            {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <Sparkles className="h-4 w-4" />
            )}
            Seed Default Roles
        </Button>
    )
}
