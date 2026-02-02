const fs = require('fs');
console.log(fs.readFileSync('prisma/schema.prisma', 'utf8').substring(0, 500));
