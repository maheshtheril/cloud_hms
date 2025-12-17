# 🧪 SALE PRICE TESTING GUIDE

## ✅ QUICK 5-MINUTE TEST

Follow these steps to verify everything works!

---

## 🎯 Test 1: Basic Sale Price Entry (2 minutes)

### Steps:
1. **Open Purchase Entry**
   - ✅ You're already here: http://localhost:3000/hms/purchasing/receipts/new
   
2. **Switch to Direct Entry Mode**
   - Click the "Direct Entry" button (green)
   
3. **Select a Supplier**
   - Click on "Select Vendor..." field
   - Choose any supplier from the list
   
4. **Add an Item**
   - Click "+ Add Line" button
   - Select a product
   - Enter these values:
     ```
     Quantity: 10
     Purchase Price (Cost): 100
     MRP: 150
     ```
   
5. **Look for NEW COLUMNS** ✨
   - You should see:
     - **"Sale Price"** column (after MRP)
     - **"Margin %"** column (after Sale Price)

6. **Test Sale Price Entry**
   - Click in the "Sale Price" field
   - Enter: **125**
   - Watch what happens:
     - ✅ Margin % should show: **20.0%** in GREEN/YELLOW
     - ✅ Border should be GREEN (price is ≤ MRP)

7. **Test MRP Validation**
   - Try entering: **160** (more than MRP of 150)
   - Should see:
     - ❌ RED border
     - ❌ Error toast: "Cannot exceed MRP"

### ✅ EXPECTED RESULTS:
- [x] Sale Price column visible
- [x] Margin % auto-calculated
- [x] Color-coded (green/yellow/orange/red)
- [x] MRP validation works
- [x] No crashes!

---

## 🎯 Test 2: Quick Pricing Templates (1 minute)

### Steps:
1. **Add an item with MRP**
   - Quantity: 10
   - Cost: 100
   - MRP: 150
   - Leave Sale Price EMPTY

2. **Look for Quick Pricing Bar**
   - Above the items table, you should see:
     ```
     Quick Apply: [MRP - 5%] [MRP - 10%] [MRP - 15%] [MRP - 20%]
     ```

3. **Click [MRP - 10%]**
   - Sale Price should AUTO-FILL to: **135** (150 - 10%)
   - Margin % should show: **25.9%** in GREEN

4. **Click [MRP - 20%]**
   - Sale Price should UPDATE to: **120** (150 - 20%)
   - Margin % should show: **16.7%** in YELLOW

### ✅ EXPECTED RESULTS:
- [x] Quick buttons visible
- [x] Clicking buttons updates all items
- [x] Sale prices calculate correctly
- [x] Margins update automatically

---

## 🎯 Test 3: Inline MRP Helper (30 seconds)

### Steps:
1. **Look under Sale Price input**
   - You should see a small "MRP-10%" text/button

2. **Click "MRP-10%"**
   - Sale Price should fill with: MRP × 0.9
   - For MRP 150 → Sale = 135

### ✅ EXPECTED RESULTS:
- [x] Helper button visible
- [x] Clicking fills sale price
- [x] Math is correct

---

## 🎯 Test 4: Margin Color Coding (30 seconds)

### Steps:
1. **Test Different Margins**
   - Cost: 100, MRP: 150
   
2. **Try These Sale Prices:**
   - Sale = **130** → Margin = **23.1%** → Should be 🟢 **GREEN**
   - Sale = **120** → Margin = **16.7%** → Should be 🟡 **YELLOW**
   - Sale = **112** → Margin = **10.7%** → Should be 🟠 **ORANGE**
   - Sale = **105** → Margin = **4.8%** → Should be 🔴 **RED** + Warning!

### ✅ EXPECTED RESULTS:
- [x] Green for ≥25%
- [x] Yellow for 15-24%
- [x] Orange for 10-14%
- [x] Red for <10%
- [x] Warning toast for very low margins

---

## 🎯 Test 5: Save & Verify (1 minute)

### Steps:
1. **Complete the Form**
   - Supplier: Selected ✓
   - Date: Today ✓
   - At least 1 item with sale price ✓

2. **Click Submit**
   - Should save successfully
   - Should show: "Goods received successfully"

3. **Verify in Database** (Optional)
   - Go to: http://localhost:3000/hms/purchasing/receipts
   - Find your receipt
   - Click to edit
   - Sale price should be saved!

### ✅ EXPECTED RESULTS:
- [x] Saves without errors
- [x] Sale price persists
- [x] Can edit later

---

## 🔍 VISUAL CHECKLIST

When you look at the purchase entry screen, you should see:

```
┌─────────────────────────────────────────────────────────────┐
│ PURCHASE ENTRY FORM                                          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│ Supplier: [Select Vendor...] 🔍                              │
│                                                               │
│ [Quick Apply: [MRP-5%] [MRP-10%] [MRP-15%] [MRP-20%] ]      │
│                                                               │
│ ┌───────────────────────────────────────────────────────┐   │
│ │ Item │ MRP │ Sale Price │ Margin % │ Qty │ Cost │... │   │
│ ├───────────────────────────────────────────────────────┤   │
│ │ Para │ 150 │ [135] 🟢   │ 25.9% 🟢 │ 10  │ 100  │... │   │
│ │      │     │ MRP-10%    │          │     │      │... │   │
│ └───────────────────────────────────────────────────────┘   │
│                                                               │
│ [Cancel] [Submit]                                            │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚨 COMMON ISSUES & FIXES

### Issue 1: Columns Not Visible
**Problem:** Don't see Sale Price or Margin % columns  
**Fix:** Scroll right in the table (it's a wide table)

### Issue 2: Quick Buttons Not Showing
**Problem:** Don't see [MRP-10%] buttons  
**Fix:** Add at least one item with MRP first

### Issue 3: Sale Price Won't Save
**Problem:** Enter sale price but it doesn't stick  
**Fix:** Make sure you press Enter or Tab after typing

### Issue 4: Margin Shows "-"
**Problem:** Margin % shows dash instead of number  
**Fix:** Enter both Cost AND Sale Price first

---

## 📊 EXPECTED BEHAVIOR SUMMARY

| Action | Expected Result |
|--------|----------------|
| **Enter Sale Price < MRP** | Green border, shows margin % |
| **Enter Sale Price > MRP** | Red border, error toast |
| **Enter Sale Price = Cost** | Shows 0% margin, warning |
| **Click [MRP-10%]** | All items priced at MRP-10% |
| **Click MRP-10% helper** | Single item priced at MRP-10% |
| **Margin ≥25%** | Green text |
| **Margin 15-24%** | Yellow text |
| **Margin 10-14%** | Orange text |
| **Margin <10%** | Red text + warning |

---

## 🎬 RECORDING

I've created a browser recording showing the page load.  
You can see it in the artifacts folder.

---

## ✅ SUCCESS CRITERIA

You know it's working if:
1. ✅ Sale Price column is visible
2. ✅ Margin % auto-calculates
3. ✅ Colors change based on margin
4. ✅ MRP validation prevents illegal prices
5. ✅ Quick buttons work
6. ✅ Data saves successfully

---

## 🆘 IF SOMETHING DOESN'T WORK

### Check Browser Console:
1. Press F12
2. Look for errors in Console tab
3. Share any red errors with me

### Check Network Tab:
1. Press F12 → Network tab
2. Try saving
3. Look for failed requests (red)

### Common Fixes:
- **Refresh browser** (Ctrl+F5)
- **Clear cache**
- **Restart dev server** (Ctrl+C, then npm run dev)

---

## 🎯 NEXT: Test Supplier Defaults

Once basic testing works, we can test:
1. Supplier pricing defaults dialog
2. Auto-apply functionality
3. Different suppliers with different defaults

For now, just test the core pricing features!

---

**Ready? Let's test!** 🚀

Go to: http://localhost:3000/hms/purchasing/receipts/new

And follow Test 1 above ☝️
