import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Test basic database connectivity
    const testQuery = await prisma.$queryRaw`SELECT 1 as test`;

    // Check for triggers on appointments table
    const triggers: any = await prisma.$queryRaw`
      SELECT 
        trigger_name,
        event_manipulation,
        event_object_table,
        action_statement
      FROM information_schema.triggers
      WHERE event_object_table IN ('hms_appointments', 'hms_clinicians')
      ORDER BY event_object_table, trigger_name
    `;

    // Check column types for problematic tables
    const clinicianCols: any = await prisma.$queryRaw`
      SELECT column_name, data_type, udt_name, column_default
      FROM information_schema.columns
      WHERE table_name = 'hms_clinicians'
      AND column_name IN ('working_days', 'document_urls')
    `;

    const appointmentCols: any = await prisma.$queryRaw`
      SELECT column_name, data_type, udt_name, column_default
      FROM information_schema.columns
      WHERE table_name = 'hms_appointments'
      AND data_type = 'ARRAY'
    `;

    const invoiceCols: any = await prisma.$queryRaw`
      SELECT column_name, data_type, udt_name, column_default
      FROM information_schema.columns
      WHERE table_name = 'hms_invoice'
      AND column_name = 'status'
    `;

    return NextResponse.json({
      success: true,
      connectivity: testQuery,
      triggers: triggers,
      clinician_columns: clinicianCols,
      appointment_array_columns: appointmentCols,
      invoice_status_column: invoiceCols
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      code: error.code
    }, { status: 500 });
  }
}
