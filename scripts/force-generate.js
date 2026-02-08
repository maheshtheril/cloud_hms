
const { execSync } = require('child_process');
process.env.DATABASE_URL = "postgresql://hms_admin:ChangeMe123@localhost:5432/hms_prod";
console.log('Running prisma generate...');
try {
    const out = execSync('npx prisma generate', { stdio: 'inherit' });
    console.log('Success!');
} catch (e) {
    console.error('Failed to generate Prisma client.');
}
