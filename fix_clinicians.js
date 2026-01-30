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

const create_clinicians = `
CREATE TABLE IF NOT EXISTS hms_clinicians (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    company_id UUID NOT NULL,
    department_id UUID,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE,
    phone TEXT,
    role TEXT,
    specialization TEXT,
    license_no TEXT,
    experience_years INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    role_id UUID,
    specialization_id UUID,
    consultation_end_time TEXT DEFAULT '17:00',
    consultation_slot_duration INTEGER DEFAULT 30,
    consultation_start_time TEXT DEFAULT '09:00',
    consultation_fee DECIMAL(14,2) DEFAULT 500,
    designation TEXT,
    employee_id TEXT UNIQUE,
    qualification TEXT,
    working_days TEXT[] DEFAULT ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    document_urls JSONB DEFAULT '[]',
    profile_image_url TEXT
);
`;

async function fix() {
    try {
        await client.connect();
        await client.query(create_clinicians);
        console.log('✅ Checked/Created hms_clinicians');
    } catch (e) {
        console.error(e);
    } finally {
        await client.end();
    }
}

fix();
