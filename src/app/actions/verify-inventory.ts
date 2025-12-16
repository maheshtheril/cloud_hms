
'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { receiveStock } from "./inventory-operations"

export async function verifyReceiveStockScript() {
    const session = await auth()
    if (!session?.user?.companyId) return { error: "Unauthorized" }

    const { companyId, tenantId } = session.user
    const now = new Date()
    const logs: string[] = []

    try {
        logs.push("Starting Verification Process...")

        // 1. Create or Get Test Product
        const testSku = `TEST-STOCK-${now.getTime()}` // Unique SKU
        logs.push(`Creating test product with SKU: ${testSku}`)

        const product = await prisma.hms_product.create({
            data: {
                tenant_id: tenantId,
                company_id: companyId,
                name: `Test Product ${testSku}`,
                sku: testSku,
                uom: 'each',
                price: 100,
                is_active: true,
                metadata: {
                    tracking: 'none'
                }
            }
        })
        logs.push(`Product Created: ${product.id}`)

        // 2. Call receiveStock
        logs.push("calling receiveStock with 10 units...")
        const result = await receiveStock({
            date: new Date(),
            notes: 'Automated Verification Test',
            items: [
                {
                    productId: product.id,
                    quantity: 10,
                    unitCost: 50
                }
            ]
        })

        if (!result.success) {
            logs.push(`ERROR: receiveStock failed: ${result.error}`)
            return { success: false, logs }
        }
        logs.push("receiveStock returned success.")

        // 3. Verify Stock Levels
        logs.push("Verifying hms_stock_levels...")
        const level = await prisma.hms_stock_levels.findFirst({
            where: {
                company_id: companyId,
                product_id: product.id
            }
        })

        if (!level) {
            logs.push("FAIL: Stock Level record not found.")
            return { success: false, logs }
        }

        if (Number(level.quantity) === 10) {
            logs.push("PASS: Stock Level is 10.")
        } else {
            logs.push(`FAIL: Stock Level is ${level.quantity}, expected 10.`)
            return { success: false, logs }
        }

        // 4. Verify Stock Ledger
        logs.push("Verifying hms_stock_ledger...")
        const ledger = await prisma.hms_stock_ledger.findFirst({
            where: {
                company_id: companyId,
                product_id: product.id,
                movement_type: 'in',
                related_type: 'hms_purchase_receipt'
            }
        })

        if (!ledger) {
            logs.push("FAIL: Stock Ledger entry not found.")
            return { success: false, logs }
        }
        logs.push("PASS: Stock Ledger entry found.")

        // Cleanup (Optional - kept to keep DB clean if passing)
        // await prisma.hms_product.delete({ where: { id: product.id } }) 
        // logs.push("Cleanup: Deleted test product.")

        return { success: true, logs }

    } catch (e: any) {
        logs.push(`EXCEPTION: ${e.message}`)
        return { success: false, logs }
    }
}
