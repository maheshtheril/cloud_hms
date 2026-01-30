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

const create_hms_branch = `
CREATE TABLE IF NOT EXISTS hms_branch (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID,
    tenant_id UUID,
    name TEXT NOT NULL,
    code TEXT,
    is_active BOOLEAN DEFAULT true,
    type TEXT DEFAULT 'clinic',
    phone TEXT,
    email TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    pincode TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
`;

const create_hms_patient = `
CREATE TABLE IF NOT EXISTS hms_patient (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    company_id UUID,
    patient_number TEXT,
    first_name TEXT NOT NULL,
    last_name TEXT,
    dob DATE,
    gender TEXT,
    identifiers JSONB DEFAULT '{}',
    contact JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    external_id TEXT,
    status TEXT DEFAULT 'active',
    merged_into UUID,
    source_system TEXT,
    updated_by UUID,
    full_name TEXT,
    profile_image_url TEXT,
    blood_group TEXT,
    branch_id UUID
);
`;

const create_hms_appointments = `
CREATE TABLE IF NOT EXISTS hms_appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    company_id UUID,
    patient_id UUID NOT NULL,
    clinician_id UUID NOT NULL,
    department_id UUID,
    location_id UUID,
    room_id UUID,
    starts_at TIMESTAMP WITH TIME ZONE NOT NULL,
    ends_at TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INTEGER,
    status TEXT DEFAULT 'scheduled',
    type TEXT DEFAULT 'consultation',
    mode TEXT DEFAULT 'in_person',
    priority TEXT DEFAULT 'normal',
    notes TEXT,
    source TEXT DEFAULT 'manual',
    ai_suggestion JSONB,
    external_ref TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMP WITH TIME ZONE,
    branch_id UUID
);
`;

async function fixHMS() {
    try {
        await client.connect();

        await client.query(create_hms_branch);
        console.log('✅ Checked/Created hms_branch');

        await client.query(create_hms_patient);
        console.log('✅ Checked/Created hms_patient');

        await client.query(create_hms_appointments);
        console.log('✅ Checked/Created hms_appointments');

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await client.end();
    }
}

fixHMS();
