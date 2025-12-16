
const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = "AIzaSyCH6dd9xxud2i5n1p4vK9XkuoW03Es0sDg";
const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
    console.log("Checking wider range of models...");
    const models = [
        "gemini-1.5-flash",
        "gemini-1.5-flash-001",
        "gemini-1.5-flash-002",
        "gemini-1.5-flash-8b",
        "gemini-1.5-pro",
        "gemini-1.5-pro-001",
        "gemini-1.5-pro-002",
        "gemini-pro",
        "gemini-1.0-pro",
        "gemini-2.0-flash-exp"
    ];

    for (const m of models) {
        process.stdout.write(`Testing ${m}... `);
        try {
            const model = genAI.getGenerativeModel({ model: m });
            // Minimal prompt
            const result = await model.generateContent("Hi");
            console.log("SUCCESS!");
        } catch (e) {
            console.log("FAILED: " + e.message.split(' ').slice(0, 10).join(' ') + "...");
        }
    }
}

listModels();
