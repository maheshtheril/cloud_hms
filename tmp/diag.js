
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    const counts = await prisma.accounts.count();
    console.log('Total accounts:', counts);
    
    const bankAccounts = await prisma.accounts.findMany({
      where: { 
        OR: [
          { name: { contains: 'Bank', mode: 'insensitive' } },
          { code: { startsWith: '10' } },
          { code: { startsWith: '11' } }
        ]
      },
      select: { id: true, name: true, code: true, is_group: true }
    });
    console.log('--- BANK/CASH ACCOUNTS ---');
    console.table(bankAccounts);

    const recentLines = await prisma.journal_entry_lines.findMany({
      take: 20,
      orderBy: { created_at: 'desc' },
      include: { accounts: true }
    });
    console.log('--- RECENT TRANSACTIONS ---');
    console.table(recentLines.map(l => ({
        date: l.created_at,
        account: l.accounts.name,
        code: l.accounts.code,
        debit: l.debit,
        credit: l.credit
    })));

  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
