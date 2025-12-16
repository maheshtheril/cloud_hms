
// prove-scan.js
const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function runProof() {
    console.log("----------------------------------------------------------------");
    console.log("   INDEPENDENT PROOF OF SCAN OPERATION (EXTREME RETRY MODE)");
    console.log("----------------------------------------------------------------");

    const fileUrl = "/uploads/invoices/1765615274527-843536389-BILL3.pdf";
    console.log(`Target File: ${fileUrl}`);

    // Manual Env Loading
    const envFiles = ['.env.local', '.env'];
    for (const file of envFiles) {
        try {
            const envPath = path.resolve(process.cwd(), file);
            if (fs.existsSync(envPath)) {
                console.log(`Loading env from ${file}...`);
                const content = fs.readFileSync(envPath, 'utf8');
                content.split('\n').forEach(line => {
                    const cleanLine = line.trim();
                    if (!cleanLine || cleanLine.startsWith('#')) return;

                    const match = cleanLine.match(/^(?:export\s+)?([^=]+)=(.*)$/);
                    if (match) {
                        const key = match[1].trim();
                        let value = match[2].trim();
                        value = value.replace(/^["'](.*)["']$/, '$1');
                        if (!process.env[key]) process.env[key] = value;
                    }
                });
            }
        } catch (e) { }
    }

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
        console.error("FATAL: No API Key in environment.");
        process.exit(1);
    }
    console.log(`API Key detected (starts with): ${apiKey.substring(0, 8)}...`);

    const fullPath = path.resolve(process.cwd(), 'public', fileUrl.replace(/^\//, ''));
    console.log(`Reading File: ${fullPath}`);

    try {
        const fileBuffer = await fs.promises.readFile(fullPath);
        const base64Image = fileBuffer.toString("base64");
        const genAI = new GoogleGenerativeAI(apiKey);

        // ONLY 2.0-flash-exp works (1.5 returns 404)
        const modelName = "gemini-2.0-flash-exp";
        console.log(`\nTARGET MODEL: ${modelName}`);

        const model = genAI.getGenerativeModel({ model: modelName });

        const prompt = `
            Analyze this purchase invoice and extract data into strict JSON.
            Header Details: "supplierName", "date", "reference".
            Line Items: "items" array with "productName", "qty", "unitPrice".
            Return ONLY raw JSON.
        `;

        let result = null;
        let attempts = 0;
        const maxRetries = 30; // 30 retries!!

        while (attempts < maxRetries) {
            try {
                attempts++;
                console.log(`  > Attempt ${attempts}/${maxRetries} (Sending Request)...`);

                result = await model.generateContent([
                    prompt,
                    { inlineData: { data: base64Image, mimeType: "application/pdf" } }
                ]);

                console.log("  > SUCCESS!");
                break;
            } catch (err) {
                const msg = err.message || String(err);

                if (msg.includes("429") || msg.includes("Too Many Requests") || msg.includes("503") || msg.includes("Overloaded")) {
                    console.log(`  > Failed: Rate Limit/Busy.`);
                    // Increase delay: 5s, 7s, 9s, ... 
                    const delay = 5000 + (attempts * 2000);
                    console.log(`  > Waiting ${delay / 1000}s...`);
                    await new Promise(r => setTimeout(r, delay));
                } else {
                    console.log(`  > CRITICAL ERROR: ${msg}`);
                    // If it's not a temporary error, we might want to stop, OR keep trying if it's network flake
                    break;
                }
            }
        }

        if (!result) {
            console.error("\nFATAL: Failed after 30 attempts.");
            return;
        }

        console.log("\n--- AI RESPONSE RECEIVED ---");
        const text = result.response.text();
        console.log(text);
        console.log("----------------------------------------------------------------");
        console.log(`VERDICT: PROVEN. Scanned successfully.`);

    } catch (err) {
        console.error("\n--- FAILURE ---");
        console.error(err.message);
    }
}

runProof();
