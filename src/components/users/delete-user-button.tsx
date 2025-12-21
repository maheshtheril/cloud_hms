'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, Loader2, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from '@/components/ui/use-toast'
import { deleteUserPermanently } from '@/app/actions/users'

interface DeleteUserButtonProps {
    userId: string
    userName: string
}

export function DeleteUserButton({ userId, userName }: DeleteUserButtonProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const { toast } = useToast()

    const handleDelete = async () => {
        setLoading(true)
        try {
            const result = await deleteUserPermanently(userId)
            if (result.error) {
                toast({
                    variant: "destructive",
                    title: "Cannot Delete User",
                    description: result.error,
                })
                setOpen(false)
            } else {
                toast({
                    className: "bg-green-600 text-white border-green-700",
                    title: "User Deleted",
                    description: `${userName} has been permanently deleted.`,
                })
                router.push('/settings/users')
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "An unexpected error occurred.",
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" className="gap-2">
                    <Trash2 className="h-4 w-4" />
                    Delete User
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-white dark:bg-slate-950">
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2 text-destructive">
                        <AlertTriangle className="h-5 w-5" />
                        Delete User Permanently?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete
                        <span className="font-semibold text-foreground"> {userName} </span>
                        and remove their access immediately.
                        <br /><br />
                        If the user has any linked transactions (encounters, appointments, etc.),
                        the deletion will be blocked to preserve data integrity.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
                    <Button
                        variant="destructive"
                        onClick={(e) => {
                            e.preventDefault()
                            handleDelete()
                        }}
                        disabled={loading}
                    >
                        {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                        Delete Permanently
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
