
const fs = require('fs');

const content = fs.readFileSync('exhaustive_dump_utf8.txt', 'utf8');
const tables = content.split('--- ');

tables.forEach(tableStr => {
    const lines = tableStr.trim().split('\n');
    const firstLine = lines[0].replace(' ---', '').trim();
    if (!firstLine) return;

    // In case of UTF-16 issues or markers
    const tableName = firstLine.replace(/[^a-zA-Z0-9_]/g, '');

    lines.slice(1).forEach(line => {
        if (line.includes('Type=')) {
            const parts = line.split(':');
            const colName = parts[0].trim();
            const colInfo = parts[1].trim();

            // Suspect 1: udt_name starts with _ (e.g. _text, _uuid, _jsonb)
            // Suspect 2: Default contains []
            // Suspect 3: data_type is ARRAY

            const isArray = colInfo.toLowerCase().includes('type=_') || colInfo.toLowerCase().includes('type=array');
            const hasJsonDefault = colInfo.includes('[]');

            if (isArray || hasJsonDefault) {
                const whitelist = ['working_days', 'tags', 'permissions', 'analytic_tag_ids', 'line_items'];
                if (whitelist.includes(colName)) return;

                console.log(`[SUSPECT] Table: ${tableName} | Column: ${colName} | Info: ${colInfo}`);
            }
        }
    });
});
