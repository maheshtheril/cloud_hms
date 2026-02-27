import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getPaymentGatewayConfig } from '@/app/actions/settings'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
    const session = await auth()
    if (!session?.user?.companyId || !session?.user?.tenantId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json()

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return NextResponse.json({ error: 'Missing payment verification fields.' }, { status: 400 })
    }

    const config = await getPaymentGatewayConfig(session.user.companyId, session.user.tenantId)
    if (!config?.keySecret) {
        return NextResponse.json({ error: 'Gateway not configured.' }, { status: 400 })
    }

    // HMAC SHA256 signature verification — industry standard
    const body = `${razorpay_order_id}|${razorpay_payment_id}`
    const expectedSignature = crypto
        .createHmac('sha256', config.keySecret)
        .update(body)
        .digest('hex')

    if (expectedSignature !== razorpay_signature) {
        console.warn('[RAZORPAY] Signature mismatch — possible tampered request.')
        return NextResponse.json({ verified: false, error: 'Payment signature verification failed.' }, { status: 400 })
    }

    return NextResponse.json({
        verified: true,
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
    })
}
