
import { Metadata } from 'next'
import { ContactForm } from '@/components/crm/contacts/contact-form'

export const metadata: Metadata = {
    title: 'New Contact | SAAS ERP',
    description: 'Create a new CRM contact',
}

export default function NewContactPage() {
    return (
        <div className="container mx-auto py-8">
            <ContactForm />
        </div>
    )
}
