require('dotenv').config();
const url = process.env.DIRECT_DATABASE_URL || process.env.DATABASE_URL;
console.log("Full URL:", url);
console.log("Host part:", url.split('@')[1].split('/')[0]);
