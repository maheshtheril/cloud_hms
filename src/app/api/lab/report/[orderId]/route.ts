
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ orderId: string }> }
) {
    const session = await auth()
    if (!session?.user?.id) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    const { orderId } = await params

    try {
        const order = await prisma.hms_lab_order.findUnique({
            where: { id: orderId },
            select: { report_url: true }
        })

        if (!order || !order.report_url) {
            return new NextResponse("Report not found", { status: 404 })
        }

        const dataUri = order.report_url

        // Parse Data URI
        // Format: data:[<mediatype>][;base64],<data>
        const matches = dataUri.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)

        if (!matches || matches.length !== 3) {
            return new NextResponse("Invalid report format", { status: 500 })
        }

        const mimeType = matches[1]
        const base64Data = matches[2]
        const buffer = Buffer.from(base64Data, 'base64')

        return new NextResponse(buffer, {
            headers: {
                'Content-Type': mimeType,
                'Content-Disposition': `inline; filename="lab-report-${orderId}.${mimeType.split('/')[1]}"`
            }
        })

    } catch (error) {
        console.error("Error serving lab report:", error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}
