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
        <div className="min-h-screen bg-futuristic">
            {/* Animated Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none" >
                <div className="absolute top-0 -left-4 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
                <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
            </div >

            <div className="relative container mx-auto p-6 max-w-5xl space-y-8">
                <div className="flex flex-col gap-2">
                    <h1 className="text-4xl font-bold tracking-tight text-gradient-primary">Field Intelligence</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-lg">
                        Architect and customize your data capture ecosystem.
                    </p>
                </div>

                <Tabs defaultValue="lead" className="w-full space-y-8">
                    <TabsList className="bg-white/20 dark:bg-slate-900/40 p-1 rounded-2xl backdrop-blur-md border border-white/10 w-fit">
                        <TabsTrigger value="lead" className="rounded-xl px-6 py-2.5 font-bold data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-all">Leads</TabsTrigger>
                        <TabsTrigger value="deal" disabled className="rounded-xl px-6 py-2.5 font-bold opacity-50">Deals (Soon)</TabsTrigger>
                        <TabsTrigger value="company" disabled className="rounded-xl px-6 py-2.5 font-bold opacity-50">Companies (Soon)</TabsTrigger>
                    </TabsList>

                    <TabsContent value="lead" className="mt-0">
                        <Card className="glass-card bg-white/40 dark:bg-slate-900/40 border-white/20 shadow-2xl backdrop-blur-xl">
                            <CardHeader className="flex flex-row items-center justify-between border-b border-white/10 pb-6">
                                <div>
                                    <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">Lead Attribution</CardTitle>
                                    <CardDescription className="text-slate-500 dark:text-slate-400">Configure parameters captured during lead inception.</CardDescription>
                                </div>
                                <UpsertFieldDialog entity="lead" />
                            </CardHeader>
                            <CardContent className="pt-6">
                                <FieldList fields={leadFields} entity="lead" />
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div >
    )
}
