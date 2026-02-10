
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
    try {
        console.log("Testing getEmployees with supervisor include...");
        const employees = await prisma.crm_employee.findMany({
            take: 1,
            include: {
                supervisor: true
            }
        });
        console.log("Success! Found:", employees.length);
        if (employees.length > 0) {
            console.log("Employee:", employees[0].first_name);
            console.log("Supervisor:", employees[0].supervisor ? employees[0].supervisor.first_name : "None");
        }
    } catch (e) {
        console.error("FAILED to include supervisor:", e.message);
    } finally {
        await prisma.$disconnect();
    }
}

test();
