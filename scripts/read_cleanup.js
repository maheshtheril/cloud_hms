
const fs = require('fs');
try {
    const content = fs.readFileSync('final_cleanup.sql', 'utf8');
    console.log(content);
} catch (e) {
    console.error(e);
}
