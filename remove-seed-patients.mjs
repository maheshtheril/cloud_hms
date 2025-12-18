#!/usr/bin/env node

/**
 * Script to remove seed patient data from the database
 * This fixes the issue where two patients appear for every new tenant
 */

import pg from 'pg';
const { Client } = pg;

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    console.error('❌ DATABASE_URL environment variable not found');
    process.exit(1);
}

async function removeSeedPatients() {
    const client = new Client({ connectionString });

    try {
        console.log('🔌 Connecting to database...');
        await client.connect();
        console.log('✅ Connected successfully\n');

        // First, check if the patients exist
        console.log('🔍 Checking for seed patients...');
        const checkResult = await client.query(
            `SELECT id, first_name, last_name, patient_number, tenant_id 
             FROM public.hms_patient 
             WHERE id IN ($1, $2)`,
            [
                '9c23da47-b7c4-48cf-99e1-f00aeb81fd4d',
                '959f2ae6-c68f-4501-84e3-5f4d944fcf9f'
            ]
        );

        if (checkResult.rows.length === 0) {
            console.log('✅ No seed patients found. Database is clean!');
            return;
        }

        console.log(`\n📋 Found ${checkResult.rows.length} seed patient(s):`);
        checkResult.rows.forEach((row, index) => {
            console.log(`   ${index + 1}. ${row.first_name} ${row.last_name} (${row.patient_number})`);
            console.log(`      ID: ${row.id}`);
            console.log(`      Tenant: ${row.tenant_id}\n`);
        });

        // Delete the seed patients
        console.log('🗑️  Deleting seed patients...');
        const deleteResult = await client.query(
            `DELETE FROM public.hms_patient 
             WHERE id IN ($1, $2)`,
            [
                '9c23da47-b7c4-48cf-99e1-f00aeb81fd4d',
                '959f2ae6-c68f-4501-84e3-5f4d944fcf9f'
            ]
        );

        console.log(`✅ Successfully deleted ${deleteResult.rowCount} patient record(s)\n`);

        // Verify deletion
        const verifyResult = await client.query(
            `SELECT COUNT(*) as count FROM public.hms_patient 
             WHERE id IN ($1, $2)`,
            [
                '9c23da47-b7c4-48cf-99e1-f00aeb81fd4d',
                '959f2ae6-c68f-4501-84e3-5f4d944fcf9f'
            ]
        );

        if (parseInt(verifyResult.rows[0].count) === 0) {
            console.log('✅ Verification successful: Seed patients have been removed');
            console.log('🎉 Database cleanup complete!\n');
        } else {
            console.log('⚠️  Warning: Some records may still exist');
        }

    } catch (error) {
        console.error('❌ Error removing seed patients:', error);
        throw error;
    } finally {
        await client.end();
        console.log('🔌 Database connection closed');
    }
}

// Run the script
removeSeedPatients()
    .then(() => {
        console.log('\n✅ Script completed successfully');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ Script failed:', error.message);
        process.exit(1);
    });
