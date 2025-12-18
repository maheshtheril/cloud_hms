'use server';

import { GoogleGenerativeAI } from "@google/generative-ai";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { uploadFile } from "@/app/actions/upload-file";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");

export async function scanInvoiceAction(formData: FormData): Promise<{ success?: boolean; data?: any; error?: string }> {
    const res = await uploadFile(formData, 'invoices');
    if (res.error) return { error: res.error };
    if (!res.url) return { error: "Upload failed" };

    return await scanInvoiceFromUrl(res.url);
}

export async function scanInvoiceFromUrl(fileUrl: string) {
    const session = await auth();
    if (!session?.user?.companyId) return { error: "Unauthorized" };

    try {
        // Resolve URL to file path. Assumes local storage in public/
        const relativePath = fileUrl.startsWith('/') ? `.${fileUrl}` : fileUrl;
        const fs = require('fs/promises');
        const path = require('path');
        const fullPath = path.resolve(process.cwd(), 'public', relativePath.replace(/^\/public\//, '').replace(/^\//, ''));

        // Check if file exists
        try {
            await fs.access(fullPath);
        } catch (err) {
            console.error(`[ScanInvoice] File not found at path: ${fullPath}`, err);
            return { error: `File not found on server at ${fullPath}` };
        }

        // --- API KEY CHECK ---
        if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
            console.error("GOOGLE_GENERATIVE_AI_API_KEY is missing.");
            return { error: "Configuration Error: AI API Key is missing on the server. Please check your .env file." };
        }

        const fileBuffer = await fs.readFile(fullPath);
        const base64Image = fileBuffer.toString("base64");

        // Determine mime type roughly
        const ext = path.extname(fullPath).toLowerCase();
        let mimeType = "image/jpeg";
        if (ext === ".pdf") mimeType = "application/pdf";
        else if (ext === ".png") mimeType = "image/png";
        else if (ext === ".webp") mimeType = "image/webp";

        // List of models to try in order of preference
        // 'gemini-2.0-flash-exp' exists (returns 429). 
        // 'gemini-1.5-*' returned 404. 
        // Found 'gemini-2.5-flash-lite' and 'gemini-flash-latest' in active model list.
        const candidateModels = [
            "gemini-2.0-flash-exp",   // Smartest (Experimental)
            "gemini-2.5-flash-lite",  // New Fast/Lite
            "gemini-flash-latest"     // Stable Alias
        ];

        let lastError = null;

        const prompt = `
            Analyze this purchase invoice and extract data into strict JSON.
            
            Header Details:
            - "supplierName": The Vendor/Supplier Name. LOCATION: Top-Left corner of the page. It is usually the very first text block you read. It is usually BOLD or LARGEST text. Look for keywords: 'Traders', 'Agencies', 'Enterprises', 'Pharma', 'Stores'. It is NOT 'Tax Invoice'. It is NOT the Buyer.
            - "gstin": Supplier GSTIN / VAT Number.
            - "address": Supplier Full Address.
            - "contact": Sales Executive Name or Phone (if available).
            - "date": Invoice Date in YYYY-MM-DD format.
            - "reference": Invoice Number / Bill Number.
            - "defaultHsn": Common HSN/SAC code if listed in header/footer/summary (fallback).
            - "grandTotal": Final Invoice Grand Total Amount (Numeric).
            
            Line Items (Table rows):
            - "items": Array of objects:
                - "productName": Full item description.
                - "sku": Product Code / SKU.
                - "hsn": HSN/SAC Code. extract the numeric code (e.g. 300490, 8517). Do NOT return the word 'HSN' or 'SAC'.
                - "batch": Batch Number.
                - "expiry": Expiry Date (YYYY-MM-DD or MM/YY).
                - "qty": Quantity (numeric).
                - "uom": Unit of Measure (e.g., NOS, STRIPS).
                - "packing": Packing details (e.g. 1x10).
                - "unitPrice": Unit Rate/Price (before tax). Do NOT Use MRP. Look for 'Rate' or 'Price'.
                - "mrp": Maximum Retail Price (MRP). Extract the numeric value. Do NOT return the words 'MRP' or 'Rate' or 'Price'. Return 0 if not found.
                - "schemeDiscount": Scheme Discount Amount (if shown separately).
                - "discountPct": Discount Percentage (if shown).
                - "discountAmt": Total Discount Amount.
                - "taxRate": Tax Percentage. IMPORTANT: If tax is split (e.g. CGST 2.5% + SGST 2.5%), return the SUM (e.g. 5.0). Return the TOTAL tax rate.
                - "taxAmount": Total Tax Amount for line.
                - "amount": Final Line Amount.
            
            Return ONLY raw JSON. No markdown formatting.
        `;

        for (const modelName of candidateModels) {
            try {
                console.log(`[ScanInvoice] Trying model: ${modelName}`);
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent([
                    prompt,
                    {
                        inlineData: {
                            data: base64Image,
                            mimeType: mimeType,
                        },
                    },
                ]);

                const responseText = result.response.text();
                console.log(`[ScanInvoice] Raw AI Response for ${modelName}:`, responseText);

                const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
                let data;
                try {
                    data = JSON.parse(cleanedText);
                } catch (jsonErr) {
                    console.error(`[ScanInvoice] JSON Parse Failed for ${modelName}:`, jsonErr);
                    throw new Error("AI returned invalid JSON");
                }

                // If successful, process and return
                const processed = await processInvoiceData(session, data);
                console.log("[ScanInvoice] Processed Result:", JSON.stringify(processed, null, 2));
                return processed;

            } catch (error: any) {
                const errMsg = error.message || String(error);
                console.warn(`[ScanInvoice] Model ${modelName} failed:`, errMsg);

                lastError = error;

                // SPECIAL HANDLING: If 429 (Rate Limit) or Quota Exceeded, retry with exponential backoff
                if (errMsg.includes("429") || errMsg.includes("Too Many Requests") || errMsg.includes("Quota exceeded") || errMsg.includes("limit")) {
                    console.log(`[ScanInvoice] Hit Rate Limit on ${modelName}. Starting retry sequence...`);

                    const maxRetries = 3;
                    // Waits: 5s, 15s, 45s. Cumulative > 60s to clear minute quota.
                    const delays = [5000, 15000, 45000];

                    for (let attempt = 1; attempt <= maxRetries; attempt++) {
                        const delay = delays[attempt - 1] || 60000;
                        console.log(`[ScanInvoice] Retry attempt ${attempt}/${maxRetries} for ${modelName} after ${delay}ms...`);

                        await new Promise(resolve => setTimeout(resolve, delay));

                        try {
                            const model = genAI.getGenerativeModel({ model: modelName });
                            const result = await model.generateContent([
                                prompt,
                                { inlineData: { data: base64Image, mimeType: mimeType } }
                            ]);

                            const responseText = result.response.text();
                            const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
                            const data = JSON.parse(cleanedText);
                            return await processInvoiceData(session, data);

                        } catch (retryErr: any) {
                            const retryMsg = retryErr.message || String(retryErr);
                            console.warn(`[ScanInvoice] Retry ${attempt} failed for ${modelName}:`, retryMsg);

                            // If it is NOT a rate limit error anymore (e.g. 500 or 400), abort retries for this model
                            const isRateLimit = retryMsg.includes("429") || retryMsg.includes("Too Many Requests") || retryMsg.includes("Quota") || retryMsg.includes("limit");
                            if (!isRateLimit) {
                                break;
                            }
                            // If still rate limit, continue to next longer wait
                        }
                    }
                    console.warn(`[ScanInvoice] All retries failed for ${modelName}. Moving to next model.`);
                }

                continue;
            }
        }

        throw lastError || new Error("All models failed.");

    } catch (error: any) {
        console.error("AI Scan Error Detailed:", error);

        let msg = error.message || String(error);
        if (msg.includes("429") || msg.includes("Too Many Requests") || msg.includes("Quota exceeded")) {
            return { error: "AI Server Busy (Rate Limit). Please wait 30-60 seconds and try again." };
        }
        if (msg.includes("503") || msg.includes("Overloaded")) {
            return { error: "AI Server Overloaded. Please try again in 1 minute." };
        }

        return { error: `AI Scan Failed: ${msg}` };
    }
}

async function processInvoiceData(session: any, data: any) {
    // 1. Supplier: Find or Create
    let supplierId = null;
    let supplierName = data.supplierName || "";

    if (supplierName) {
        // Clean name for search (take first 2 words)
        const searchName = supplierName.split(' ').slice(0, 2).join(' ');

        const existingSupplier = await prisma.hms_supplier.findFirst({
            where: {
                company_id: session.user.companyId,
                name: { contains: searchName, mode: 'insensitive' }
            }
        });

        if (existingSupplier) {
            supplierId = existingSupplier.id;
            supplierName = existingSupplier.name;
            // Optional: Update metadata if missing? Skipping for now to avoid overwrites.
        } else {
            const newSupplier = await prisma.hms_supplier.create({
                data: {
                    tenant_id: session.user.tenantId!,
                    company_id: session.user.companyId!,
                    name: supplierName,
                    is_active: true,
                    metadata: {
                        gstin: data.gstin,
                        address: data.address,
                        contact_person: data.contact,
                        source: "ai_scan_created"
                    }
                }
            });
            supplierId = newSupplier.id;
        }
    }

    // 2. Items: Map to Products
    // Fetch all active products for the company to perform robust in-memory matching
    // We select minimal fields to keep it lightweight
    const allProducts = await prisma.hms_product.findMany({
        where: {
            company_id: session.user.companyId,
            is_active: true
        },
        select: {
            id: true,
            name: true,
            sku: true,
            price: true,
            metadata: true // For MRP check if stored there
        }
    });

    const processedItems = [];
    if (data.items && Array.isArray(data.items)) {
        for (const item of data.items) {
            let productId = null;
            let finalName = item.productName;
            let matchConfidence = "none"; // debug info

            const itemPrice = parseNumber(item.unitPrice);
            const itemMrp = parseNumber(item.mrp);

            // Helper for matching
            const findBestMatch = (targetName: string, candidates: typeof allProducts) => {
                let best = null;
                let bestScore = 0;

                const normTarget = targetName.toLowerCase().replace(/[^a-z0-9]/g, '');

                for (const cand of candidates) {
                    // 1. Exact SKU
                    if (item.sku && cand.sku && cand.sku.toLowerCase() === item.sku.toLowerCase()) {
                        return { product: cand, score: 1.0, type: 'exact_sku' };
                    }

                    // 2. Exact Name (Normalized)
                    const normCand = cand.name.toLowerCase().replace(/[^a-z0-9]/g, '');
                    if (normCand === normTarget) {
                        // If exact name matches, it's a very strong candidate. 
                        // We prefer this over SKU if SKU is missing.
                        // But if SKU matched above, we would have returned.
                        return { product: cand, score: 1.0, type: 'exact_name' };
                    }

                    // 3. Fuzzy Name (Levenshtein-ish or Dice Coefficient)
                    // Simple Dice Coefficient (bigram) is better for typos than simple distance for long strings
                    const score = getSimilarity(normTarget, normCand);
                    if (score > bestScore) {
                        bestScore = score;
                        best = cand;
                    }
                }
                return { product: best, score: bestScore, type: 'fuzzy' };
            };

            const matchResult = findBestMatch(item.productName, allProducts);

            if (matchResult.product) {
                const p = matchResult.product;
                const score = matchResult.score;

                // DECISION LOGIC
                let accepted = false;

                if (matchResult.type === 'exact_sku' || matchResult.type === 'exact_name') {
                    accepted = true;
                } else if (score >= 0.85) {
                    // Very high name similarity - Accept even if price differs (prices change)
                    accepted = true;
                    matchConfidence = "high_name";
                } else if (score >= 0.60) {
                    // Moderate similarity - Check Price or MRP
                    // Check Price (within 10%)
                    const dbPrice = Number(p.price) || 0;
                    const priceDiff = Math.abs(dbPrice - itemPrice);
                    const isPriceClose = dbPrice > 0 && (priceDiff / dbPrice) < 0.10;

                    if (isPriceClose) {
                        accepted = true;
                        matchConfidence = "medium_name_price_match";
                    }
                }

                if (accepted) {
                    productId = p.id;
                    finalName = p.name; // Use DB name to standardize
                    console.log(`[SmartMatch] Matched '${item.productName}' -> '${p.name}' (Score: ${score.toFixed(2)}, Type: ${matchResult.type}, Conf: ${matchConfidence})`);
                } else {
                    console.log(`[SmartMatch] Rejected '${item.productName}' -> Best: '${p.name}' (Score: ${score.toFixed(2)} - Too Low)`);
                }
            } else {
                console.log(`[SmartMatch] No candidate found for '${item.productName}'`);
            }

            // Fallback: If no productId, we do NOT auto-create (as per user request)
            // productId stays null.

            processedItems.push({
                productId,
                productName: finalName,
                sku: item.sku,
                qty: parseNumber(item.qty) || 1,
                unitPrice: parseNumber(item.unitPrice) || 0,
                mrp: parseNumber(item.mrp) || 0,
                batch: item.batch,
                expiry: item.expiry,
                taxRate: item.taxRate,
                taxAmount: item.taxAmount,
                hsn: item.hsn || data.defaultHsn,
                packing: item.packing,
                schemeDiscount: parseNumber(item.schemeDiscount),
                discountPct: parseNumber(item.discountPct),
                discountAmt: parseNumber(item.discountAmt)
            });
        }
    }

    return {
        success: true,
        data: {
            supplierId,
            supplierName,
            gstin: data.gstin, // Client can use this
            address: data.address,
            contact: data.contact,
            date: data.date,
            reference: data.reference,
            grandTotal: parseNumber(data.grandTotal),
            items: processedItems
        }
    };
}

function parseNumber(val: any): number {
    if (!val) return 0;
    if (typeof val === 'number') return val;
    // Remove all non-numeric chars except dot and minus (but handle multiple dots?)
    // Simple approach: remove typical currency symbols and non-digits
    const clean = String(val).replace(/[^0-9.-]/g, '');
    return Number(clean);
}

function getSimilarity(s1: string, s2: string): number {
    let longer = s1;
    let shorter = s2;
    if (s1.length < s2.length) {
        longer = s2;
        shorter = s1;
    }
    const longerLength = longer.length;
    if (longerLength === 0) {
        return 1.0;
    }
    return (longerLength - editDistance(longer, shorter)) / parseFloat(String(longerLength));
}

function editDistance(s1: string, s2: string): number {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();

    const costs = new Array();
    for (let i = 0; i <= s1.length; i++) {
        let lastValue = i;
        for (let j = 0; j <= s2.length; j++) {
            if (i == 0)
                costs[j] = j;
            else {
                if (j > 0) {
                    let newValue = costs[j - 1];
                    if (s1.charAt(i - 1) != s2.charAt(j - 1))
                        newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
                    costs[j - 1] = lastValue;
                    lastValue = newValue;
                }
            }
        }
        if (i > 0)
            costs[s2.length] = lastValue;
    }
    return costs[s2.length];
}
