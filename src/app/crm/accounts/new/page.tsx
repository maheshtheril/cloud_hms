
import { Metadata } from 'next'
import { AccountForm } from '@/components/crm/accounts/account-form'

export const metadata: Metadata = {
    title: 'New Account | SAAS ERP',
    description: 'Create a new CRM account',
}

export default function NewAccountPage() {
    return (
        <div className="container mx-auto py-8">
            <AccountForm />
        </div>
    )
}
