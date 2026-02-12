'use client'

import { useState } from 'react'
import { Trash2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { deleteEmployee } from '@/app/actions/crm/employees'
import { useToast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'

export function EmployeeDeleteButton({ employeeId, variant = 'ghost' }: { employeeId: string, variant?: 'ghost' | 'destructive' | 'outline' }) {
    const [isPending, setIsPending] = useState(false)
    const { toast } = useToast()
    const router = useRouter()

    const handleDelete = async () => {
        if (!confirm('Are you absolutely sure you want to delete this staff record? This will remove them from the directory. (Note: To remove login/clinical access, use Settings > Users)')) return

        setIsPending(true)
        try {
            const result = await deleteEmployee(employeeId)
            if (result.success) {
                toast({
                    title: "Staff Removed",
                    description: "Employee record has been deleted from the CRM directory.",
                    className: "bg-emerald-600 text-white"
                })
                router.push('/crm/employees')
                router.refresh()
            } else {
                toast({
                    title: "Delete Failed",
                    description: result.error || "Could not remove record. They might have active deals or targets.",
                    variant: "destructive"
                })
            }
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive"
            })
        } finally {
            setIsPending(false)
        }
    }

    return (
        <Button
            variant={variant}
            size="icon"
            onClick={handleDelete}
            disabled={isPending}
            className={variant === 'ghost' ? 'text-red-500 hover:text-red-700 hover:bg-red-50' : ''}
        >
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
        </Button>
    )
}
