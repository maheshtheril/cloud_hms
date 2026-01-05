'use server'

import { auth } from "@/auth"
import PDFDocument from 'pdfkit'

export async function generateGuidePDF() {
    const session = await auth()
    if (!session) throw new Error("Unauthorized")

    return new Promise<Buffer>((resolve, reject) => {
        const doc = new PDFDocument({ margin: 50, size: 'A4' })
        const chunks: Buffer[] = []

        doc.on('data', (chunk) => chunks.push(chunk))
        doc.on('end', () => resolve(Buffer.concat(chunks)))
        doc.on('error', reject)

        // --- HEADER ---
        doc.rect(0, 0, 612, 120).fill('#020617')
        doc.fillColor('#6366f1').fontSize(10).text('SYSTEM DOCUMENTATION', 50, 40, { characterSpacing: 2 })
        doc.fillColor('#ffffff').fontSize(24).font('Helvetica-Bold').text('Tactical Guide: Staff Systems', 50, 60)
        doc.fillColor('#94a3b8').fontSize(9).text('VERSION 2.1 | HMS OPERATIONS UNIT', 50, 90)

        let y = 150

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
                    '• Audit Engine: Powered by pdfkit for high-fidelity administrative reporting.'
            }
        ]

        sections.forEach(section => {
            if (y > 700) {
                doc.addPage()
                y = 50
            }
            doc.fillColor('#6366f1').fontSize(14).font('Helvetica-Bold').text(section.title, 50, y)
            y += 25
            doc.fillColor('#1e293b').fontSize(10).font('Helvetica').text(section.content, 50, y, { lineHeight: 15 })
            y += (doc.heightOfString(section.content, { width: 500, lineHeight: 15 }) + 40)
        })

        // --- FOOTER ---
        doc.fontSize(8).fillColor('#94a3b8').text('© 2026 HMS CLOUD - CONFIDENTIAL INTEL', 50, 780, { align: 'center' })

        doc.end()
    })
}
