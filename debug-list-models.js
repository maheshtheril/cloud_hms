
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Loading env not needed if we hardcode key for debug, but better to use process.env if possible.
// Since I can't easily load .env in this script context without dotenv, I'll rely on the one in the previous file or just use the one I saw earlier?
// I saw "AIzaSyCH6dd9xxud2i5n1p4vK9XkuoW03Es0sDg" in debug-gemini-v2.js. I will use that.

const apiKey = "AIzaSyCH6dd9xxud2i5n1p4vK9XkuoW03Es0sDg";

async function main() {
    // Using the raw API to list models properly since the SDK might not expose listModels directly on the main class in all versions
    // Actually checking if sdk has it.

    // Alternative: plain fetch
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} - ${await response.text()}`);
        }
        const data = await response.json();
        console.log("Available Models:");
        if (data.models) {
            data.models.forEach(m => {
                if (m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent")) {
                    console.log(`- ${m.name} (${m.displayName})`);
                }
            });
        } else {
            console.log("No models found in response:", data);
        }
    } catch (error) {
        console.error("Error listing models:", error);
    }
}

main();
