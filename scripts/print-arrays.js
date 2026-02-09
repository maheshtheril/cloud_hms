
const fs = require('fs');
const data = JSON.parse(fs.readFileSync('array_columns.json', 'utf8'));
data.forEach(c => {
    console.log(`${c.table_name}.${c.column_name}: ${c.udt_name} Default=${c.column_default}`);
});
