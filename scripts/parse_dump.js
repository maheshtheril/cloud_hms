
const fs = require('fs');
const content = fs.readFileSync('exhaustive_dump_utf8.txt', 'utf8');
const lines = content.split('\n');

let currentTable = '';
lines.forEach(line => {
    if (line.includes('--- ')) {
        console.log(`\nTable: ${line.trim()}`);
    } else if (line.includes('Type=')) {
        console.log(line.trim());
    }
});
