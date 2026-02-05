const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function debug() {
    console.log("Starting Debug Invoice Create...");
    try {
        const tenant = await prisma.tenant.findFirst();
        if (!tenant) { console.error("No tenant found"); return; }
        const tenantId = tenant.id;
        const company = await prisma.company.findFirst({ where: { tenant_id: tenantId } });
        const companyId = company?.id || tenantId;

        console.log(`Using Tenant: ${tenantId}, Company: ${companyId}`);

        const result = await prisma.hms_invoice.create({
            data: {
                tenant_id: tenantId,
                company_id: companyId,
                invoice_number: "DEBUG-TEST-" + Date.now(),
                invoice_date: new Date(),
                issued_at: new Date(),
                currency: 'INR',
                subtotal: 100,
                total_tax: 0,
                total_discount: 0,
                total: 100,
                total_paid: 0,
                status: 'draft',
                outstanding: 100,
                line_items: [],
                hms_invoice_lines: {
                    create: [{
                        tenant_id: tenantId,
                        company_id: companyId,
                        line_idx: 1,
                        description: "Debug Line",
                        quantity: 1,
                        unit_price: 100,
                        discount_amount: 0,
                        tax_amount: 0,
                        net_amount: 100,
                        uom: "Unit"
                    }]
                }
            }
        });
        console.log("Success! ID:", result.id);
        await prisma.hms_invoice.delete({ where: { id: result.id } });
    } catch (err) {
        console.error("FAILED CREATE DUMMY:");
        console.error(err);
        if (err.meta) console.error("META:", JSON.stringify(err.meta));
    } finally {
        await prisma.$disconnect();
    }
}

debug();
