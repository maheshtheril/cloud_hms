import { NextResponse } from 'next/server';
import { signup } from '@/app/actions/auth';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
        return NextResponse.json({ error: 'Need email' }, { status: 400 });
    }

    try {
        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', '12345678');
        formData.append('name', 'Test User');
        formData.append('companyName', 'Test Company');
        formData.append('modules', 'hms,crm');

        const result = await signup(null, formData);

        return NextResponse.json({
            message: 'Signup executed',
            result: result
        });
    } catch (e: any) {
        return NextResponse.json({ error: e.message, stack: e.stack }, { status: 500 });
    }
}
