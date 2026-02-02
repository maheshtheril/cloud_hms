require('dotenv').config();
const { execSync } = require('child_process');

console.log("Running prisma generate hacking...");
console.log("DB URL Length:", process.env.DATABASE_URL?.length);

try {
    execSync('npx prisma generate', {
        stdio: 'inherit',
        env: { ...process.env } // Pass loaded env
    });
} catch (e) {
    process.exit(1);
}
