'use server'

import { auth } from "@/auth"
import { jsPDF } from "jspdf"

export async function generateGuidePDF() {
    const session = await auth()
    if (!session) throw new Error("Unauthorized")

    // Create a new PDF document
    const doc = new jsPDF({
        orientation: "p",
        unit: "pt",
        format: "a4"
    })

    // --- COLORS ---
    const primaryColor = [2, 6, 23] // #020617
    const accentColor = [99, 102, 241] // #6366f1
    const textColor = [30, 41, 59] // #1e293b
    const lightText = [148, 163, 184] // #94a3b8

    // --- HEADER ---
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2])
    doc.rect(0, 0, 612, 120, 'F')
    doc.setTextColor(accentColor[0], accentColor[1], accentColor[2])
    doc.setFont("helvetica", "bold")
    doc.setFontSize(10)
    doc.text('SYSTEM DOCUMENTATION', 50, 45, { charSpace: 2 })
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(24)
    doc.text('Tactical Guide: Staff Systems', 50, 75)
    doc.setTextColor(lightText[0], lightText[1], lightText[2])
    doc.setFontSize(9)
    doc.text('VERSION 2.1 | HMS OPERATIONS UNIT', 50, 100)

    let y = 160
    const pageWidth = 512

    const sections = [
        {
            title: '1. Module Overview',
            content: 'The system is divided into three primary administrative wings, accessible via the HMS sidebar:\n\n' +
                '• Staff Attendance: The personal mission-control for staff members to initialize their shifts.\n' +
                '• Staff Roster: The strategic deployment grid for hospital administrators.\n' +
                '• Staff Analytics: The intelligence hub for workforce reliability and audit reporting.'
        },
        {
            title: '2. User Manual: Staff Operations',
            content: 'How to Record a Shift (Punch-In/Out):\n\n' +
                '• Navigate to the Attendance page.\n' +
                '• Identify Authorized Shift: The system will automatically scan the roster and display your scheduled shift details.\n' +
                '• Initialize Mission: Click the INITIALIZE button (Indigo). Telemetry, IP, and location are logged.\n' +
                '• Terminate Mission: Click TERMINATE (Red) to synchronize your total duration to the central archive.'
        },
        {
            title: '3. Admin Manual: Strategic Rostering',
            content: 'Creating Shift Protocols:\n\n' +
                '• Go to the Staff Roster page and click INITIALIZE PROTOCOL.\n' +
                '• Define Identity, Timing, and Spectrum (Color).\n\n' +
                'Deploying Personnel:\n\n' +
                '• In the Weekly Roster Grid, find the staff member and day.\n' +
                '• Click the "+" icon to select a shift protocol.\n' +
                '• Note: Hover and click "X" to retract a deployment.'
        },
        {
            title: '4. Admin Manual: Intelligence & Auditing',
            content: 'Monitoring Performance:\n\n' +
                '• Navigate to Staff Analytics to monitor Punctuality Rate and Deviations.\n' +
                '• Use the Workforce Activity Trend chart for staffing density analysis.\n\n' +
                'Generating the Performance Audit (PDF):\n\n' +
                '• Click EXPORT PERFORMANCE AUDIT at the top right of the Analytics page to generate a management-ready PDF.'
        },
        {
            title: 'Technical Reference',
            content: '• Schema: Powered by hms_staff_attendance, hms_staff_shift, and hms_staff_roster.\n' +
                '• Security: All actions are multi-tenant scoped (tenant_id).\n' +
                '• Compliance Logic: LATE = (Current Time > Shift Start Time + Grace Period).\n' +
                '• Audit Engine: Powered by jsPDF for cross-platform reliability.'
        }
    ]

    sections.forEach(section => {
        const contentLines = doc.splitTextToSize(section.content, pageWidth)
        const totalHeight = 25 + (contentLines.length * 15) + 30

        if (y + totalHeight > 750) {
            doc.addPage()
            y = 50
        }

        doc.setTextColor(accentColor[0], accentColor[1], accentColor[2])
        doc.setFont("helvetica", "bold")
        doc.setFontSize(14)
        doc.text(section.title, 50, y)
        y += 25

        doc.setTextColor(textColor[0], textColor[1], textColor[2])
        doc.setFont("helvetica", "normal")
        doc.setFontSize(10)
        doc.text(contentLines, 50, y, { lineHeightFactor: 1.5 })
        y += (contentLines.length * 15) + 40
    })

    // --- FOOTER ---
    doc.setFontSize(8)
    doc.setTextColor(lightText[0], lightText[1], lightText[2])
    doc.text('© 2026 HMS CLOUD - CONFIDENTIAL INTEL', 306, 800, { align: 'center' })

    const pdfOutput = doc.output('arraybuffer')
    return Buffer.from(pdfOutput)
}
