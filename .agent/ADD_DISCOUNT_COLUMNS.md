# 📋 Purchase Receipt - Add Discount Columns

## ✅ What You Need:

Add 3 new columns to purchase receipt details table:

1. **Sch Disc** - Scheme Discount (₹)
2. **Disc %** - Discount Percentage  
3. **Disc Amt** - Discount Amount (₹)

---

## 🎯 Implementation Plan:

### **Step 1: Type Definitions** ✅ DONE
Added to `ReceiptItem` type (line 41-43):
```typescript
schemeDiscount?: number;    // Scheme Discount (₹)
discountPct?: number;        // Discount %
discountAmt?: number;        // Discount Amount (₹)
```

### **Step 2: Table Headers** (TO DO)
Add after "Margin %" column (around line 752):
```tsx
<th className="py-4 px-2 font-medium text-xs uppercase tracking-wider text-right w-20 text-yellow-400">Sch Disc</th>
<th className="py-4 px-2 font-medium text-xs uppercase tracking-wider text-right w-16 text-yellow-400">Disc %</th>
<th className="py-4 px-2 font-medium text-xs uppercase tracking-wider text-right w-20 text-yellow-400">Disc Amt</th>
```

### **Step 3: Table Cells** (TO DO)
Add input fields for each row (around line 850):
```tsx
{/* Scheme Discount */}
<td className="py-2 px-2">
    <input
        type="number"
        className="w-full px-2 py-1.5 bg-neutral-800 border border-yellow-500/30 rounded text-yellow-300 text-right"
        value={item.schemeDiscount || ''}
        onChange={(e) => {
            const newItems = [...items];
            newItems[index].schemeDiscount = Number(e.target.value) || 0;
            setItems(newItems);
        }}
    />
</td>

{/* Discount % */}
<td className="py-2 px-2">
    <input
        type="number"
        className="w-full px-2 py-1.5 bg-neutral-800 border border-yellow-500/30 rounded text-yellow-300 text-right"
        value={item.discountPct || ''}
        onChange={(e) => {
            const newItems = [...items];
            const pct = Number(e.target.value) || 0;
            newItems[index].discountPct = pct;
            // Calculate discount amount
            newItems[index].discountAmt = (item.unitPrice * item.receivedQty * pct) / 100;
            setItems(newItems);
        }}
    />
</td>

{/* Discount Amount */}
<td className="py-2 px-2">
    <input
        type="number"
        className="w-full px-2 py-1.5 bg-neutral-800 border border-yellow-500/30 rounded text-yellow-300 text-right"
        value={item.discountAmt || ''}
        onChange={(e) => {
           const newItems = [...items];
            newItems[index].discountAmt = Number(e.target.value) || 0;
            setItems(newItems);
        }}
    />
</td>
```

### **Step 4: Database Submission** (TO DO)
Add to submit payload (around line 290):
```typescript
schemeDiscount: item.schemeDiscount || 0,
discountPct: item.discountPct || 0,
discountAmt: item.discountAmt || 0,
```

---

## 📝 Files to Edit:

**File:** `src/app/hms/purchasing/receipts/new/page.tsx`

**Lines to edit:**
- Line 752: Add table headers
- Line ~850: Add table cells
- Line ~290: Add to submission payload

---

## 🎨 Design:
- Use **yellow color** for discount columns
- Match existing table style
- Right-align numbers
- Calculate Disc Amt when Disc % changes

---

## ⚡ Quick Summary:

**Status:**
- ✅ Type updated
- ⏳ Headers need adding
- ⏳ Input fields need adding
- ⏳ Submission needs updating

**This will allow entry of:**
- Scheme discounts from suppliers
- Percentage-based discounts
- Fixed amount discounts

All three fields work together for flexible discount management!
