require('dotenv').config();
console.log("Loaded DB URL:", process.env.DIRECT_DATABASE_URL || process.env.DATABASE_URL);
require('./sync-db.js');
