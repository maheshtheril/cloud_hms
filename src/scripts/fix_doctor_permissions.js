const { Client } = require('pg');

const connectionString = "postgresql://threeg:ihIIz42wgUOR78ePsiXD83jZgZGoYIzs@dpg-d3j94d95pdvs739pk6a0-a.singapore-postgres.render.com/threegdb";

const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
});

async function main() {
    console.log("--- Fixing Doctor Permissions (PG) ---");
    try {
        await client.connect();

        // 1. Find All 'Doctor' Roles
        const rolesRes = await client.query(`SELECT id, permissions FROM role WHERE name ILIKE '%Doctor%'`);

        console.log(`Found ${rolesRes.rows.length} Doctor roles.`);

        let updatedCount = 0;

        for (const role of rolesRes.rows) {
            let perms = role.permissions || [];

            // Check if missing
            if (!perms.includes('hms:dashboard:doctor')) {
                console.log(`Updating role ${role.id}...`);

                // Add to Array
                perms.push('hms:dashboard:doctor');

                // Update Role Table
                await client.query(`
                    UPDATE role 
                    SET permissions = $1 
                    WHERE id = $2
                `, [perms, role.id]);

                // Update Role Permission Table (Delete old if exists to be safe, or just insert)
                // UPSERT via plain SQL is verbose, let's just insert if not exists
                const check = await client.query(`
                    SELECT 1 FROM role_permission 
                    WHERE role_id = $1 AND permission_code = 'hms:dashboard:doctor'
                `, [role.id]);

                if (check.rows.length === 0) {
                    // Need tenant_id? The table has tenant_id column!
                    // I need to fetch tenant_id from role first.
                    const roleDetails = await client.query(`SELECT tenant_id FROM role WHERE id = $1`, [role.id]);
                    const tenantId = roleDetails.rows[0].tenant_id;

                    await client.query(`
                        INSERT INTO role_permission (role_id, permission_code, tenant_id, is_granted, created_at)
                        VALUES ($1, 'hms:dashboard:doctor', $2, true, NOW())
                     `, [role.id, tenantId]);
                }

                updatedCount++;
            }
        }

        console.log(`Successfully updated ${updatedCount} roles.`);

    } catch (e) {
        console.error("Script Error:", e);
    } finally {
        await client.end();
    }
}

main();
