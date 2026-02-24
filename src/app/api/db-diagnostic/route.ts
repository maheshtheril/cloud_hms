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

    const duplicateRegFees: any = await prisma.$queryRaw`
      SELECT 
          i.patient_id, 
          p.first_name, 
          p.last_name, 
          COUNT(il.id) as line_count,
          MIN(il.created_at) as first_insert,
          MAX(il.created_at) as last_insert,
          array_agg(il.created_at) as all_timestamps
      FROM hms_invoice_lines il
      JOIN hms_invoice i ON il.invoice_id = i.id
      JOIN hms_patient p ON i.patient_id = p.id
      WHERE il.description LIKE '%Registration Fee%'
      GROUP BY i.patient_id, p.first_name, p.last_name
      HAVING COUNT(il.id) > 1
      ORDER BY last_insert DESC
      LIMIT 10;
    `;

    return NextResponse.json({
      success: true,
      db_url: process.env.DATABASE_URL,
      connectivity: testQuery,
      triggers: triggers,
      clinician_columns: clinicianCols,
      appointment_array_columns: appointmentCols,
      invoice_status_column: invoiceCols,
      duplicate_registration_fees: duplicateRegFees
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      code: error.code
    }, { status: 500 });
  }
}
