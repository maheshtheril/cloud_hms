
import fs from 'fs'
import path from 'path'
import { countriesList } from '../prisma/data/countries'
import { currenciesList } from '../prisma/data/currencies'
import { randomUUID } from 'crypto'

async function main() {
    const sqlPath = path.join(process.cwd(), 'seed-final.sql')
    console.log('Generating WORLD CLASS seed-final.sql...')

    let sql = 'BEGIN;\n\n'

    // CLEANUP
    sql += "DELETE FROM modules WHERE module_key = 'system';\n\n";

    // WORLD CLASS MODULES LIST
    const modules: any[] = [
        // Core ERP
        { key: 'hms', name: 'Health Management', desc: 'Complete Hospital & Clinical Operations' },
        { key: 'crm', name: 'CRM', desc: 'Customer Relationship & Pipeline Management' },
        { key: 'finance', name: 'Finance & Accounting', desc: 'General Ledger, Billing, & Financial Reports' },
        { key: 'inventory', name: 'Inventory & SCM', desc: 'Supply Chain, Stock, & Procurement' },
        { key: 'hr', name: 'HR & Payroll', desc: 'Human Capital Management & Payroll Processing' },

        // Expanded Suite
        { key: 'analytics', name: 'Analytics & BI', desc: 'Business Intelligence & Data Visualization' },
        { key: 'projects', name: 'Project Management', desc: 'Task Tracking, Milestones & Collaboration' },
        { key: 'assets', name: 'Asset Management', desc: 'Fixed Asset Tracking & Maintenance' },
        { key: 'pos', name: 'Point of Sale (POS)', desc: 'Retail & Pharmacy Billing Terminals' },
        { key: 'documents', name: 'Document Management', desc: 'Secure File Storage & Digital Archiving' },
        { key: 'communication', name: 'Communication', desc: 'Internal Chat, Email & Notifications' },
        { key: 'learning', name: 'LMS', desc: 'Learning Management & Employee Training' }
    ]

    sql += 'INSERT INTO modules (id, module_key, name, description, is_active) VALUES\n'
    sql += modules.map(m =>
        `('${randomUUID()}', '${m.key}', '${m.name}', '${m.desc}', true)`
    ).join(',\n')
    sql += '\nON CONFLICT (module_key) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;\n\n'

    // Currencies
    sql += 'INSERT INTO currencies (id, code, name, symbol, is_active) VALUES\n'
    sql += currenciesList.map(c =>
        `('${randomUUID()}', '${c.code}', '${c.name.replace(/'/g, "''")}', '${c.symbol.replace(/'/g, "''")}', true)`
    ).join(',\n')
    sql += '\nON CONFLICT (code) DO NOTHING;\n\n'

    // Countries
    sql += 'INSERT INTO countries (id, iso2, iso3, name, flag, region, is_active) VALUES\n'
    sql += countriesList.map(c =>
        `('${randomUUID()}', '${c.iso2}', '${c.iso3}', '${c.name.replace(/'/g, "''")}', '${c.flag}', '${c.region}', true)`
    ).join(',\n')
    sql += '\nON CONFLICT (iso2) DO NOTHING;\n\n'

    sql += 'COMMIT;'

    fs.writeFileSync(sqlPath, sql)
    console.log(`Saved SQL to ${sqlPath} (${(sql.length / 1024).toFixed(2)} KB)`)
}
main()
