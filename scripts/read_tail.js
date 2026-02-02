const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'prisma', 'seed_global.sql');
const content = fs.readFileSync(filePath, 'utf-8');
const lines = content.split('\n');
console.log(lines.slice(-50).join('\n'));
