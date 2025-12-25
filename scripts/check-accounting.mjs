
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

// Load .env manually since dotenv might not be there
try {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
        const envConfig = fs.readFileSync(envPath, 'utf8');
        for (const line of envConfig.split('\n')) {
            const [key, value] = line.split('=');
            if (key && value) {
                process.env[key.trim()] = value.trim().replace(/"/g, '');
            }
        }
    }
} catch (e) {
    console.log('Could not load .env', e);
}

const prisma = new PrismaClient();

async function checkSettings() {
    try {
        const settings = await prisma.company_accounting_settings.findMany();
        console.log('Accounting Settings Found:', settings.length);
        console.log(JSON.stringify(settings, null, 2));

        // Check for Accounts
        const accounts = await prisma.accounts.findMany({
            where: { name: { in: ['Accounts Receivable', 'Sales', 'Tax Payable', 'Cash'] } }
        });
        console.log('Key Accounts Found:', JSON.stringify(accounts, null, 2));

    } catch (e) {
        console.error('Error:', e);
    } finally {
        await prisma.$disconnect();
    }
}

checkSettings();
