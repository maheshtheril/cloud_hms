# UOM System - HONEST STATUS

**Date**: 2025-12-18 14:55 IST  
**Status**: SIMPLIFIED - UOM is a LABEL only

---

## ✅ WHAT WORKS NOW

### Sales Billing
- ✅ UOM dropdown visible (Unit, Strip, Box, Bottle, Pack)
- ✅ UOM is saved with invoice
- ❌ Price does NOT auto-change (you enter manually)

**How to use:**
1. Select product
2. Select UOM (e.g., "Strip")
3. **Manually enter the correct price** for that UOM
4. Save

**Example:**
- "On Call Plus Strips" @ 5 units per strip
- Select UOM: "Strip"
- Enter price: ₹[whatever price for 1 strip]
- ❌ System will NOT calculate this automatically

---

## ❌ WHAT DOESN'T WORK

### Purchase Entry Edit Mode
- ❌ UOM field NOT showing in purchase edit form
- Need to add UOM dropdown there too

### Auto Price Calculation
- ❌ Removed because products have DIFFERENT pack sizes
- "Strip" doesn't always mean 15 units
- Each product is different (5, 10, 15, etc)
- No database of conversion factors per product yet

---

## 🎯 WHAT'S NEEDED

### 1. Add UOM to Purchase Edit Form
**Location**: Probably `src/app/hms/purchasing/receipts/[id]/page.tsx`

Need to add UOM dropdown to the edit form, similar to sales:
```tsx
<select value={item.uom || 'Unit'}>
  <option value="Unit">Unit</option>
  <option value="Strip">Strip</option>
  <option value="Box">Box</option>
  <option value="Bottle">Bottle</option>
  <option value="Pack">Pack</option>
</select>
```

### 2. Proper UOM System (Future)
To make auto-pricing work, need:
1. Store conversion factor PER PRODUCT in database
2. "On Call Plus Strips" → 5 units per strip
3. "Paracetamol Strips" → 15 units per strip
4. Read from database, not hardcode

---

## 📋 CURRENT BEHAVIOR

### Sales Billing Form
```
Product: [Select Product ▼]
Qty: [2] [Strip ▼]  ← UOM dropdown here
Price: [Enter manually]  ← User types price
```

### Purchase Entry (New)
```
Has UOM fields in the form
(Already working from earlier implementation)
```

### Purchase Entry (Edit Mode)
```
❌ Missing UOM dropdown ← NEED TO ADD THIS
```

---

## 🔧 IMMEDIATE FIX NEEDED

Add UOM dropdown to purchase edit mode form.

**File to modify**: Find the purchase edit form component
**Add**: Same UOM dropdown as in sales billing

---

## 💡 HONEST SUMMARY

**Working:**
- UOM dropdown in sales ✅
- UOM saves with invoice ✅
- User can see what unit was sold ✅

**Not Working:**
- Auto price calculation ❌ (removed because wrong)
- UOM in purchase edit mode ❌ (need to add)
- Per-product conversion factors ❌ (not in database)

**User Must:**
- Select correct UOM manually
- Enter correct price manually
- Know the conversion themselves

---

This is an HONEST status. The UOM system exists but is MANUAL, not automatic.
