const { Client } = require('pg');

const client = new Client({
    host: '13.228.184.177',
    user: 'neondb_owner',
    password: 'npg_t3GQCEaDsY5M',
    database: 'neondb',
    ssl: { rejectionUnauthorized: false, servername: 'ep-tiny-lab-a1hzd77s-pooler.ap-southeast-1.aws.neon.tech' }
});

const menus = [
    { key: 'acc-dashboard', label: 'Financial Dashboard', url: '/hms/accounting', module_key: 'finance', icon: 'LayoutDashboard', sort_order: 1, is_global: true },
    { key: 'acc-ledger', label: 'General Ledger', url: '#', module_key: 'finance', icon: 'Book', sort_order: 30, is_global: true },
    { key: 'acc-journals', label: 'Journal Entries', url: '/accounting/journals', module_key: 'finance', icon: 'BookOpen', sort_order: 10, parent_key: 'acc-ledger', is_global: true },
    { key: 'acc-coa', label: 'Chart of Accounts', url: '/accounting/coa', module_key: 'finance', icon: 'ListTree', sort_order: 5, parent_key: 'acc-ledger', is_global: true },
    { key: 'acc-customers', label: 'Customers', url: '#', module_key: 'finance', icon: 'Users', sort_order: 10, is_global: true },
    { key: 'acc-receipts', label: 'Receipts', url: '/accounting/customer/receipts', module_key: 'finance', icon: 'ArrowDownLeft', sort_order: 20, parent_key: 'acc-customers', is_global: true },
    { key: 'acc-vendors', label: 'Vendors', url: '#', module_key: 'finance', icon: 'Truck', sort_order: 20, is_global: true },
    { key: 'acc-payments', label: 'Payments', url: '/accounting/vendor/payments', module_key: 'finance', icon: 'ArrowUpRight', sort_order: 20, parent_key: 'acc-vendors', is_global: true },
    { key: 'accounting-settings', label: 'Accounting Config', url: '/settings/accounting', module_key: 'system', icon: 'Calculator', sort_order: 100, is_global: true },
    { key: 'inv-dashboard', label: 'Inventory', url: '/hms/inventory', module_key: 'inventory', icon: 'LayoutDashboard', sort_order: 10, is_global: true },
    { key: 'inv-products', label: 'Product Master', url: '/hms/inventory/products', module_key: 'inventory', icon: 'Package', sort_order: 20, is_global: true },
    { key: 'inv-procurement', label: 'Procurement', url: '#', module_key: 'inventory', icon: 'ShoppingCart', sort_order: 30, is_global: true },
    { key: 'inv-suppliers', label: 'Suppliers', url: '/hms/purchasing/suppliers', module_key: 'inventory', icon: 'Truck', sort_order: 10, parent_key: 'inv-procurement', is_global: true },
    { key: 'inv-po', label: 'Purchase Orders', url: '/hms/purchasing/orders', module_key: 'inventory', icon: 'FileText', sort_order: 20, parent_key: 'inv-procurement', is_global: true },
    { key: 'inv-receipts', label: 'Goods Receipts', url: '/hms/purchasing/receipts', module_key: 'inventory', icon: 'ClipboardList', sort_order: 30, parent_key: 'inv-procurement', is_global: true },
    { key: 'inv-returns', label: 'Purchase Returns', url: '/hms/purchasing/returns', module_key: 'inventory', icon: 'Undo2', sort_order: 40, parent_key: 'inv-procurement', is_global: true },
    { key: 'hms-dashboard', label: 'Dashboard', url: '/hms/dashboard', module_key: 'hms', icon: 'LayoutDashboard', sort_order: 10, is_global: true },
    { key: 'hms-patients', label: 'Patients', url: '/hms/patients', module_key: 'hms', icon: 'UserCircle', sort_order: 20, is_global: true },
    { key: 'hms-appointments', label: 'Appointments', url: '/hms/appointments', module_key: 'hms', icon: 'Calendar', sort_order: 30, is_global: true },
    { key: 'hms-nursing', label: 'Nursing Station', url: '/hms/nursing/dashboard', module_key: 'hms', icon: 'Activity', sort_order: 45, is_global: true },
    { key: 'hms-billing', label: 'Billing', url: '/hms/billing', module_key: 'hms', icon: 'Receipt', sort_order: 60, is_global: true },
    { key: 'crm-dashboard', label: 'Dashboard', url: '/crm/dashboard', module_key: 'crm', icon: 'LayoutDashboard', sort_order: 10, is_global: true },
];

async function repair() {
    try {
        await client.connect();
        console.log('Connected to Seeakk DB for Repair.');

        // 1. Fix Enums
        console.log('Fixing Enums...');
        await client.query(`
            DO $$ BEGIN
                CREATE TYPE hms_invoice_status AS ENUM ('draft', 'posted', 'paid', 'cancelled', 'void');
            EXCEPTION WHEN duplicate_object THEN null; END $$;
            ALTER TABLE hms_invoice ALTER COLUMN status TYPE hms_invoice_status USING status::hms_invoice_status;
            
            DO $$ BEGIN
                CREATE TYPE hms_location_type AS ENUM ('warehouse', 'pharmacy', 'ward', 'theatre', 'lab', 'transit', 'consumed');
            EXCEPTION WHEN duplicate_object THEN null; END $$;
            ALTER TABLE hms_stock_location ALTER COLUMN location_type TYPE hms_location_type USING location_type::hms_location_type;
        `);

        // 2. Reseed Menus
        console.log('Reseeding Menus...');
        await client.query(`CREATE UNIQUE INDEX IF NOT EXISTS idx_menu_items_key_unique ON menu_items (key)`);
        for (const item of menus) {
            let parentId = null;
            if (item.parent_key) {
                const p = await client.query('SELECT id FROM menu_items WHERE key = $1', [item.parent_key]);
                if (p.rows.length > 0) parentId = p.rows[0].id;
            }
            const existing = await client.query('SELECT id FROM menu_items WHERE key = $1', [item.key]);
            if (existing.rows.length > 0) {
                await client.query(`
                    UPDATE menu_items SET label = $1, url = $2, module_key = $3, icon = $4, sort_order = $5, is_global = $6, parent_id = $7
                    WHERE id = $8
                `, [item.label, item.url, item.module_key, item.icon, item.sort_order, item.is_global, parentId, existing.rows[0].id]);
            } else {
                await client.query(`
                    INSERT INTO menu_items (label, url, key, module_key, icon, sort_order, is_global, parent_id)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                `, [item.label, item.url, item.key, item.module_key, item.icon, item.sort_order, item.is_global, parentId]);
            }
        }

        console.log('✅ Seeakk Repair & Reseed Complete.');

    } catch (e) { console.error(e); } finally { await client.end(); }
}
repair();
