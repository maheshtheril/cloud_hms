
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

async function testApi() {
    const prisma = new PrismaClient();
    try {
        const tenantId = "4fceafe4-fa32-4016-856e-39a7e0e58d22";
        const record = await prisma.hms_settings.findFirst({
            where: { tenant_id: tenantId, key: 'whatsapp_config' }
        });

        if (!record) {
            console.log("ERROR: No config found in DB");
            return;
        }

        const config = record.value;
        const { instanceId, token } = config;
        
        const resolvedInstanceId = instanceId.toString().toLowerCase().startsWith('instance') 
            ? instanceId 
            : `instance${instanceId}`;

        console.log(`Checking Status for ${resolvedInstanceId} at ${new Date().toISOString()}...`);

        const response = await fetch(`https://api.ultramsg.com/${resolvedInstanceId}/instance/status?token=${token}`);
        const result = await response.json();
        console.log("STATUS_RESULT:", JSON.stringify(result, null, 2));
    } catch (e) {
        console.error("Error: " + e.message);
    } finally {
        await prisma.$disconnect();
    }
}

testApi();
