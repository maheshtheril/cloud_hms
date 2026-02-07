'use server';
// Force Rebuild: 2025-12-29 10:25 AM
// -----------------------------------------------------------------------------
// [LOCKED] INVOICE SCANNING LOGIC - DO NOT MODIFY WITHOUT PERMISSION
// This file contains tuned prompts for India Pharma Invoice Scanning.
// See .agent/LOCKED_INVOICE_PROMPT.md for backup.
// -----------------------------------------------------------------------------

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
            "gemini-2.0-flash",           // Priority 1: 2026 Stable Flash
            "gemini-1.5-pro-002",         // Priority 2: 1.5 Pro Stable 002
            "gemini-1.5-flash-002",       // Priority 3: 1.5 Flash Stable 002
            "gemini-1.5-pro-latest",      // Fallback
            "gemini-1.5-flash-latest",    // Fallback
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
            - "supplierName": The Vendor/Supplier Name. CRITICAL FIELD.
                * ACTION: Find the entity labeled "Sold By", "From", "Seller", "Supplier", or "Billed From".
                * ACTION: If multiple names exist, pick the one clearly identified as the SELLER (top left or top center usually).
                * ACTION: Do NOT pick the "Ship To" or "Billed To" name.
                * ACTION: If a logo text is present at the top, that is likely the supplier.
            - "gstin": Supplier GSTIN / VAT Number. (Format: 15 alphanumeric chars, e.g., 29ABCDE1234F1Z5).
            - "address": Supplier Full Address.
            - "contact": Sales Executive Name or Phone.
            - "date": Invoice Date (YYYY-MM-DD).
            - "reference": Invoice Number / Bill No.
            - "defaultHsn": Common HSN code if in summary.
            - "grandTotal": Final Invoice Grand Total / Net Payable.
                * ACTION: Find the final bold amount at the bottom.
                * Label might be "Total", "Net Amount", "Grand Total", "Total Payable".
            
            Line Items (Table Items):
            - "items": Array of items.
                - "productName": Item Name / Description.
                - "hsn": HSN/SAC Code.
                - "batch": Batch Number. (Alphanumeric, e.g., "GH4521"). 
                    * WARNING: Do NOT confuse Batch with Qty. Batch usually has letters.
                - "mrp": Maximum Retail Price. (Number).
                - "unitPrice": Rate / Price to Retailer (PTR).
                - "qty": Billed Quantity. (Integer).
                    * WARNING: If column says "10x10", Qty is 10.
                    * Look for 'Qty', 'Billed Qty', 'Units'.
                - "freeQty": Free / Scheme Quantity. (Integer).
                - "taxRate": GST %. (e.g., 5, 12, 18).
                    * ACTION: If "GST %" column exists, use it.
                    * ACTION: If "GST %" is missing, but "CGST %" (e.g. 2.5 or 6) and "SGST %" (2.5 or 6) exist, SUM THEM (2.5+2.5=5, 6+6=12).
                    * ACTION: Return the TOTAL percentage (5, 12, 18, 28).
                - "discountPct": Discount %.
                - "discountAmt": Discount Amount.
                - "schemeDiscount": Scheme Amount (in currency, not qty).
                - "expiry": Expiry (YYYY-MM-DD).
                - "uom": Unit of Measure (e.g., "10S", "STRIP", "BOX", "PACK-10").
                - "packing": Packing format (e.g., "1x10", "10 TAB", "15 CAP").
        `;

        for (const modelName of candidateModels) {
            try {
                console.log(`[ScanInvoice] Trying model: ${modelName}`);
                // Zero-Temperature Config to ensure "Same Bill = Same Result"
                const model = genAI.getGenerativeModel({
                    model: modelName,
                    generationConfig: {
                        temperature: 0,
                        topP: 0.1,
                        topK: 1,
                        responseMimeType: "application/json"
                    }
                });
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
                console.log(`[ScanInvoice] Raw AI Response for ${modelName}: `, responseText);

                const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
                let data;
                try {
                    data = JSON.parse(cleanedText);
                } catch (jsonErr) {
                    console.error(`[ScanInvoice] JSON Parse Failed for ${modelName}:`, jsonErr);
                    throw new Error("AI returned invalid JSON");
                }

                // VALIDATION: Ensure we actually got items. If not, consider it a failure for this model and try next.
                if (!data.items || !Array.isArray(data.items) || data.items.length === 0) {
                    console.warn(`[ScanInvoice] Model ${modelName} returned valid JSON but 0 items. Retrying with next model...`);
                    throw new Error("AI found 0 items in invoice table.");
                }

                // If successful, process and return
                const processed = await processInvoiceData(session, data);

                // FALLBACK: If we have a known supplierId but AI returned blank name/ID, force it.
                if (supplierId) {
                    const p = processed as any;
                    if (!p.data) p.data = {};

                    if (!p.data.supplierId || !p.data.supplierName) {
                        const sup = await prisma.hms_supplier.findUnique({
                            where: { id: supplierId },
                            select: { id: true, name: true, metadata: true }
                        });
                        if (sup) {
                            p.data.supplierId = sup.id;
                            p.data.supplierName = sup.name;
                            // Consolidate metadata if needed
                            if (!p.data.gstin && (sup.metadata as any)?.gstin) p.data.gstin = (sup.metadata as any).gstin;
                        }
                    }
                }

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
    // Robust key check
    let supplierName = data.supplierName || data.SupplierName || data.vendor || data.VendorName || "";

    if (supplierName) {
        // Clean name for search (take first 2 words)
        const searchName = supplierName.split(' ').slice(0, 2).join(' ');

        let existingSupplier = null;

        // 1. Try finding by GSTIN first (High Confidence)
        if (data.gstin) {
            // Check metadata->gstin in JSON field
            existingSupplier = await prisma.hms_supplier.findFirst({
                where: {
                    company_id: session.user.companyId,
                    metadata: {
                        path: ['gstin'],
                        equals: data.gstin
                    }
                }
            });
        }

        // 2. Fallback to Name Search if not found
        if (!existingSupplier) {
            existingSupplier = await prisma.hms_supplier.findFirst({
                where: {
                    company_id: session.user.companyId,
                    name: { contains: searchName, mode: 'insensitive' }
                }
            });
        }

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

            // HEURISTIC: Fix swapped Price/MRP
            let finalPrice = parseNumber(item.unitPrice) || 0;
            let finalMrp = parseNumber(item.mrp) || 0;

            if (finalMrp > 0 && finalPrice > finalMrp) {
                console.warn(`[ScanInvoice] Swapping Price (${finalPrice}) and MRP (${finalMrp}) as Price > MRP`);
                const temp = finalPrice;
                finalPrice = finalMrp;
                finalMrp = temp;
            }

            // HEURISTIC: Identify UOM from either uom or packing field if one is missing
            let finalUom = item.uom;
            if (!finalUom && item.packing) {
                // If packing looks like a UOM (contains numbers or pharma terms), use it as UOM
                if (item.packing.match(/\d+/) || /STRIP|BOX|PACK|VIAL|AMP/i.test(item.packing)) {
                    finalUom = item.packing;
                }
            }
            finalUom = finalUom || 'PCS';

            processedItems.push({
                productId,
                productName: finalName,
                sku: item.sku,
                qty: parseNumber(item.qty) || 1,
                uom: finalUom,
                packing: item.packing,
                unitPrice: finalPrice,
                mrp: finalMrp,
                batch: item.batch,
                expiry: item.expiry,
                taxRate: item.taxRate,
                taxAmount: item.taxAmount,
                hsn: item.hsn || data.defaultHsn,
                schemeDiscount: parseNumber(item.schemeDiscount),
                discountPct: parseNumber(item.discountPct),
                discountAmt: parseNumber(item.discountAmt),
                freeQty: parseNumber(item.freeQty)
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
