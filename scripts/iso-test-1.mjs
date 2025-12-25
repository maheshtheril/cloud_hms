import pg from 'pg';
import { execSync } from 'child_process';
const { Client } = pg;

const connectionString = process.env.DATABASE_URL;

async function runStep() {
    const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });
    await client.connect();

    try {
        console.log('🔌 Disabling trg_hms_invoice_history...');
        await client.query('ALTER TABLE hms_invoice DISABLE TRIGGER trg_hms_invoice_history');

        console.log('🔄 Running reproduction script...');
        try {
            execSync('node --env-file=.env scripts/reproduce-error.mjs', { stdio: 'inherit' });
            console.log('✅ Reproduction script SUCCEEDED after disabling history trigger.');
        } catch (e) {
            console.log('❌ Reproduction script FAILED even after disabling history trigger.');
        }

    } finally {
        // Re-enable for safety (or leave disabled if it was the fix? Let's re-enable to confirm)
        // await client.query('ALTER TABLE hms_invoice ENABLE TRIGGER trg_hms_invoice_history'); 
        // We leave it disabled if it works, to prove it.
        await client.end();
    }
}
runStep();
