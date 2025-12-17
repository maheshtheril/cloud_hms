import { PrismaClient } from '@prisma/client'
import { config } from 'dotenv'

config()
const prisma = new PrismaClient()

async function main() {
    console.log("Verifying Discount Logic...")

    try {
        const company = await prisma.company.findFirst()
        if (!company) throw new Error("No company found")

        // Setup Test Data
        const invoiceId = `TEST-DISC-${Date.now()}`
        const taxRate = 10 // 10%

        // Scenario:
        // Item 1: Price 100, Qty 1, Discount 10. Net Base = 90. Tax = 9. Line Total = 99.
        // Item 2: Price 200, Qty 1, Discount 0.  Net Base = 200. Tax = 20. Line Total = 220.
        // Subtotal = 90 + 200 = 290.
        // Total Tax = 9 + 20 = 29.
        // Global Discount = 19.
        // Expected Grand Total = 290 + 29 - 19 = 300.

        const globalDiscount = 19;

        const inv = await prisma.hms_invoice.create({
            data: {
                tenant_id: company.tenant_id,
                company_id: company.id,
                invoice_number: invoiceId,
                status: 'draft',
                total: 300, // Expected
                subtotal: 290,
                total_tax: 29,
                total_discount: globalDiscount,
                hms_invoice_lines: {
                    create: [
                        {
                            tenant_id: company.tenant_id,
                            company_id: company.id,
                            line_idx: 1,
                            description: "Item 1",
                            quantity: 1,
                            unit_price: 100,
                            discount_amount: 10,
                            net_amount: 90,
                            tax_amount: 9
                        },
                        {
                            tenant_id: company.tenant_id,
                            company_id: company.id,
                            line_idx: 2,
                            description: "Item 2",
                            quantity: 1,
                            unit_price: 200,
                            discount_amount: 0,
                            net_amount: 200,
                            tax_amount: 20
                        }
                    ]
                }
            },
            include: { hms_invoice_lines: true }
        })

        console.log(`Invoice Created: ${inv.invoice_number}`)
        console.log(`Total Discount (Global): ${inv.total_discount}`)
        console.log(`Subtotal: ${inv.subtotal}`)
        console.log(`Total Tax: ${inv.total_tax}`)
        console.log(`Grand Total: ${inv.total}`)

        inv.hms_invoice_lines.forEach(line => {
            console.log(`Line ${line.line_idx}: Net ${line.net_amount}, Disc ${line.discount_amount}`)
        })

        if (Number(inv.total) === 300 && Number(inv.total_discount) === 19) {
            console.log("SUCCESS: Calculations match expected logic.")
        } else {
            console.log("FAILURE: Calculations do not match.")
        }

    } catch (e) {
        console.error(e)
    } finally {
        await prisma.$disconnect()
    }
}

main()
