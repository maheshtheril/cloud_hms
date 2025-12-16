
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createContact } from '@/app/actions/crm/contacts'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export function ContactForm() {
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()
    const router = useRouter()

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setLoading(true)

        const formData = new FormData(event.currentTarget)
        const res = await createContact(formData)

        setLoading(false)

        if (res.error) {
            toast({
                title: "Error",
                description: res.error,
                variant: "destructive"
            })
        } else {
            toast({
                title: "Success",
                description: "Contact created successfully."
            })
            router.push('/crm/contacts')
        }
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
            <div className="mb-6 flex items-center gap-4">
                <Link href="/crm/contacts" className="text-gray-500 hover:text-gray-700">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <h1 className="text-2xl font-bold tracking-tight">New Contact</h1>
            </div>

            <Card className="border-gray-200 shadow-sm">
                <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="first_name">First Name <span className="text-red-500">*</span></Label>
                            <Input id="first_name" name="first_name" required placeholder="John" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="last_name">Last Name</Label>
                            <Input id="last_name" name="last_name" placeholder="Doe" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" name="email" type="email" placeholder="john.doe@example.com" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input id="phone" name="phone" type="tel" placeholder="+1 (555) 000-0000" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="job_title">Job Title</Label>
                            <Input id="job_title" name="job_title" placeholder="CEO" />
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2 bg-gray-50 px-6 py-4 rounded-b-xl border-t border-gray-100">
                    <Link href="/crm/contacts">
                        <Button type="button" variant="outline">Cancel</Button>
                    </Link>
                    <Button type="submit" disabled={loading} className="min-w-[120px]">
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            "Create Contact"
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </form>
    )
}
