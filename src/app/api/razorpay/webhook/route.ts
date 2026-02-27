import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { prisma } from '@/lib/prisma'

// Razorpay sends payloads as raw text — we must NOT use json() parsing
export async function POST(req: NextRequest) {
    const rawBody = await req.text()
    const signature = req.headers.get('x-razorpay-signature') || ''

    // The webhook secret is configured in Razorpay Dashboard → Webhooks
    // It's different from the API Key Secret. Store it as RAZORPAY_WEBHOOK_SECRET env var.
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET

    if (!webhookSecret) {
        // Webhook secret not configured — skip verification but still process
        console.warn('[RAZORPAY WEBHOOK] RAZORPAY_WEBHOOK_SECRET not set — skipping signature check')
    } else {
        const expectedSig = crypto
            .createHmac('sha256', webhookSecret)
            .update(rawBody)
            .digest('hex')

        if (expectedSig !== signature) {
            console.error('[RAZORPAY WEBHOOK] Invalid signature — rejecting request')
            return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 })
        }
    }

    let event: any
    try {
        event = JSON.parse(rawBody)
    } catch {
        return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }

    const eventType = event.event

    // Handle successful payment
    if (eventType === 'payment.captured' || eventType === 'order.paid') {
        const payment = event.payload?.payment?.entity || event.payload?.order?.entity
        const notes = payment?.notes || {}
        const invoiceId = notes.invoiceId

        console.log(`[RAZORPAY WEBHOOK] ${eventType} — InvoiceId: ${invoiceId}, PaymentId: ${payment?.id}`)

        if (invoiceId) {
            try {
                // Find the invoice and mark it as paid
                const invoice = await prisma.hms_invoice.findUnique({
                    where: { id: invoiceId }
                })

                if (invoice && invoice.status !== 'paid') {
                    await prisma.hms_invoice.update({
                        where: { id: invoiceId },
                        data: {
                            status: 'paid' as any,
                            updated_at: new Date(),
                        }
                    })
                    console.log(`[RAZORPAY WEBHOOK] Invoice ${invoiceId} marked as paid. PaymentId: ${payment?.id}`)
                }
            } catch (err) {
                console.error('[RAZORPAY WEBHOOK] Failed to update invoice:', err)
                // Still return 200 to Razorpay — avoid re-delivery spam
            }
        }
    }

    // Always return 200 OK to tell Razorpay the webhook was received
    return NextResponse.json({ received: true })
}
