import { config } from 'dotenv';
import { PrismaClient } from '@prisma/client';

config({ path: '.env' });

async function main() {
    const prisma = new PrismaClient({
        datasources: {
            db: {
                url: process.env.DATABASE_URL,
            },
        },
    });

    try {
        const receipt = await prisma.hms_purchase_receipt.findFirst({
            orderBy: { created_at: 'desc' },
            include: {
                hms_purchase_receipt_line: true
            }
        });

        if (receipt) {
            console.log('--------------------------------------------------');
            console.log('Latest Receipt FOUND:');
            console.log(`ID: ${receipt.id}`);
            console.log(`Number: ${receipt.name}`);
            console.log(`Created At: ${receipt.created_at}`);
            console.log(`Items: ${receipt.hms_purchase_receipt_line.length}`);
            console.log('--------------------------------------------------');
        } else {
            console.log('No receipts found.');
        }
    } catch (e) {
        console.error("Error querying database:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
