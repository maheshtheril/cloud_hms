# 📋 Sale Bill (Invoice) - Improvements Needed

## ✅ Current Status:
Purchase Receipt discount calculation is PERFECT! ✓

## 🎯 Next Steps for Sale Bill:

### **1. Item Search Box**
**Issue:** Item selection is not user-friendly
**Fix Needed:** Add searchable input box for items
- File: `src/components/billing/invoice-editor.tsx`
- Find `product_id` dropdown
- Replace with SearchableSelect component
- Allow typing to search products

### **2. Item Name Column Width**
**Issue:** Item name column not visible properly
**Fix Needed:** Increase column width
- Make item name column wider (at least 30%)
- Ensure full product names are visible
- Add ellipsis for very long names

### **3. Auto-Fill Tax Rate**
**Issue:** Tax is 0 by default in sale bills
**GST Rule:** For local purchases, Sale Tax = Purchase Tax
**Fix Needed:**
- When item is selected, check product's purchase tax rate
- Auto-fill the same tax rate in sale bill
- User can still override if needed

**Logic:**
```typescript
When product selected:
1. Get product.metadata.purchase_tax_rate
2. If local purchase (intra-state):
   - sale_tax_rate = purchase_tax_rate
3. Pre-fill tax rate in line item
4. Calculate tax automatically
```

---

## 🔧 Implementation Details:

### **File to Edit:**
`src/components/billing/invoice-editor.tsx`

### **Changes:**

**1. Add SearchableSelect for products:**
```tsx
<SearchableSelect
    value={line.product_id}
    onChange={(id, product) => {
        updateLine(line.id, 'product_id', id);
        // Auto-fill from product
        if (product) {
            updateLine(line.id, 'description', product.name);
            updateLine(line.id, 'unit_price', product.price);
            // Auto-fill tax rate from purchase
            if (product.metadata?.purchase_tax_rate) {
                updateLine(line.id, 'tax_rate_id', product.metadata.purchase_tax_rate);
            }
        }
    }}
    onSearch={async (q) => {
        // Search products
        return billableItems
            .filter(p => p.name.toLowerCase().includes(q.toLowerCase()))
            .map(p => ({ id: p.id, label: p.name, data: p }));
    }}
    placeholder="Search product..."
/>
```

**2. Increase column widths:**
```tsx
// Item Name column
<th className="w-[30%]">Item</th>

// Description input
<input className="w-full" />
```

**3. Auto-fill tax logic in updateLine:**
```typescript
const updateLine = (id, field, value) => {
    const newLines = lines.map(line => {
        if (line.id === id) {
            const updated = { ...line, [field]: value };
            
            // If product changed, auto-fill tax
            if (field === 'product_id' && value) {
                const product = billableItems.find(p => p.id === value);
                if (product?.metadata?.purchase_tax_rate) {
                    updated.tax_rate_id = product.metadata.purchase_tax_rate;
                }
            }
            
            // Recalc tax when qty/price/tax% changes
            if (['quantity', 'unit_price', 'tax_rate_id'].includes(field)) {
                const taxRate = getTaxRate(updated.tax_rate_id);
                const taxable = updated.quantity * updated.unit_price - (updated.discount_amount || 0);
                updated.tax_amount = taxable * (taxRate / 100);
            }
            
            return updated;
        }
        return line;
    });
    setLines(newLines);
};
```

---

## 📊 Expected Behavior:

**When user selects a product:**
1. ✅ Product name fills in description
2. ✅ Unit price fills in from product
3. ✅ **Tax rate auto-fills from product's purchase tax**
4. ✅ Tax calculated automatically
5. ✅ User can still change any field manually

---

## 🎯 Priority:
1. **High:** Auto-fill tax rate (GST compliance)
2. **Medium:** Searchable product select
3. **Low:** Column width adjustment

Would you like me to implement these changes now?
