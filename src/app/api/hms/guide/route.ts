import { generateHMSWorkflowGuidePDF } from '@/app/actions/hms-workflow-guide'

export async function GET() {
    try {
        const buffer = await generateHMSWorkflowGuidePDF()

        return new Response(new Uint8Array(buffer), {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename=HMS_Operational_Standards_Guide.pdf',
            },
        })
    } catch (error) {
        console.error('Failed to generate HMS PDF:', error)
        return Response.json({ error: 'Failed to generate PDF' }, { status: 500 })
    }
}
