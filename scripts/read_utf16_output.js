
const fs = require('fs');
const content = fs.readFileSync('surgical_check_output.txt', 'utf16le');
console.log(content);
