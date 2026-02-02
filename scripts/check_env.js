require('dotenv').config();
console.log("DB URL:", process.env.DATABASE_URL ? "Found" : "Missing");
console.log("Direct URL:", process.env.DIRECT_DATABASE_URL ? "Found" : "Missing");
console.log("Full DB URL:", process.env.DATABASE_URL);
