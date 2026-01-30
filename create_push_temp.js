
const fs = require('fs');
const schema = fs.readFileSync('prisma/schema.prisma', 'utf8');
const url = "postgresql://neondb_owner:npg_LKIg3tRXfbp9@ep-flat-firefly-a19fhxoa-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&pgbouncer=true";

// Replace datasource block completely
const newSchema = schema.replace(/datasource db \{[\s\S]*?\}/, `datasource db {
  provider = "postgresql"
  url = "${url}"
}`);

fs.writeFileSync('prisma/push_temp.prisma', newSchema);
console.log('Created prisma/push_temp.prisma');
