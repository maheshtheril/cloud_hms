
const fs = require('fs');
const content = fs.readFileSync('exhaustive_dump.txt', 'utf16le');
const sections = content.split('--- ');
sections.forEach(s => {
    if (s.trim() === '') return;
    const lines = s.split('\n');
    const tableName = lines[0].replace(' ---', '').trim();
    console.log(`\nTABLE: ${tableName}`);
    lines.slice(1).forEach(l => {
        const line = l.trim();
        if (line.includes('Type=') || line.includes('Default=')) {
            // Only show JSON, ARRAY, or defaults that contain brackets
            if (line.includes('json') || line.includes('ARRAY') || line.includes('_') || line.includes('[')) {
                console.log(line);
            }
        }
    });
});
