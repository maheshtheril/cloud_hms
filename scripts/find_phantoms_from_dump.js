
const fs = require('fs');

const content = fs.readFileSync('exhaustive_dump_utf8.txt', 'utf8');
const tables = content.split('--- ');

tables.forEach(tableStr => {
    const lines = tableStr.trim().split('\n');
    const tableName = lines[0].replace(' ---', '').trim();
    if (!tableName) return;

    lines.slice(1).forEach(line => {
        if (line.includes('Type=')) {
            const parts = line.split(':');
            const colName = parts[0].trim();
            const colInfo = parts[1].trim();

            // Look for array types or defaults with []
            if (colInfo.includes('ARRAY') || colInfo.includes('_') || colInfo.includes('[]')) {
                // Ignore legitimate ones if any (none of these should be arrays in this domain except few)
                const whitelist = ['working_days', 'tags', 'permissions', 'analytic_tag_ids'];
                if (whitelist.includes(colName)) return;

                console.log(`Table: ${tableName} | Column: ${colName} | Info: ${colInfo}`);
            }
        }
    });
});
