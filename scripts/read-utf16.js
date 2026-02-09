
const fs = require('fs');
const content = fs.readFileSync('billing_dump.json', 'utf16le');
console.log(content);
