const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');

// Load .env manually since we are running standalone script
const envPath = path.resolve(__dirname, '.env');
console.log("Reading .env from:", envPath);
try {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
            process.env[key.trim()] = value.trim();
        }
    });
} catch (e) {
    console.error("Failed to read .env:", e.message);
}

const key = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
console.log("API Key present:", !!key);
if (key) console.log("API Key length:", key.length);

async function test() {
    if (!key) {
        console.error("No API KEY found!");
        return;
    }

    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    try {
        console.log("Testing model gemini-2.5-flash...");
        const result = await model.generateContent("Hello, are you working?");
        console.log("Response:", result.response.text());
        console.log("SUCCESS: API Key and Model are working.");
    } catch (e) {
        console.error("FAILURE:", e.message);
    }
}

test();
