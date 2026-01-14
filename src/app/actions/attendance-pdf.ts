'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { jsPDF } from "jspdf"
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

    // Create PDF
    const doc = new jsPDF({
        orientation: "p",
        unit: "pt",
        format: "a4"
    })

    // --- HEADER ---
    doc.setFillColor(2, 6, 23) // #020617
    doc.rect(0, 0, 612, 120, 'F')

    doc.setTextColor(99, 102, 241) // #6366f1
    doc.setFont("helvetica", "bold")
    doc.setFontSize(10)
    doc.text('TACTICAL OPERATIONS REPORT', 50, 45, { charSpace: 2 })

    doc.setTextColor(255, 255, 255)
    doc.setFontSize(24)
    doc.text('Workforce Performance Audit', 50, 75)

    doc.setTextColor(148, 163, 184) // #94a3b8
    doc.setFontSize(9)
    doc.text(`GENERATED: ${format(new Date(), 'PPpp')} | SYSTEM-ID: HMS-IQ-7`, 50, 100)

    // --- KPI TILES ---
    let y = 150
    const total = records.length
    const lates = records.filter(r => r.status === 'late').length
    const rate = total > 0 ? Math.round(((total - lates) / total) * 100) : 0

    // Box 1
    doc.setFillColor(248, 250, 252)
    doc.setDrawColor(226, 232, 240)
    doc.rect(50, y, 150, 60, 'FD')
    doc.setTextColor(100, 116, 139)
    doc.setFontSize(8)
    doc.text('STRIKE RATE', 65, y + 20)
    doc.setTextColor(15, 23, 42)
    doc.setFontSize(18)
    doc.text(`${rate}%`, 65, y + 45)

    // Box 2
    doc.rect(220, y, 150, 60, 'FD')
    doc.setTextColor(100, 116, 139)
    doc.setFontSize(8)
    doc.text('TOTAL DEPLOYMENTS', 235, y + 20)
    doc.setTextColor(15, 23, 42)
    doc.setFontSize(18)
    doc.text(`${total}`, 235, y + 45)

    // Box 3
    doc.rect(390, y, 150, 60, 'FD')
    doc.setTextColor(100, 116, 139)
    doc.setFontSize(8)
    doc.text('DEVIATIONS', 405, y + 20)
    doc.setTextColor(185, 28, 28)
    doc.setFontSize(18)
    doc.text(`${lates}`, 405, y + 45)

    // --- TABLE HEADER ---
    y = 250
    doc.setTextColor(71, 85, 105)
    doc.setFontSize(10)
    doc.setFont("helvetica", "bold")
    doc.text('DATE', 50, y)
    doc.text('PERSONNEL', 150, y)
    doc.text('SIGNAL IN', 300, y)
    doc.text('SIGNAL OUT', 400, y)
    doc.text('STATUS', 500, y)

    doc.setDrawColor(203, 213, 225)
    doc.line(50, y + 10, 560, y + 10)

    // --- DATA ROWS ---
    y += 35
    records.forEach((record, i) => {
        if (y > 750) {
            doc.addPage()
            y = 50
        }

        doc.setTextColor(30, 41, 59)
        doc.setFontSize(9)
        doc.setFont("helvetica", "normal")
        doc.text(format(new Date(record.check_in), 'MMM dd'), 50, y)
        doc.text(userMap.get(record.user_id) || 'Unknown', 150, y)
        doc.text(format(new Date(record.check_in), 'HH:mm'), 300, y)
        doc.text(record.check_out ? format(new Date(record.check_out), 'HH:mm') : '--:--', 400, y)

        if (record.status === 'late') {
            doc.setTextColor(185, 28, 28)
            doc.text('LATE', 500, y)
        } else {
            doc.setTextColor(5, 150, 105)
            doc.text('NOMINAL', 500, y)
        }

        y += 25
        if (i < records.length - 1) {
            doc.setDrawColor(241, 245, 249)
            doc.line(50, y - 15, 560, y - 15)
        }
    })

    // --- FOOTER ---
    doc.setFontSize(8)
    doc.setTextColor(148, 163, 184)
    doc.text('CONFIDENTIAL - FOR AUTHORIZED MANAGEMENT ONLY', 306, 800, { align: 'center' })

    const pdfOutput = doc.output('arraybuffer')
    return Buffer.from(pdfOutput)
}
