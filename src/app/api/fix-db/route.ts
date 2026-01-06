
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        const s1 = `ALTER TABLE hms_appointments DROP CONSTRAINT IF EXISTS hms_appointments_status_check;`
        await prisma.$executeRawUnsafe(s1)

        const s2 = `ALTER TABLE hms_appointments ADD CONSTRAINT hms_appointments_status_check CHECK (status IN ('scheduled', 'confirmed', 'cancelled', 'completed', 'no_show', 'rescheduled', 'arrived', 'checked_in', 'in_progress'));`
        await prisma.$executeRawUnsafe(s2)

        return NextResponse.json({ success: true, message: "Constraint updated" })
    } catch (error) {
        return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
    }
}
