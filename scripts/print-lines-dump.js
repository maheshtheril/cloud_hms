
const fs = require('fs');
const content = fs.readFileSync('lines_dump.txt', 'utf16le');
console.log(content);
