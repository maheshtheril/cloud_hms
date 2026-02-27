import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { getPaymentGatewayConfig } from '@/app/actions/settings';
import { NotificationService } from '@/lib/services/notification';
import { auth } from '@/auth';

export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { amount, patientId, customerName, customerPhone } = await req.json();

        if (!amount || !patientId) {
            return NextResponse.json({ error: 'Missing required fields: amount, patientId' }, { status: 400 });
        }

        // 1. Fetch Gateway Config
        const companyId = (session.user as any).companyId || session.user.tenantId;
        const tenantId = session.user.tenantId;
        const config = await getPaymentGatewayConfig(companyId, tenantId);
        if (!config?.enabled || !config?.keyId || !config?.keySecret) {
            return NextResponse.json({ error: 'Payment gateway is not configured or disabled' }, { status: 400 });
        }

        // 2. Initialize Razorpay
        const razorpay = new Razorpay({
            key_id: config.keyId,
            key_secret: config.keySecret,
        });

        // 3. Create Payment Link
        // Reference: https://razorpay.com/docs/api/payments/payment-links/
        const paymentLink = await razorpay.paymentLink.create({
            amount: Math.round(amount * 100), // In paisa
            currency: 'INR',
            accept_partial: false,
            description: `Medical Service Payment - ${customerName || 'Patient'}`,
            customer: {
                name: customerName || 'Patient',
                contact: customerPhone?.replace(/\D/g, '') || '',
            },
            notify: {
                sms: false,
                email: false,
            },
            reminder_enable: true,
            notes: {
                patientId: patientId,
                tenantId: session.user.tenantId,
            },
            callback_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://cloud-hms.onrender.com'}/hms/billing/payment-success`,
            callback_method: 'get'
        });

        // 4. Send via WhatsApp
        const whatsappRes = await NotificationService.sendPaymentLinkWhatsapp(
            patientId,
            amount,
            paymentLink.short_url,
            '₹'
        );

        return NextResponse.json({
            success: true,
            paymentLink: paymentLink.short_url,
            whatsappSent: whatsappRes.success,
            whatsappError: whatsappRes.error
        });

    } catch (error: any) {
        console.error('[Razorpay-Link-Error]', error);
        return NextResponse.json({
            error: error.message || 'Failed to create payment link'
        }, { status: 500 });
    }
}
