
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
    try {
        console.log("Listing models for key starting with:", apiKey.substring(0, 5) + "...");
        // There isn't a direct helper in the high-level SDK for listModels in quite the same way as python, 
        // but we can try a simple generation on 'gemini-pro' to see if that works, 
        // OR we can just try to fetch the model info if the SDK exposes it.
        // Actually, the JS SDK doesn't expose listModels easily in the main class. 
        // Let's try 'gemini-1.5-pro' and 'gemini-pro' as fallbacks by just running them.

        const models = ["gemini-1.5-flash", "gemini-1.5-flash-001", "gemini-1.5-pro", "gemini-pro", "gemini-2.0-flash-exp"];

        for (const m of models) {
            console.log(`Testing model: ${m}...`);
            try {
                const model = genAI.getGenerativeModel({ model: m });
                const result = await model.generateContent("Hello");
                console.log(`SUCCESS: ${m} works. Response:`, result.response.text());
                return; // Found one!
            } catch (e: any) {
                console.log(`FAILED: ${m} - ${e.message.split(' ').slice(0, 10).join(' ')}...`);
            }
        }
    } catch (e) {
        console.error("Fatal error:", e);
    }
}

listModels();
