
const fs = require('fs');
const content = fs.readFileSync('exhaustive_dump_utf8.txt', 'utf8');
const tables = content.split('--- ');
tables.forEach(t => {
    if (t.trim().startsWith('hms_invoice ---')) {
        console.log(t);
    }
});
