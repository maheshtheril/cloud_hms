
import { Metadata } from 'next'
import { TargetForm } from '@/components/crm/targets/target-form'

export const metadata: Metadata = {
    title: 'Set Target | SAAS ERP',
    description: 'Set a new performance target',
}

export default function NewTargetPage() {
    return (
        <div className="container mx-auto py-8">
            <TargetForm />
        </div>
    )
}
