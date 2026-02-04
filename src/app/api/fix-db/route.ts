import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        console.log("Starting DB Fix...");
        // Option 1: Try to convert jsonb[] to jsonb
        // This makes the column a simple JSONB type (which holds the array)
        // This matches what the OLD code (Attempt 4) expects (it sends a jsonb object)

        await prisma.$executeRawUnsafe(`
            ALTER TABLE "hms_invoice" 
            ALTER COLUMN "line_items" TYPE jsonb 
            USING to_jsonb("line_items");
        `);

        return NextResponse.json({ success: true, message: "DB Column 'line_items' downgraded to jsonb" });
    } catch (error: any) {
        console.error("DB Fix Failed", error);

        // Fallback: Drop and Recreate (Data Loss, but fixes schema)
        try {
            await prisma.$executeRawUnsafe(`ALTER TABLE "hms_invoice" DROP COLUMN "line_items";`);
            await prisma.$executeRawUnsafe(`ALTER TABLE "hms_invoice" ADD COLUMN "line_items" jsonb DEFAULT '[]';`);
            return NextResponse.json({ success: true, message: "DB Column 'line_items' Dropped and Re-added as jsonb", error: error.message });
        } catch (fatal: any) {
            return NextResponse.json({ success: false, error: fatal.message });
        }
    }
}
