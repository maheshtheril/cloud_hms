import { NextRequest, NextResponse } from 'next/server'
import vision from '@google-cloud/vision'

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData()
        const imageFile = formData.get('image') as File

        if (!imageFile) {
            return NextResponse.json({ error: 'No image provided' }, { status: 400 })
        }

        // Convert file to buffer
        const buffer = Buffer.from(await imageFile.arrayBuffer())

        // Initialize Google Vision client
        const client = new vision.ImageAnnotatorClient({
            credentials: JSON.parse(process.env.GOOGLE_CLOUD_VISION_CREDENTIALS || '{}')
        })

        // Perform handwriting/text detection
        const [result] = await client.documentTextDetection(buffer)
        const fullTextAnnotation = result.fullTextAnnotation
        const text = fullTextAnnotation?.text || ''

        return NextResponse.json({
            success: true,
            text: text,
            confidence: fullTextAnnotation?.pages?.[0]?.confidence || 0
        })

    } catch (error: any) {
        console.error('Handwriting recognition error:', error)
        return NextResponse.json({
            error: 'Failed to recognize handwriting',
            details: error.message
        }, { status: 500 })
    }
}
