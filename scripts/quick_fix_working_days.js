const { Client } = require('pg');

async function quickFix() {
    const connectionString = process.env.DIRECT_DATABASE_URL || process.env.DATABASE_URL;

    const client = new Client({
        connectionString
    });

    try {
        await client.connect();
        console.log('✅ Connected');

        // Quick fix: Just fix the working_days column default
        console.log('🔧 Fixing hms_clinicians.working_days...');

        await client.query(`
            ALTER TABLE hms_clinicians 
            ALTER COLUMN working_days 
            SET DEFAULT ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']::text[];
        `);

        console.log('✅ Fixed working_days default');

        // Also ensure the column type is correct
        await client.query(`
            DO $$
            BEGIN
                -- Check if column exists and fix if needed
                IF EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_name = 'hms_clinicians'
                    AND column_name = 'working_days'
                ) THEN
                    -- Ensure it's the right type
                    ALTER TABLE hms_clinicians 
                    ALTER COLUMN working_days 
                    TYPE text[] 
                    USING CASE 
                        WHEN working_days IS NULL THEN ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']::text[]
                        ELSE working_days::text[]
                    END;
                    
                    RAISE NOTICE 'Fixed working_days column type';
                END IF;
            END $$;
        `);

        console.log('✅ Ensured correct column type');
        console.log('🎉 Quick fix applied! Try creating a doctor profile now.');

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    } finally {
        await client.end();
    }
}

quickFix();
