
import { prisma } from "@/lib/prisma";

async function main() {
    const expenses = await prisma.accounts.findMany({
        where: { type: 'Expense' },
        select: { name: true, code: true }
    });
    console.log("Expense Accounts found:", expenses.length);
    if (expenses.length > 0) {
        console.log("Samples:", expenses.slice(0, 5).map(e => `${e.code} - ${e.name}`));
    } else {
        console.log("No expense accounts found! Dropdown will be empty.");
    }
}
main();
