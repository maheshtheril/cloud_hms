
const fs = require('fs');
const dump = JSON.parse(fs.readFileSync('billing_dump.json', 'utf8').replace(/^\uFEFF/, ''));

const susp = dump.filter(c => c.data_type === 'ARRAY' || c.udt_name.startsWith('_'));
console.log('--- ALL ARRAY COLUMNS IN BILLING TABLES ---');
susp.forEach(c => {
    console.log(`${c.table_name}.${c.column_name} (${c.udt_name}) DEFAULT: ${c.column_default}`);
});

console.log('\n--- ALL JSONB COLUMNS IN BILLING TABLES ---');
dump.filter(c => c.udt_name === 'jsonb').forEach(c => {
    console.log(`${c.table_name}.${c.column_name} (${c.udt_name}) DEFAULT: ${c.column_default}`);
});
