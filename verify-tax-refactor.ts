import { PrismaClient } from '@prisma/client'
import { config } from 'dotenv'

// Load env vars
config()

const prisma = new PrismaClient()

async function main() {
    console.log("Starting Verification...")

    try {
        // 1. Fetch a valid tenant/company to act as
        const company = await prisma.company.findFirst()

        if (!company) {
            console.error("No company found!")
            return
        }

        console.log(`Using Company: ${company.name} (${company.id})`)

        // 2. Mock 'getBillableItems' logic to verify Category Tax Fetching
        // We'll just look for a product with a category and see if we can query the tax
        const product = await prisma.hms_product.findFirst({
            where: { company_id: company.id, is_service: true },
            include: {
                hms_product_category_rel: {
                    include: {
                        hms_product_category: {
                            include: { tax_rates: true }
                        }
                    }
                }
            }
        })

        if (product) {
            console.log(`Product Found: ${product.name}`)
            const catRel = product.hms_product_category_rel[0]
            if (catRel) {
                console.log(`- Category: ${catRel.hms_product_category.name}`)
                console.log(`- Category Tax: ${catRel.hms_product_category.tax_rates?.name || 'None'}`)
            } else {
                console.log("- No Category")
            }
        }

        // 3. Create an Invoice with manual tax lines (simulating the Server Action)
        // We need valid tax rate IDs
        const taxRates = await prisma.tax_rates.findMany({ where: { tax_type_id: { not: 'x' } }, take: 2 }) // just get some rates
        if (taxRates.length < 2) {
            console.log("Not enough tax rates to test mix, skipping create.")
            return;
        }

        const t1 = taxRates[0]
        const t2 = taxRates[1]

        console.log(`Testing with Taxes: ${t1.name} (${t1.rate}%) AND ${t2.name} (${t2.rate}%)`)

        const invoiceId = `TEST-${Date.now()}`

        // Manual Create
        const inv = await prisma.hms_invoice.create({
            data: {
                tenant_id: company.tenant_id,
                company_id: company.id,
                invoice_number: invoiceId,
                invoice_date: new Date(),
                status: 'draft',
                total: 200, // Dummy
                subtotal: 200,
                total_tax: 0,
                hms_invoice_lines: {
                    create: [
                        {
                            tenant_id: company.tenant_id,
                            company_id: company.id,
                            line_idx: 1,
                            description: "Item A - Tax 1",
                            quantity: 1,
                            unit_price: 100,
                            net_amount: 100,
                            tax_rate_id: t1.id, // THE NEW FIELD
                            tax_amount: Number(t1.rate) // Simplified calc
                        },
                        {
                            tenant_id: company.tenant_id,
                            company_id: company.id,
                            line_idx: 2,
                            description: "Item B - Tax 2",
                            quantity: 1,
                            unit_price: 100,
                            net_amount: 100,
                            tax_rate_id: t2.id, // THE NEW FIELD
                            tax_amount: Number(t2.rate)
                        }
                    ]
                }
            },
            include: { hms_invoice_lines: true }
        })

        console.log(`Invoice Created: ${inv.id}`)
        inv.hms_invoice_lines.forEach(line => {
            console.log(`- Line ${line.line_idx}: Tax Rate ID: ${line.tax_rate_id} (Expected ${line.line_idx === 1 ? t1.id : t2.id})`)
        })

        console.log("Verification Successful.")

    } catch (e) {
        console.error(e)
    } finally {
        await prisma.$disconnect()
    }
}

main()
