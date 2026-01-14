'use server'

import { auth } from "@/auth"
import { jsPDF } from "jspdf"

export async function generateCRMGuidePDF() {
    const session = await auth()
    if (!session) throw new Error("Unauthorized")

    // Create a new PDF document
    const doc = new jsPDF({
        orientation: "p",
        unit: "pt",
        format: "a4"
    })

    // --- COLORS & STYLES ---
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
    doc.text('Tactical Guide: Enterprise CRM', 50, 75)

    doc.setTextColor(lightText[0], lightText[1], lightText[2])
    doc.setFontSize(9)
    doc.text('VERSION 1.0 | REVENUE OPERATIONS UNIT', 50, 100)

    let y = 160
    const margin = 50
    const pageWidth = 512 // 612 - 100

    const sections = [
        {
            title: '1. Introduction: The Strategic Edge',
            content: 'Welcome to the CRM module of the Cloud HMS & ERP ecosystem. This is not just a database; it is a Revenue Engine. Designed to provide a 360-degree view of your customer journey, our CRM empowers your team to move from reactive selling to proactive relationship management.'
        },
        {
            title: '2. Lead Management: Your Growth Pipeline',
            content: '* Centralized Capture: View all incoming prospects in the Leads dashboard.\n' +
                '* Intelligent Qualification: Use custom statuses to move leads from Open to Qualified or Follow-up.\n' +
                '* Instant Conversion: One-click conversion creates an Account, a Contact, and a Deal automatically.\n' +
                '* Bulk Import/Export: Seamlessly migrate legacy data via Excel/CSV using the specialized Import tool.'
        },
        {
            title: '3. The Sales Pipeline & Deals',
            content: '* Kanban Board: Drag and drop deals between stages (Discovery -> Proposal -> Negotiation -> Closed).\n' +
                '* Weighted Forecasting: Each stage has associated probability for accurate revenue projections.\n' +
                '* Deal Analytics: Track deal age, value distribution, and bottleneck stages in real-time.'
        },
        {
            title: '4. Accounts & Contacts: 360-Degree View',
            content: '* Accounts: Parent organizations tracking historical deals and billing info.\n' +
                '* Contacts: Individual stakeholders. Stores communication preferences and history.\n' +
                '* Hierarchy: Link multiple contacts to a single account for complex B2B relationships.'
        },
        {
            title: '5. Activities & Pulse',
            content: '* Log Everything: Record calls, emails, and physical meetings.\n' +
                '* Task Mastery: Assign follow-up tasks with deadlines.\n' +
                '* History Timeline: Chronological audit trail of every interaction.'
        },
        {
            title: '6. Global Scheduler & Targets',
            content: '* Unified Calendar: View upcoming customer meetings and demos.\n' +
                '* Revenue Quotas: Set monthly, quarterly, or annual financial targets.\n' +
                '* Compliance Tracking: See who is on track and who requires support in the Target Compliance view.'
        },
        {
            title: '7. Customization & Insights',
            content: '* Custom Fields: Add text, numbers, or dropdowns to any Lead or Deal.\n' +
                '* Field Layouts: Organize fields into sections matching your workflow.\n' +
                '* Executive Dashboards: Real-time summaries of ROI trends and pipeline velocity.'
        }
    ]

    sections.forEach(section => {
        // Check for page break
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
    doc.text('© 2026 HMS CLOUD - ENTERPRISE CRM CONFIDENTIAL', 306, 800, { align: 'center' })

    // Return as Buffer
    const pdfOutput = doc.output('arraybuffer')
    return Buffer.from(pdfOutput)
}
