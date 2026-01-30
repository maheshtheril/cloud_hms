const { Client } = require('pg');

const client = new Client({
    host: '13.228.184.177',
    user: 'neondb_owner',
    password: 'npg_LKIg3tRXfbp9',
    database: 'neondb',
    ssl: { rejectionUnauthorized: false, servername: 'ep-flat-firefly-a19fhxoa-pooler.ap-southeast-1.aws.neon.tech' }
});

const tasks = [
    {
        type: 'hms_location_type',
        values: ['warehouse', 'pharmacy', 'ward', 'theatre', 'lab', 'transit', 'consumed'],
        table: 'hms_stock_location',
        col: 'location_type'
    },
    {
        type: 'hms_move_type',
        values: ['in', 'out', 'internal', 'adjustment', 'reservation', 'return'],
        table: 'hms_stock_move',
        col: 'move_type'
    },
    {
        type: 'hms_payment_method',
        values: ['cash', 'card', 'upi', 'bank_transfer', 'insurance', 'adjustment'],
        table: 'hms_invoice_payments',
        col: 'method'
    },
    {
        type: 'hms_receipt_status',
        values: ['pending', 'received', 'partially_received', 'closed', 'cancelled'],
        table: 'hms_purchase_receipt',
        col: 'status',
        default: 'pending'
    },
    {
        type: 'hms_purchase_status',
        values: ['draft', 'confirmed', 'approved', 'partially_received', 'received', 'billed', 'closed', 'cancelled'],
        table: 'hms_purchase_order',
        col: 'status',
        default: 'draft'
    }
];

async function fixEnums() {
    try {
        await client.connect();

        for (const task of tasks) {
            console.log(`Fixing ${task.type}...`);

            // Create Type
            const valuesSql = task.values.map(v => `'${v}'`).join(', ');
            await client.query(`
                DO $$
                BEGIN
                    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = '${task.type}') THEN
                        CREATE TYPE ${task.type} AS ENUM (${valuesSql});
                    END IF;
                END $$;
            `);

            // Check if table column exists (it should)
            // Alter Column

            // If default exists, we might need to drop it first if it conflicts?
            // Safer to DROP DEFAULT, ALTER TYPE, SET DEFAULT.

            try {
                // Drop default
                await client.query(`ALTER TABLE "${task.table}" ALTER COLUMN "${task.col}" DROP DEFAULT`);
            } catch (e) { }

            // Alter Type
            await client.query(`
                ALTER TABLE "${task.table}" 
                ALTER COLUMN "${task.col}" TYPE ${task.type} 
                USING "${task.col}"::${task.type};
            `);

            // Set Default
            if (task.default) {
                await client.query(`ALTER TABLE "${task.table}" ALTER COLUMN "${task.col}" SET DEFAULT '${task.default}'::${task.type}`);
            }

            console.log(`  - Fixed ${task.table}.${task.col}`);
        }

    } catch (e) {
        console.error(e);
    } finally {
        await client.end();
    }
}

fixEnums();
