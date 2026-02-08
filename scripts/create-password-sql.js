
const bcrypt = require('bcryptjs');
const fs = require('fs');

const password = 'password123';
const hash = bcrypt.hashSync(password, 10);

console.log('Generated Hash:', hash);

const sql = `UPDATE app_user SET password = '${hash}' WHERE email = 'gmh@gmail.com';`;

fs.writeFileSync('infra/update-password.sql', sql);
console.log('SQL file created: infra/update-password.sql');
