
const fs = require('fs');
const content = fs.readFileSync('exhaustive_dump_utf8.txt', 'utf8');
const tables = content.split('--- ');

tables.forEach(tableStr => {
    const lines = tableStr.trim().split('\n');
    const firstLine = lines[0].replace(' ---', '').trim();
    if (!firstLine) return;

    const tableName = firstLine.replace(/[^a-zA-Z0-9_]/g, '');

    lines.slice(1).forEach(line => {
        if (line.includes('Type=_') || line.includes('Type=ARRAY')) {
            console.log(`ALTER TABLE "${tableName}" DROP COLUMN IF EXISTS "${line.split(':')[0].trim()}" CASCADE;`);
        }
    });
});
