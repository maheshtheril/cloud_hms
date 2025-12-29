[LOCKED PROMPT CONFIGURATION - DO NOT EDIT]
Last Updated: 2025-12-29
Locked By: User Request (Step 2038)

The following AI Prompt logic is CRITICAL for invoice scanning accuracy.
ANY changes to this file must be explicitly requested by the user.
Automated agents should NOT modify the prompt structure, rules, or model selection.

--- PROMPT START ---
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
    - "schemeDiscount": Scheme Discount Amount. Look for 'Schm Amt', 'Sch Amt', 'Schm', 'Less', 'Disc', 'Scheme'.
        * If found, return the absolute number value.
    - "discountPct": Discount %.
    - "discountAmt": Discount Amount.
    - "qty": Billed Quantity. The main quantity column.
    - "freeQty": Scheme/Free Quantity. Look for 'Sch Qty', 'Free', 'Bonus'. 
        * Extract explicit numbers only (10, 12+1 -> 12).
        * Ignore checkmarks, slashes, or empty cells.
        * If column 'Sch Qty' has '12' and 'Qty' has '30', return freeQty=12, qty=30.
--- PROMPT END ---

--- CRITICAL LOGIC ---
1. Model Selection Priority: "gemini-1.5-flash", "gemini-1.5-pro", "gemini-2.0-flash-exp"
2. Heuristic: If UnitPrice > MRP, SWAP THEM.
3. Validation: If items.length === 0, retry with next model.
4. Supplier Rules: Inject from DB if available.
----------------------
