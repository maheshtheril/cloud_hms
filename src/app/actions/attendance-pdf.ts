'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import PDFDocument from 'pdfkit'
import { format } from 'date-fns'

export async function generateAttendancePDF() {
    const session = await auth()
    if (!session?.user?.tenantId) throw new Error("Unauthorized")

    const tenantId = session.user.tenantId
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    // Fetch data
    const records = await prisma.hms_staff_attendance.findMany({
        where: {
            tenant_id: tenantId,
            check_in: { gte: thirtyDaysAgo }
        },
        orderBy: { check_in: 'desc' },
    })

    // Fetch user names for the report
    const userIds = [...new Set(records.map(r => r.user_id))]
    const users = await prisma.app_user.findMany({
        where: { id: { in: userIds } },
        select: { id: true, name: true }
    })
    const userMap = new Map(users.map(u => [u.id, u.name]))

    return new Promise<Buffer>((resolve, reject) => {
        const doc = new PDFDocument({ margin: 50, size: 'A4' })
        const chunks: Buffer[] = []

        doc.on('data', (chunk) => chunks.push(chunk))
        doc.on('end', () => resolve(Buffer.concat(chunks)))
        doc.on('error', reject)

        // --- HEADER ---
        doc.rect(0, 0, 612, 120).fill('#020617')
        doc.fillColor('#6366f1').fontSize(10).text('TACTICAL OPERATIONS REPORT', 50, 40, { characterSpacing: 2 })
        doc.fillColor('#ffffff').fontSize(24).font('Helvetica-Bold').text('Workforce Performance Audit', 50, 60)
        doc.fillColor('#94a3b8').fontSize(9).text(`GENERATED: ${format(new Date(), 'PPpp')} | SYSTEM-ID: HMS-IQ-7`, 50, 90)

        // --- KPI TILES ---
        let y = 150
        const total = records.length
        const lates = records.filter(r => r.status === 'late').length
        const rate = total > 0 ? Math.round(((total - lates) / total) * 100) : 0

        doc.rect(50, y, 150, 60).fill('#f8fafc').stroke('#e2e8f0')
        doc.fillColor('#64748b').fontSize(8).text('STRIKE RATE', 65, y + 15)
        doc.fillColor('#0f172a').fontSize(18).text(`${rate}%`, 65, y + 30)

        doc.rect(220, y, 150, 60).fill('#f8fafc').stroke('#e2e8f0')
        doc.fillColor('#64748b').fontSize(8).text('TOTAL DEPLOYMENTS', 235, y + 15)
        doc.fillColor('#0f172a').fontSize(18).text(`${total}`, 235, y + 30)

        doc.rect(390, y, 150, 60).fill('#f8fafc').stroke('#e2e8f0')
        doc.fillColor('#64748b').fontSize(8).text('DEVIATIONS', 405, y + 15)
        doc.fillColor('#b91c1c').fontSize(18).text(`${lates}`, 405, y + 30)

        // --- TABLE HEADER ---
        y = 250
        doc.fillColor('#475569').fontSize(10).font('Helvetica-Bold').text('DATE', 50, y)
        doc.text('PERSONNEL', 150, y)
        doc.text('SIGNAL IN', 300, y)
        doc.text('SIGNAL OUT', 400, y)
        doc.text('STATUS', 500, y)
        doc.moveTo(50, y + 15).lineTo(550, y + 15).stroke('#cbd5e1')

        // --- DATA ROWS ---
        y += 30
        records.forEach((record, i) => {
            if (y > 750) {
                doc.addPage()
                y = 50
            }

            doc.fillColor('#1e293b').fontSize(9).font('Helvetica').text(format(new Date(record.check_in), 'MMM dd'), 50, y)
            doc.text(userMap.get(record.user_id) || 'Unknown', 150, y)
            doc.text(format(new Date(record.check_in), 'HH:mm'), 300, y)
            doc.text(record.check_out ? format(new Date(record.check_out), 'HH:mm') : '--:--', 400, y)

            if (record.status === 'late') {
                doc.fillColor('#b91c1c').text('LATE', 500, y)
            } else {
                doc.fillColor('#059669').text('NOMINAL', 500, y)
            }

            y += 25
            if (i < records.length - 1) {
                doc.moveTo(50, y - 10).lineTo(550, y - 10).stroke('#f1f5f9')
            }
        })

        // --- FOOTER ---
        doc.fontSize(8).fillColor('#94a3b8').text('CONFIDENTIAL - FOR AUTHORIZED MANAGEMENT ONLY', 50, 780, { align: 'center' })

        doc.end()
    })
}
