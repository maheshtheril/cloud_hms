import { getTaxRates } from "@/app/actions/inventory"
import { NextResponse } from "next/server"

export async function GET() {
    const rates = await getTaxRates()
    return NextResponse.json({ rates })
}
