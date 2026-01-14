import { generateCRMGuidePDF } from '@/app/actions/crm-guide-pdf'

export async function GET() {
    try {
        const buffer = await generateCRMGuidePDF()

        return new Response(new Uint8Array(buffer), {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename=CRM_World_Standard_Guide.pdf',
            },
        })
    } catch (error) {
        console.error('Failed to generate CRM PDF:', error)
        return Response.json({ error: 'Failed to generate PDF' }, { status: 500 })
    }
}
