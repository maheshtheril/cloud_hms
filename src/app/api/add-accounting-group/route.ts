import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// ONE-SHOT MIGRATION: Adds the missing accounting_group column to hms_patient.
// Hit this endpoint ONCE after deployment to fix the P2022 error.
export async function GET() {
    try {
        await prisma.$executeRawUnsafe(`
            ALTER TABLE hms_patient
            ADD COLUMN IF NOT EXISTS accounting_group TEXT DEFAULT 'general';
        `);
        return NextResponse.json({
            success: true,
            message: "Column 'accounting_group' added to hms_patient. P2022 error is now resolved."
        });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
