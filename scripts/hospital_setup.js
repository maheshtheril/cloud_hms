const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function setup() {
    // We use 127.0.0.1 to test from your desktop
    const testUrl = "postgresql://postgres:postgres@127.0.0.1:5432/postgres?sslmode=disable";
    // We use host.docker.internal for the actual app to use inside Docker
    const dockerUrl = "postgresql://postgres:postgres@host.docker.internal:5432/postgres?sslmode=disable";

    console.log("🏥 Starting Hospital Edge Setup...");

    // 1. Test Connection
    const client = new Client({ connectionString: testUrl });
    try {
        console.log("⏳ Testing database connection...");
        await client.connect();
        console.log("✅ SUCCESS: Database is working and password is correct!");
    } catch (err) {
        console.error("❌ ERROR: Database connection failed!");
        console.error("Reason:", err.message);
        if (err.message.includes("password authentication failed")) {
            console.log("\n👉 FIX: Open pgAdmin and run: ALTER USER postgres WITH PASSWORD 'postgres';");
        }
        process.exit(1);
    }

    // 2. Clear out the old .env and write the new one
    console.log("📝 Updating .env file...");
    const envContent = `DATABASE_URL="${dockerUrl}"\nNEXTAUTH_SECRET="hms_local_2026"\nNEXTAUTH_URL="http://localhost:3000"\nNEXT_PUBLIC_APP_URL="http://localhost:3000"`;
    fs.writeFileSync('.env', envContent);

    // 3. Fix docker-compose.yml to the simplest working version
    console.log("📝 Updating docker-compose.yml...");
    const dcContent = `version: '3.8'
services:
  hms:
    build: .
    container_name: hms-app-prod
    restart: always
    environment:
      DATABASE_URL: "${dockerUrl}"
      NEXTAUTH_URL: "http://localhost:3000"
      NEXTAUTH_SECRET: "hms_local_2026"
    ports:
      - "3000:3000"
`;
    fs.writeFileSync('docker-compose.yml', dcContent);

    console.log("\n🚀 EVERYTHING IS READY!");
    console.log("Now run exactly this command in your terminal:");
    console.log("docker-compose up -d --build");

    await client.end();
}

setup();
