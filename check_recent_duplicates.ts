
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    console.log("Checking for recent duplicates (past 1 hour)...");
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    const recentDuplicates = await prisma.$queryRaw`
        SELECT 
            i.patient_id, 
            p.first_name, 
            p.last_name, 
            i.invoice_number,
            il.description,
            il.created_at,
            i.status
        FROM hms_invoice_lines il
        JOIN hms_invoice i ON il.invoice_id = i.id
        JOIN hms_patient p ON i.patient_id = p.id
        WHERE il.description LIKE '%Registration Fee%'
        AND il.created_at > ${oneHourAgo}
        ORDER BY il.created_at DESC;
    `;

    console.log("Recent Registration Fee Lines:", JSON.stringify(recentDuplicates, null, 2));

    const allDupes = await prisma.$queryRaw`
        SELECT 
            i.patient_id, 
            p.first_name, 
            p.last_name, 
            COUNT(il.id) as line_count,
            array_agg(il.created_at ORDER BY il.created_at) as timestamps
        FROM hms_invoice_lines il
        JOIN hms_invoice i ON il.invoice_id = i.id
        JOIN hms_patient p ON i.patient_id = p.id
        WHERE il.description LIKE '%Registration Fee%'
        GROUP BY i.patient_id, p.first_name, p.last_name
        HAVING COUNT(il.id) > 1
        ORDER BY MAX(il.created_at) DESC
        LIMIT 5;
    `;

    console.log("Groups with duplicates:", JSON.stringify(allDupes, null, 2));
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
