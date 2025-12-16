
import { getTenantCompanies } from '@/app/actions/company'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Building2, Plus } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const dynamic = 'force-dynamic'

export default async function TenantCompaniesPage() {
    const result = await getTenantCompanies()

    if (result.error) {
        return <div className="p-4 text-red-500">Error: {result.error}</div>
    }

    const companies = result.data || []

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">Companies</h2>
                <Button asChild>
                    <Link href="/tenant/companies/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Company
                    </Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {companies.map((company) => (
                    <Card key={company.id} className="hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-lg font-medium">
                                {company.name}
                            </CardTitle>
                            <Building2 className="h-4 w-4 text-gray-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500">Industry</span>
                                    <span className="text-sm font-medium">{company.industry || 'N/A'}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500">Status</span>
                                    <Badge variant={company.enabled ? 'default' : 'secondary'}>
                                        {company.enabled ? 'Active' : 'Inactive'}
                                    </Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {companies.length === 0 && (
                    <div className="col-span-full text-center py-10 text-gray-500 bg-white rounded-lg border border-dashed border-gray-300">
                        <Building2 className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                        <p>No companies found. Create your first one!</p>
                    </div>
                )}
            </div>
        </div>
    )
}
