import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getPaymentGatewayConfig } from '@/app/actions/settings'
import Razorpay from 'razorpay'

export async function POST(req: NextRequest) {
    const session = await auth()
    if (!session?.user?.companyId || !session?.user?.tenantId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { amount, invoiceId, currency = 'INR' } = await req.json()

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
        return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
    }

    const config = await getPaymentGatewayConfig(session.user.companyId, session.user.tenantId)

    if (!config?.enabled) {
        return NextResponse.json({ error: 'Payment gateway is not enabled.' }, { status: 400 })
    }

    if (!config.keyId || !config.keySecret) {
        return NextResponse.json({ error: 'Razorpay keys are not configured. Please add them in Settings → HMS Configuration.' }, { status: 400 })
    }

    try {
        const razorpay = new Razorpay({
            key_id: config.keyId,
            key_secret: config.keySecret,
        })

        // Amount must be in paise (multiply INR by 100)
        const amountInPaise = Math.round(Number(amount) * 100)

        const order = await razorpay.orders.create({
            amount: amountInPaise,
            currency,
            receipt: `hms_${invoiceId || Date.now()}`.slice(0, 40),
            notes: {
                invoiceId: invoiceId || '',
                hospitalName: config.businessName || 'Hospital',
                createdBy: session.user.id || '',
            },
        })

        return NextResponse.json({
            orderId: order.id,
            amount: order.amount,       // In paise
            amountDisplay: amount,      // In rupees, for display
            currency: order.currency,
            keyId: config.keyId,        // Safe to send to frontend (public key)
            businessName: config.businessName,
            upiVpa: config.upiVpa,
        })
    } catch (err: any) {
        console.error('[RAZORPAY] create-order error:', err)
        return NextResponse.json(
            { error: err?.error?.description || err?.message || 'Failed to create payment order.' },
            { status: 500 }
        )
    }
}
