const PDFDocument = require('pdfkit');
const fs = require('fs');

// Create a document
const doc = new PDFDocument({ margin: 50, bufferPages: true });

// Pipe its output somewhere, like to a file or HTTP response
doc.pipe(fs.createWriteStream('HMS_User_Guide.pdf'));

// Add Title
doc
    .fontSize(25)
    .font('Helvetica-Bold')
    .text('Hospital Management System (HMS)', { align: 'center' })
    .moveDown(0.5);

doc
    .fontSize(18)
    .text('Comprehensive User Guide', { align: 'center' })
    .moveDown(2);

doc
    .fontSize(12)
    .font('Helvetica')
    .text('Welcome to the Hospital Management System (HMS). This guide provides a detailed walkthrough of the core functionalities designed for various hospital roles.', { align: 'justify' })
    .moveDown(2);

// RECEPTION
doc
    .fontSize(16)
    .font('Helvetica-Bold')
    .text('1. Reception & Front Desk (Receptionist / Cashier)')
    .moveDown(0.5);

doc
    .fontSize(12)
    .font('Helvetica')
    .text('The Reception Action Center is your primary dashboard.')
    .moveDown(0.5);

doc.font('Helvetica-Bold').text('Key Workflows:');
doc.font('Helvetica')
    .list([
        'Patient Registration: Click "New Patient" to register. Capture details like Name, Contact, Gender. The system generates a UHID.',
        'Appointment Scheduling: Use "Schedule" to book slots. Filter by Doctor or Specialization.',
        'Patient Check-In: Monitor "Today\'s Patient Flow". Click "Check In" when a patient arrives.',
        'Daily Collection: Track "Live Revenue". Use "Cash Counter" to Open/Close shifts.',
        'Petty Cash: Record miscellaneous expenses via "Expenses" action.'
    ], { bulletRadius: 2 })
    .moveDown(1.5);

// NURSING
doc
    .fontSize(16)
    .font('Helvetica-Bold')
    .text('2. Nursing Station (Nurse)')
    .moveDown(0.5);

doc
    .fontSize(12)
    .font('Helvetica')
    .text('Manage the clinical queue and prepare patients for the doctor.')
    .moveDown(0.5);

doc.font('Helvetica-Bold').text('Key Workflows:');
doc.font('Helvetica')
    .list([
        'Vitals & Triage: View "Awaiting Vitals". Click "Assess" to record BP, Weight, BMI, etc.',
        'Consumables Usage: Use "Record Consumption" to log items like syringes/bandages for billing.',
        'Sample Collection: Identify pending orders and mark samples as "Collected".',
        'Ward Management: Monitor "Active Admissions" census.'
    ], { bulletRadius: 2 })
    .moveDown(1.5);

// DOCTOR
doc
    .fontSize(16)
    .font('Helvetica-Bold')
    .text('3. Clinical Consultation (Doctor)')
    .moveDown(0.5);

doc
    .fontSize(12)
    .font('Helvetica')
    .text('Focus on diagnosis, prescriptions, and patient history.')
    .moveDown(0.5);

doc.font('Helvetica-Bold').text('Key Workflows:');
doc.font('Helvetica')
    .list([
        'Patient Queue: See patients with "Vitals Ready". Click "Start Consultation".',
        'Clinical Workspace: Review vitals/history. Prescribe Medicines and Lab Tests.',
        'Diagnosis & Notes: Enter clinical findings and ICD-10 codes.',
        'Lab Integration: View "Lab Results Ready" alerts and open reports directly.'
    ], { bulletRadius: 2 })
    .moveDown(1.5);

// LAB
doc
    .fontSize(16)
    .font('Helvetica-Bold')
    .text('4. Laboratory Services (Lab Technician)')
    .moveDown(0.5);

doc
    .fontSize(12)
    .font('Helvetica')
    .text('Track orders from request to result release.')
    .moveDown(0.5);

doc.font('Helvetica-Bold').text('Key Workflows:');
doc.font('Helvetica')
    .list([
        'Worklist: Separate "Queue" (Pending) and "History" (Completed).',
        'Processing: Move samples to "Start Processing" and then "In Progress".',
        'Result Entry: Enter results manually or upload PDF. Click "Release Results".',
        'Billing: Generate Lab Invoices if needed using "Bill Patient".'
    ], { bulletRadius: 2 })
    .moveDown(1.5);

// BILLING
doc
    .addPage() // New page for Billing to keep it clean if near bottom
    .fontSize(16)
    .font('Helvetica-Bold')
    .text('5. Billing & Accounting (Cashier / Accountant)')
    .moveDown(0.5);

doc
    .fontSize(12)
    .font('Helvetica')
    .text('Ensure no revenue leakages with a comprehensive billing engine.')
    .moveDown(0.5);

doc.font('Helvetica-Bold').text('Key Workflows:');
doc.font('Helvetica')
    .list([
        'Invoice Generation: Create bills for OPD, Lab, Pharmacy. Quick "Walk-in" billing supported.',
        'Draft Invoices: Review invoices created by Lab/Nurse before finalizing.',
        'Settlements: Record Cash, Card, UPI payments. Support for Partial Payments.',
        'Sales Returns: Process returns for unused items.'
    ], { bulletRadius: 2 })
    .moveDown(1.5);

// INVENTORY
doc
    .fontSize(16)
    .font('Helvetica-Bold')
    .text('6. Inventory & Pharmacy')
    .moveDown(0.5);

doc
    .fontSize(12)
    .font('Helvetica')
    .text('Manage stock levels, procurement, and dispensing.')
    .moveDown(0.5);

doc.font('Helvetica-Bold').text('Key Workflows:');
doc.font('Helvetica')
    .list([
        'Stock Monitoring: Real-time alerts for Low Stock and Expiry.',
        'Purchasing: Create POs and "Receive" stock.',
        'Stock Adjustments: Reconcile physical stock audits.'
    ], { bulletRadius: 2 })
    .moveDown(1.5);

// TIPS
doc
    .fontSize(16)
    .font('Helvetica-Bold')
    .text('System Navigation Tips')
    .moveDown(0.5);

doc.font('Helvetica')
    .list([
        'Sidebar: Switch modules (Appointments, Billing, etc.).',
        'Search: High-speed search bar for Patients/UHID.',
        'Dark Mode: Toggle theme via settings icon.'
    ], { bulletRadius: 2 });

// Footer
const pages = doc.bufferedPageRange();
for (let i = 0; i < pages.count; i++) {
    doc.switchToPage(i);
    doc.fontSize(8).text(
        `Use Guide generated on ${new Date().toLocaleDateString()}`,
        50,
        doc.page.height - 50,
        { align: 'center', color: 'gray' }
    );
}

// Finalize
doc.end();
console.log('PDF generated successfully: HMS_User_Guide.pdf');
