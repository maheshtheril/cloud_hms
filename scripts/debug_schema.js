const fs = require('fs');
const content = fs.readFileSync('prisma/schema.prisma', 'utf8');
console.log("Length:", content.length);
console.log("IndexOf datasource:", content.indexOf('datasource'));
console.log("Substring:", content.substring(0, 400));
