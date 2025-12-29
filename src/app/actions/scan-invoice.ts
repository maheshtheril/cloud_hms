'use server';
// Force Rebuild: 2025-12-29 10:25 AM

import { GoogleGenerativeAI } from "@google/generative-ai";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { uploadFile } from "@/app/actions/upload-file";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");

export async function scanInvoiceAction(input: FormData | string, supplierId?: string): Promise<{ success?: boolean; data?: any; error?: string }> {
    let fileUrl = '';

    if (typeof input === 'string') {
        fileUrl = input;
    } else {
        const res = await uploadFile(input, 'invoices');
        if (res.error) return { error: res.error };
        if (!res.url) return { error: "Upload failed" };
        fileUrl = res.url;
    }

    return await scanInvoiceFromUrl(fileUrl, supplierId);
}



export async function scanInvoiceFromUrlWithSupplier(fileUrl: string, supplierId?: string) {
    const session = await auth();
    if (!session?.user?.companyId) return { error: "Unauthorized" };

    // DRY Principle: Reuse the file loading logic
    // We'll refactor slightly to share the image loading code
    return scanInvoiceFromUrl(fileUrl, supplierId);
}

// Updated signature to support supplierId
export async function scanInvoiceFromUrl(fileUrl: string, supplierId?: string) {
    const session = await auth();
    if (!session?.user?.companyId) return { error: "Unauthorized" };

    try {
        let base64Image = "";
        let mimeType = "image/jpeg";

        // ... (Image loading logic same as before) ...
        if (fileUrl.startsWith('data:')) {
            const match = fileUrl.match(/^data:([^;]+);base64,(.+)$/);
            if (!match) return { error: "Invalid Data URI format" };
            mimeType = match[1];
            base64Image = match[2];
        } else {
            const relativePath = fileUrl.startsWith('/') ? `.${fileUrl}` : fileUrl;
            const fs = require('fs/promises');
            const path = require('path');
            const fullPath = path.resolve(process.cwd(), 'public', relativePath.replace(/^\/public\//, '').replace(/^\//, ''));
            try { await fs.access(fullPath); } catch (e) { return { error: "File not found" }; }
            const fileBuffer = await fs.readFile(fullPath);
            base64Image = fileBuffer.toString("base64");
            const ext = path.extname(fullPath).toLowerCase();
            if (ext === ".pdf") mimeType = "application/pdf";
            else if (ext === ".png") mimeType = "image/png";
            else if (ext === ".webp") mimeType = "image/webp";
        }

        let supplierRules = "";
        if (supplierId) {
            const supplier = await prisma.hms_supplier.findUnique({
                where: { id: supplierId },
                select: { metadata: true, name: true }
            });
            if (supplier && supplier.metadata) {
                const meta = supplier.metadata as any;
                if (meta.ai_rules) {
                    supplierRules = `\nSPECIFIC INSTRUCTIONS FOR SUPPLIER '${supplier.name}':\n${meta.ai_rules}\n(Prioritize these rules over general instructions).\n`;
                }
            }
        }

        const candidateModels = [
            "gemini-2.0-flash-exp",   // Smartest (Experimental)
            "gemini-2.5-flash-lite",  // New Fast/Lite
            "gemini-1.5-flash",
            "gemini-1.5-pro",
            "gemini-pro-vision"
        ];

        let lastError = null;

        // Construct the prompt
        // Inject supplier rules if available
        const prompt = `
            ${supplierRules ? `
            IMPORTANT - CUSTOM EXTRACTION RULES FOR THIS SUPPLIER:
            ${supplierRules}
            
            Follow these custom rules STRICTLY over standard assumptions.
            ------------------------------------------------------------
            ` : ''}

            Analyze this purchase invoice and extract data into strict JSON.
            
            Header Details:
            - "supplierName": The Vendor/Supplier Name. LOCATION: Top-Left corner of the page. It is usually the very first text block you read. It is usually BOLD or LARGEST text. Look for keywords: 'Traders', 'Agencies', 'Enterprises', 'Pharma', 'Stores'. It is NOT 'Tax Invoice'. It is NOT the Buyer.
            - "gstin": Supplier GSTIN / VAT Number.
            - "address": Supplier Full Address.
            - "contact": Sales Executive Name or Phone (if available).
            - "date": Invoice Date in YYYY-MM-DD format.
            - "reference": Invoice Number / Bill Number.
            - "defaultHsn": Common HSN/SAC code if listed in header/footer/summary (fallback).
            - "grandTotal": Final Invoice Grand Total / Net Payable Amount.
                * Look for "Net Payable", "Grand Total", "Invoice Total", "Total Amount".
                * If multiple totals exist (e.g. Sub Total, Taxable), pick the FINAL PAYABLE amount.
                
            Line Items (Table rows):
            - "items": Array of objects:
                - "productName": Full item description.
                - "sku": Product Code / SKU.
                - "hsn": HSN/SAC Code. Look for 4-8 digit numbers.
                - "batch": Batch Number. Look for "Batch", "Lot", "B.No". 
                    * This often contains letters and numbers (e.g. SH245016, CR25002).
                - "qty": Billed Quantity. 
                    * MUST be a number. 
                    * Do NOT confuse with Batch Number. If the value has letters (e.g. 'SH24...'), it is NOT the quantity.
                    * Look for 'Qty', 'Quantity', 'Units'.
                - "expiry": Expiry Date (YYYY-MM-DD or MM/YY).
                - "uom": Unit of Measure (PACK-10, PACK-15, STRIP, BOX, BOTTLE, PCS).
                    * If packing is "1's" or "1s", default to "STRIP" or "PCS" depending on product.
                - "packing": Packing details. CRITICAL.
                    * Look for "1x10", "10x10", "1x15", "200ml", "10's", "10S".
                    * Check 'Packing' column, 'Pack' column, OR inside 'Particulars'/'Description'.
                    * If column says "1's", look at Product Name for clues (e.g. "10TAB" -> 1x10).
                    * If product is Syrup/Liquid -> "200ml", "100ml".
                    * Standardize to "1x10" format if possible.
                - "unitPrice": Unit Rate/Price PER PACK (before tax). Look for 'Rate' or 'Price'.
                - "mrp": Maximum Retail Price.
                - "taxRate": GST Tax Percentage. Look for columns "GST %", "GST", "IGST", "SGST", "CGST".
                    * If you see "GST %" column with values "5", "12", "18", return that number.
                    * If you see separate "CGST %" and "SGST %" (e.g. 2.5% + 2.5%), SUM THEM UP (return 5.0).
                    * Return ONLY the number (e.g. 5, 12, 18).
                - "taxAmount": Total Tax Amount.
                - "schemeDiscount": Scheme Discount Amount (Schm Amt).
                - "discountPct": Discount %.
                - "discountAmt": Discount Amount.
                - "qty": Billed Quantity. The main quantity column.
                - "freeQty": Scheme/Free Quantity. Look for 'Sch Qty', 'Free', 'Bonus'. 
                    * Extract explicit numbers only (10, 12+1 -> 12).
                    * Ignore checkmarks, slashes, or empty cells.
                    * If column 'Sch Qty' has '12' and 'Qty' has '30', return freeQty=12, qty=30.
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
                uom: item.uom || 'PCS', // ← Add UOM
                packing: item.packing, // ← Add packing
                unitPrice: parseNumber(item.unitPrice) || 0,
                mrp: parseNumber(item.mrp) || 0,
                batch: item.batch,
                expiry: item.expiry,
                taxRate: item.taxRate,
                taxAmount: item.taxAmount,
                hsn: item.hsn || data.defaultHsn,
                schemeDiscount: parseNumber(item.schemeDiscount),
                discountPct: parseNumber(item.discountPct),
                discountAmt: parseNumber(item.discountAmt),
                freeQty: parseNumber(item.freeQty) // <-- Added freeQty back
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
