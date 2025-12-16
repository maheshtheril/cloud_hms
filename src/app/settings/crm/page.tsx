import { getPipelines, getSources } from '@/app/actions/crm/masters'
import { PipelineManager } from './pipeline-manager'
import { SourceManager } from './source-manager'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'

export default async function CRMGlobalSettingsPage() {
    const pipelines = await getPipelines(true)
    const sources = await getSources()

    return (
        <div className="container mx-auto p-6 max-w-5xl">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">CRM Master Settings</h1>

            <Tabs defaultValue="pipelines" className="w-full">
                <TabsList className="mb-6">
                    <TabsTrigger value="pipelines">Pipelines & Stages</TabsTrigger>
                    <TabsTrigger value="sources">Lead Sources</TabsTrigger>
                </TabsList>

                <TabsContent value="pipelines">
                    <PipelineManager pipelines={pipelines} />
                </TabsContent>

                <TabsContent value="sources">
                    <Card>
                        <CardContent className="pt-6">
                            <SourceManager sources={sources} />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
