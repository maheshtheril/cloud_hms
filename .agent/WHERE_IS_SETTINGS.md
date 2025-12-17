# ✅ UPDATED: How to Find and Use Settings

## 📍 WHERE IS THE SETTINGS BUTTON?

### Step-by-Step to Find It:

1. **Open Purchase Entry**
   - Already open: http://localhost:3000/hms/purchasing/receipts/new

2. **Select a Supplier**
   - Click on "Select Vendor..." field
   - Choose any supplier
   
3. **Look at the Top-Right of Supplier Section**
   ```
   Received From                    [+ New] [⚙️ Pricing]  ← HERE!
   ───────────────────────────────────────────────────────
   [Supplier Name Selected]
   ```

4. **Click the "⚙️ Pricing" Button**
   - It appears ONLY when a supplier is selected
   - It's next to the "+ New" button
   - It's in GREEN color (emerald)

---

## 🎯 SIMPLE TEST (2 MINUTES)

### Test Without Settings (Manual Pricing):
```
1. Go to: http://localhost:3000/hms/purchasing/receipts/new
2. Click "Direct Entry" (green button)
3. Select a supplier
4. Add item:
   - Product: Any
   - Qty: 10
   - Cost: 100
   - MRP: 150
5. Manually enter Sale Price: 135
6. See: Margin = 25.9% (green)
```

### Test With Quick Buttons:
```
1. Same setup as above
2. Look above the table for:
   Quick Apply: [MRP - 5%] [MRP - 10%] [MRP - 15%] [MRP - 20%]
3. Click [MRP - 10%]
4. See: Sale Price auto-fills to 135
5. See: Margin auto-calculates to 25.9%
```

---

## ⚙️ TO TEST SETTINGS (Optional - Not Critical):

### Location:
```
1. Select a supplier
2. Look at top-right of "Received From" section
3. You'll see TWO buttons:
   [+ New]  [⚙️ Pricing] ← Click this one
```

### What It Does:
- Opens a dialog to configure default pricing for that supplier
- In future purchases from that supplier, prices will auto-fill

### But You Don't Need This for Basic Testing!
The core features (Sale Price + Margin + Quick Buttons) work WITHOUT this.

---

## 📸 VISUAL GUIDE

### Where to Look:

```
┌─────────────────────────────────────────────────────┐
│ PURCHASE ENTRY FORM                                  │
├─────────────────────────────────────────────────────┤
│                                                       │
│ Received From            [+ New] [⚙️ Pricing] ←HERE │
│ ─────────────────────────────────────────────────────│
│ ABC Pharma Distributors                              │
│                                                       │
│ GSTIN: 29XXXXX1234                                   │
└─────────────────────────────────────────────────────┘
```

---

## 🎬 WHAT TO TEST NOW:

### Priority 1: Core Features (MUST TEST)
✅ **Sale Price Column** - Can you see it?
✅ **Margin % Column** - Auto-calculates?
✅ **Color Coding** - Green/yellow/orange/red?
✅ **MRP Validation** - Red border when price > MRP?
✅ **Quick Buttons** - [MRP-10%] works?

### Priority 2: Settings (OPTIONAL)
⚠️ **Settings Button** - Can you find it?
⚠️ **Dialog Opens** - Clickable?
⚠️ **Save Works** - No errors?

---

## 🚨 IF YOU DON'T SEE THE SETTINGS BUTTON:

### Checklist:
- [ ] Did you select a supplier first?
- [ ] Look at the TOP of the supplier section
- [ ] Look to the RIGHT (not left)
- [ ] Is there a "+ New" button? Settings is next to it
- [ ] Try refreshing the page (Ctrl+F5)

---

## 💡 SIMPLIFIED TESTING PLAN

**Just test these 3 things:**

### 1. Can You See New Columns?
```
Look for: | Sale Price | Margin % |
```

### 2. Does Quick Pricing Work?
```
Click: [MRP - 10%]
Result: Sale price fills automatically
```

### 3. Do Colors Change?
```
Try different prices
See: Green → Yellow → Orange → Red
```

**That's it! Settings are bonus.**

---

## 📝 WHERE IS THE TEST RUNNING?

- **Dev Server**: Running on port 3000
- **URL**: http://localhost:3000/hms/purchasing/receipts/new
- **Browser**: Should be already open

---

## 🎯 QUICK ACTIONS:

### Just want to see it work?
```
1. Go to URL above
2. Click "Direct Entry"
3. Pick supplier
4. Add item (any product)
5. Fill: Cost=100, MRP=150
6. Click [MRP-10%] button
7. Watch Sale Price = 135, Margin = 25.9%
```

Done! That's the core feature working! ✨

---

**Questions? Just let me know what you see!**
