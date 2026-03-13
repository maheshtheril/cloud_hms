import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user?.companyId) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const companyId = session.user.companyId;

  try {
    // 1. Identify all Bank/Cash accounts
    const accounts = await prisma.accounts.findMany({
      where: {
        company_id: companyId,
        OR: [
          { name: { contains: 'Bank', mode: 'insensitive' } },
          { name: { contains: 'Cash', mode: 'insensitive' } },
          { code: { in: ['1001', '1110', '1000', '1050', '1120', '1100'] } }
        ]
      }
    });

    // 2. Check for recent transactions in these accounts
    const accountIds = accounts.map(a => a.id);
    const recentLines = await prisma.journal_entry_lines.findMany({
      where: {
        company_id: companyId,
        account_id: { in: accountIds }
      },
      take: 20,
      orderBy: { created_at: 'desc' },
      include: {
        accounts: { select: { name: true, code: true } },
        journal_entries: { select: { ref: true, date: true, description: true } }
      }
    });

    // 3. Check for any transactions with NULL accounts or weird data
    const ghostLinesCount = await prisma.journal_entry_lines.count({
      where: { company_id: companyId, account_id: null }
    });

    // 4. Summarize Balances
    const balances = await Promise.all(accounts.map(async (acc) => {
      const lines = await prisma.journal_entry_lines.findMany({
        where: { account_id: acc.id }
      });
      const balance = lines.reduce((sum, l) => sum + (Number(l.debit || 0) - Number(l.credit || 0)), 0);
      return { name: acc.name, code: acc.code, balance };
    }));

    return NextResponse.json({
      success: true,
      companyId,
      accountsFound: accounts.length,
      accounts: accounts.map(a => ({ id: a.id, name: a.name, code: a.code, isGroup: a.is_group })),
      recentTransactions: recentLines.map(l => ({
        ref: l.journal_entries.ref,
        date: l.journal_entries.date,
        account: l.accounts.name,
        debit: l.debit,
        credit: l.credit,
        desc: l.description || l.journal_entries.description
      })),
      ghostLinesCount,
      accountBalances: balances
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
