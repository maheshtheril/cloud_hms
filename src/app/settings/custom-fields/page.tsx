import { getCustomFieldDefinitions } from '@/app/actions/crm/custom-fields'
import { FieldList } from './field-list'
import { UpsertFieldDialog } from './upsert-field-dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function CustomFieldsPage() {
    // Currently defaulting to 'lead' entity. 
    // In future this page could use searchParams to switch tabs properly server-side or client-side.
    // implementing basic tabs logic here for future proofing.

    // Fetch all for leads
    const leadFields = await getCustomFieldDefinitions('lead')

    return (
        <div className="container mx-auto p-6 max-w-5xl">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Custom Fields Manager</h1>

            <Tabs defaultValue="lead" className="w-full">
                <TabsList className="mb-4">
                    <TabsTrigger value="lead">Leads</TabsTrigger>
                    <TabsTrigger value="deal" disabled>Deals (Coming Soon)</TabsTrigger>
                    <TabsTrigger value="company" disabled>Companies (Coming Soon)</TabsTrigger>
                </TabsList>

                <TabsContent value="lead">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Lead Fields</CardTitle>
                                <CardDescription>Customize the fields captured when creating new leads</CardDescription>
                            </div>
                            <UpsertFieldDialog entity="lead" />
                        </CardHeader>
                        <CardContent>
                            <FieldList fields={leadFields} entity="lead" />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
