const fs = require('fs');
const path = 'prisma/schema.prisma';

try {
    let content = fs.readFileSync(path, 'utf8');
    // Remove BOM if present
    if (content.charCodeAt(0) === 0xFEFF) {
        content = content.slice(1);
        console.log('BOM removed');
    } else {
        console.log('No BOM found');
    }

    // Also fix any potential double-spaced corruption if it exists (simple heuristic)
    // But be careful not to break valid spaces. 
    // The corruption I saw was "m o d e l". 

    fs.writeFileSync(path, content, 'utf8');
    console.log('File written cleanly');
} catch (e) {
    console.error(e);
}
