import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        // Run the migration
        await prisma.$executeRawUnsafe(`
      DO $$ 
      BEGIN
          IF EXISTS (
              SELECT 1 
              FROM information_schema.columns 
              WHERE table_name = 'hms_clinicians' 
              AND column_name = 'document_urls' 
              AND data_type = 'ARRAY'
          ) THEN
              ALTER TABLE hms_clinicians 
              ALTER COLUMN document_urls 
              SET DATA TYPE jsonb 
              USING to_jsonb(document_urls);
              
              ALTER TABLE hms_clinicians 
              ALTER COLUMN document_urls 
              SET DEFAULT '[]'::jsonb;
              
              RAISE NOTICE 'Converted document_urls to JSONB';
          END IF;
      END $$;
    `);

        // Verify the change
        const result: any = await prisma.$queryRawUnsafe(`
      SELECT data_type, udt_name 
      FROM information_schema.columns 
      WHERE table_name = 'hms_clinicians' 
      AND column_name = 'document_urls'
    `);

        return NextResponse.json({
            success: true,
            message: 'Migration completed',
            currentType: result[0]
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
