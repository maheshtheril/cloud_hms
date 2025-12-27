
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export const dynamic = 'force-dynamic';

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
    prisma = new PrismaClient();
} else {
    if (!(global as any).prisma) {
        (global as any).prisma = new PrismaClient();
    }
    prisma = (global as any).prisma;
}

export async function GET() {
    try {
        console.log("Attempting to drop broken triggers via API...");

        // 1. Drop Hms Invoice History Trigger
        await prisma.$executeRawUnsafe(`DROP TRIGGER IF EXISTS trg_hms_invoice_history ON hms_invoice CASCADE;`);
        await prisma.$executeRawUnsafe(`DROP FUNCTION IF EXISTS trg_hms_invoice_history() CASCADE;`);

        // 2. Drop Invoice Lines History Trigger
        await prisma.$executeRawUnsafe(`DROP TRIGGER IF EXISTS trg_hms_invoice_lines_history ON hms_invoice_lines CASCADE;`);
        await prisma.$executeRawUnsafe(`DROP FUNCTION IF EXISTS trg_hms_invoice_lines_history() CASCADE;`);

        // 3. Drop Invoice Lines After Change Trigger (Original Culprit)
        await prisma.$executeRawUnsafe(`DROP TRIGGER IF EXISTS trg_hms_invoice_lines_after_change ON hms_invoice_lines CASCADE;`);
        await prisma.$executeRawUnsafe(`DROP FUNCTION IF EXISTS trg_hms_invoice_lines_after_change() CASCADE;`);

        // 4. Drop Invoice After Change Trigger
        await prisma.$executeRawUnsafe(`DROP TRIGGER IF EXISTS trg_hms_invoice_after_change ON hms_invoice CASCADE;`);
        await prisma.$executeRawUnsafe(`DROP FUNCTION IF EXISTS trg_hms_invoice_after_change() CASCADE;`);

        // 5. Drop Update Invoice Total Trigger
        await prisma.$executeRawUnsafe(`DROP TRIGGER IF EXISTS update_invoice_total ON hms_invoice_lines CASCADE;`);
        await prisma.$executeRawUnsafe(`DROP FUNCTION IF EXISTS update_invoice_total() CASCADE;`);

        // 6. Drop Update Invoice Totals Trigger
        await prisma.$executeRawUnsafe(`DROP TRIGGER IF EXISTS update_invoice_totals ON hms_invoice_lines CASCADE;`);
        await prisma.$executeRawUnsafe(`DROP FUNCTION IF EXISTS update_invoice_totals() CASCADE;`);

        // 7. Drop Sync Triggers (Immutable, Insert, Delete, Update)
        await prisma.$executeRawUnsafe(`DROP TRIGGER IF EXISTS trg_hms_invoice_immutable ON hms_invoice CASCADE;`);
        await prisma.$executeRawUnsafe(`DROP FUNCTION IF EXISTS trg_hms_invoice_immutable() CASCADE;`);

        await prisma.$executeRawUnsafe(`DROP TRIGGER IF EXISTS trg_hms_sync_invoice_lines_insert ON hms_invoice CASCADE;`);
        await prisma.$executeRawUnsafe(`DROP FUNCTION IF EXISTS trg_hms_sync_invoice_lines_insert() CASCADE;`);

        await prisma.$executeRawUnsafe(`DROP TRIGGER IF EXISTS trg_hms_sync_invoice_lines_delete ON hms_invoice CASCADE;`);
        await prisma.$executeRawUnsafe(`DROP FUNCTION IF EXISTS trg_hms_sync_invoice_lines_delete() CASCADE;`);

        await prisma.$executeRawUnsafe(`DROP TRIGGER IF EXISTS trg_hms_sync_invoice_lines_update ON hms_invoice CASCADE;`);
        await prisma.$executeRawUnsafe(`DROP FUNCTION IF EXISTS trg_hms_sync_invoice_lines_update() CASCADE;`);


        return NextResponse.json({ success: true, message: "Triggers dropped successfully." });
    } catch (error: any) {
        console.error("Fix DB API Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
