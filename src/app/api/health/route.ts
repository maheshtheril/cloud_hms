
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
// import { seedRoles } from '../../../prisma/seed-roles';
// Note: We need to adapt seed-roles to be importable or copy logic. 
// For simplicity, I will implement a basic seed here or ensure the seed file is safe.
// Actually, let's just create a simple success check.

export async function GET() {
    try {
        // Simple check if DB works
        const count = await prisma.app_user.count();
        return NextResponse.json({
            success: true,
            message: "Database is connected!",
            userCount: count,
            info: "To seed data, we might need to run a dedicated script."
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
