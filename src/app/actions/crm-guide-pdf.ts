'use server'

import { auth } from "@/auth"
import PDFDocument from 'pdfkit'

export async function generateCRMGuidePDF() {
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
        doc.fillColor('#ffffff').fontSize(24).font('Helvetica-Bold').text('Tactical Guide: Enterprise CRM', 50, 60)
        doc.fillColor('#94a3b8').fontSize(9).text('VERSION 1.0 | REVENUE OPERATIONS UNIT', 50, 90)

        let y = 150

        const sections = [
            {
                title: '1. Introduction: The Strategic Edge',
                content: 'Welcome to the CRM module of the Cloud HMS & ERP ecosystem. This is not just a database; it is a Revenue Engine. Designed to provide a 360-degree view of your customer journey, our CRM empowers your team to move from reactive selling to proactive relationship management.'
            },
            {
                title: '2. Lead Management: Your Growth Pipeline',
                content: '• Centralized Capture: View all incoming prospects in the Leads dashboard.\n' +
                    '• Intelligent Qualification: Use custom statuses to move leads from Open to Qualified or Follow-up.\n' +
                    '• Instant Conversion: One-click conversion creates an Account, a Contact, and a Deal automatically.\n' +
                    '• Bulk Import/Export: Seamlessly migrate legacy data via Excel/CSV using the specialized Import tool.'
            },
            {
                title: '3. The Sales Pipeline & Deals',
                content: '• Kanban Board: Drag and drop deals between stages (Discovery → Proposal → Negotiation → Closed).\n' +
                    '• Weighted Forecasting: Each stage has associated probability for accurate revenue projections.\n' +
                    '• Deal Analytics: Track deal age, value distribution, and bottleneck stages in real-time.'
            },
            {
                title: '4. Accounts & Contacts: 360-Degree View',
                content: '• Accounts: Parent organizations tracking historical deals and billing info.\n' +
                    '• Contacts: Individual stakeholders. Stores communication preferences and history.\n' +
                    '• Hierarchy: Link multiple contacts to a single account for complex B2B relationships.'
            },
            {
                title: '5. Activities & Pulse',
                content: '• Log Everything: Record calls, emails, and physical meetings.\n' +
                    '• Task Mastery: Assign follow-up tasks with deadlines.\n' +
                    '• History Timeline: Chronological audit trail of every interaction.'
            },
            {
                title: '6. Global Scheduler & Targets',
                content: '• Unified Calendar: View upcoming customer meetings and demos.\n' +
                    '• Revenue Quotas: Set monthly, quarterly, or annual financial targets.\n' +
                    '• Compliance Tracking: See who is on track and who requires support in the Target Compliance view.'
            },
            {
                title: '7. Customization & Insights',
                content: '• Custom Fields: Add text, numbers, or dropdowns to any Lead or Deal.\n' +
                    '• Field Layouts: Organize fields into sections matching your workflow.\n' +
                    '• Executive Dashboards: Real-time summaries of ROI trends and pipeline velocity.'
            }
        ]

        sections.forEach(section => {
            if (y > 700) {
                doc.addPage()
                y = 50
            }
            doc.fillColor('#6366f1').fontSize(14).font('Helvetica-Bold').text(section.title, 50, y)
            y += 25
            doc.fillColor('#1e293b').fontSize(10).font('Helvetica').text(section.content, 50, y, { lineGap: 5 })
            y += (doc.heightOfString(section.content, { width: 500, lineGap: 5 }) + 30)
        })

        // --- FOOTER ---
        doc.fontSize(8).fillColor('#94a3b8').text('© 2026 HMS CLOUD - ENTERPRIRE CRM CONFIDENTIAL', 50, 780, { align: 'center' })

        doc.end()
    })
}
