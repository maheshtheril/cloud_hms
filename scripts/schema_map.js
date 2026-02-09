
const fs = require('fs');
const lines = fs.readFileSync('prisma/schema.prisma', 'utf8').split('\n');
lines.forEach((line, i) => {
    if (line.includes('model ') || line.includes('enum ')) {
        console.log(`${i + 1}: ${line.trim()}`);
    }
});
