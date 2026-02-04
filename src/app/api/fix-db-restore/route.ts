import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        console.log("Restoring DB Schema to Standard...");
        // Convert jsonb back to jsonb[] (Standard Schema)
        // This wraps the existing single-object jsonb into an array: [obj]

        await prisma.$executeRawUnsafe(`
            ALTER TABLE "hms_invoice" 
            ALTER COLUMN "line_items" TYPE jsonb[] 
            USING ARRAY["line_items"];
        `);

        return NextResponse.json({ success: true, message: "DB Column 'line_items' restored to jsonb[]" });
    } catch (error: any) {
        console.error("DB Restore Failed", error);
        return NextResponse.json({ success: false, error: error.message });
    }
}
