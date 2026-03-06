import { redirect } from 'next/navigation'

export default async function RedirectToNewUOMPage() {
    redirect('/hms/inventory/uom')
}
