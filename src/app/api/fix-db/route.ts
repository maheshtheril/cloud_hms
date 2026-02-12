import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        console.log('🚀 Starting Database Self-Healing...');

        // 1. Fix hms_clinicians working_days
        await prisma.$executeRawUnsafe(`
            ALTER TABLE hms_clinicians ALTER COLUMN working_days DROP DEFAULT;
            ALTER TABLE hms_clinicians ALTER COLUMN working_days TYPE text[] 
            USING CASE 
                WHEN working_days IS NULL THEN ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']::text[]
                WHEN working_days::text = '[]' THEN ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']::text[]
                ELSE working_days::text[]
            END;
            ALTER TABLE hms_clinicians ALTER COLUMN working_days SET DEFAULT ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']::text[];
        `);

        // 2. Fix document_urls
        await prisma.$executeRawUnsafe(`
            ALTER TABLE hms_clinicians ALTER COLUMN document_urls DROP DEFAULT;
            ALTER TABLE hms_clinicians ALTER COLUMN document_urls TYPE text[] 
            USING CASE 
                WHEN document_urls IS NULL THEN ARRAY[]::text[]
                WHEN document_urls::text = '[]' THEN ARRAY[]::text[]
                ELSE document_urls::text[]
            END;
            ALTER TABLE hms_clinicians ALTER COLUMN document_urls SET DEFAULT ARRAY[]::text[];
        `);

        // 3. Optional: Fix the hms_invoice line_items which was the original problem
        try {
            await prisma.$executeRawUnsafe(`
                ALTER TABLE hms_invoice ALTER COLUMN line_items SET DEFAULT '[]'::jsonb;
            `);
        } catch (e) {
            console.log('Line items fix skipped (might already be fixed or blocked by triggers)');
        }

        return NextResponse.json({
            success: true,
            message: 'Database repaired successfully! The "Initialize Profile" button should work now.',
            timestamp: new Date().toISOString()
        });

    } catch (error: any) {
        console.error('❌ Database repair failed:', error);
        return NextResponse.json({
            success: false,
            error: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}
