
const fs = require('fs');
const content = fs.readFileSync('c:\\2035-HMS\\SAAS_ERP\\prisma\\schema.prisma', 'utf8');
const lines = content.split('\n');
lines.forEach((line, index) => {
    if (line.trim().startsWith('model payments') || line.trim().startsWith('model payment_lines')) {
        console.log(`${index + 1}: ${line}`);
    }
});
