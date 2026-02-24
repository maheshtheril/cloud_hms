
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        console.log("Querying for duplicate registration fees...");
        const duplicates: any = await prisma.$queryRaw`
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

        if (duplicates.length === 0) {
            console.log("No duplicates found.");
        } else {
            console.log(JSON.stringify(duplicates, null, 2));
        }
    } catch (err) {
        console.error("Error executing query:", err);
    } finally {
        await prisma.$disconnect();
    }
}

main().catch(console.error);
