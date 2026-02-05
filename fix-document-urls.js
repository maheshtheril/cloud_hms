const { Client } = require('pg');
require('dotenv').config();

async function fixDocumentUrls() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL || process.env.DIRECT_DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log('Connected to database...');

        // Check current type
        const checkType = await client.query(`
      SELECT data_type, udt_name 
      FROM information_schema.columns 
      WHERE table_name = 'hms_clinicians' 
      AND column_name = 'document_urls'
    `);
        console.log('Current type:', checkType.rows[0]);

        if (checkType.rows[0]?.data_type === 'ARRAY') {
            console.log('Converting document_urls from ARRAY to JSONB...');

            await client.query(`
        ALTER TABLE hms_clinicians 
        ALTER COLUMN document_urls 
        SET DATA TYPE jsonb 
        USING to_jsonb(document_urls)
      `);

            await client.query(`
        ALTER TABLE hms_clinicians 
        ALTER COLUMN document_urls 
        SET DEFAULT '[]'::jsonb
      `);

            console.log('✅ Successfully converted document_urls to JSONB');
        } else {
            console.log('✅ document_urls is already JSONB');
        }

        // Verify
        const verify = await client.query(`
      SELECT data_type, udt_name 
      FROM information_schema.columns 
      WHERE table_name = 'hms_clinicians' 
      AND column_name = 'document_urls'
    `);
        console.log('Final type:', verify.rows[0]);

    } catch (e) {
        console.error('❌ Error:', e.message);
    } finally {
        await client.end();
    }
}

fixDocumentUrls();
