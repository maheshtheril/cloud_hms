const { Client } = require('pg');

const client = new Client({
    host: '13.228.184.177',
    user: 'neondb_owner',
    password: 'npg_LKIg3tRXfbp9',
    database: 'neondb',
    ssl: {
        rejectUnauthorized: false,
        servername: 'ep-flat-firefly-a19fhxoa-pooler.ap-southeast-1.aws.neon.tech'
    }
});

const create_hms_departments = `
CREATE TABLE IF NOT EXISTS hms_departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    company_id UUID NOT NULL,
    name TEXT NOT NULL,
    code TEXT,
    description TEXT,
    parent_id UUID,
    is_active BOOLEAN DEFAULT true,
    created_by UUID,
    updated_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);
`;

const create_hms_product = `
CREATE TABLE IF NOT EXISTS hms_product (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    company_id UUID NOT NULL,
    sku TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    is_stockable BOOLEAN DEFAULT true,
    is_service BOOLEAN DEFAULT false,
    uom TEXT DEFAULT 'each',
    valuation_method TEXT DEFAULT 'fifo',
    price DECIMAL(14,2) DEFAULT 0,
    currency TEXT DEFAULT 'USD',
    default_cost DECIMAL(14,2) DEFAULT 0,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID,
    updated_at TIMESTAMP WITH TIME ZONE,
    updated_by UUID,
    deleted_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    default_barcode TEXT,
    barcode_type TEXT,
    manufacturer_id UUID,
    uom_id UUID
);
`;

const create_prescription = `
CREATE TABLE IF NOT EXISTS prescription (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    company_id UUID,
    patient_id UUID NOT NULL,
    doctor_id UUID,
    visit_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    vitals TEXT,
    diagnosis TEXT,
    complaint TEXT,
    examination TEXT,
    plan TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    appointment_id UUID,
    branch_id UUID
);
`;

const create_prescription_items = `
CREATE TABLE IF NOT EXISTS prescription_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prescription_id UUID NOT NULL,
    medicine_id UUID NOT NULL,
    morning INTEGER DEFAULT 0,
    afternoon INTEGER DEFAULT 0,
    evening INTEGER DEFAULT 0,
    night INTEGER DEFAULT 0,
    days INTEGER DEFAULT 3,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
`;

const create_hms_invoice = `
CREATE TABLE IF NOT EXISTS hms_invoice (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    company_id UUID NOT NULL,
    patient_id UUID,
    encounter_id UUID,
    invoice_number TEXT NOT NULL,
    issued_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    due_at TIMESTAMP WITH TIME ZONE,
    currency TEXT DEFAULT 'INR',
    currency_rate DECIMAL(18,8) DEFAULT 1,
    subtotal DECIMAL(18,2) DEFAULT 0,
    total_tax DECIMAL(18,2) DEFAULT 0,
    total_discount DECIMAL(18,2) DEFAULT 0,
    total DECIMAL(18,2) DEFAULT 0,
    total_paid DECIMAL(18,2) DEFAULT 0,
    status TEXT DEFAULT 'draft',
    line_items JSONB DEFAULT '[]',
    billing_metadata JSONB DEFAULT '{}',
    locked BOOLEAN DEFAULT false,
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    outstanding DECIMAL(20,6) DEFAULT 0,
    invoice_no TEXT,
    invoice_date DATE,
    due_date DATE
);
`;

async function fixExtra() {
    try {
        await client.connect();
        await client.query(create_hms_departments);
        console.log('✅ Checked/Created hms_departments');

        await client.query(create_hms_product);
        console.log('✅ Checked/Created hms_product');

        await client.query(create_prescription);
        console.log('✅ Checked/Created prescription');

        await client.query(create_prescription_items);
        console.log('✅ Checked/Created prescription_items');

        await client.query(create_hms_invoice);
        console.log('✅ Checked/Created hms_invoice');

    } catch (e) {
        console.error(e);
    } finally {
        await client.end();
    }
}

fixExtra();
