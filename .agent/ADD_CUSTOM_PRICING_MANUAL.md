# Add MRP=Sale Button + Custom % Input

## Quick Implementation (5 min)

### Step 1: Find line ~655 in `src/app/hms/purchasing/receipts/new/page.tsx`

Look for:
```tsx
{items.length > 0 && items.some(i => i.mrp && i.mrp > 0) && (
    <div className="bg-emerald-950/20...">
```

### Step 2: Replace the entire quick pricing div with:

```tsx
{items.length > 0 && items.some(i => i.mrp && i.mrp > 0) && (
    <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-lg p-3">
        <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-emerald-400 font-medium">Quick Apply:</span>
            
            {/* MRP = Sale Button (NEW!) */}
            <button
                type="button"
                onClick={() => applyQuickMargin('mrp-0')}
                className="px-3 py-1 text-xs rounded bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 transition-colors font-mono font-bold"
            >
                MRP = Sale
            </button>
            
            <button
                type="button"
                onClick={() => applyQuickMargin('mrp-5')}
                className="px-3 py-1 text-xs rounded bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 transition-colors font-mono"
            >
                MRP - 5%
            </button>
            <button
                type="button"
                onClick={() => applyQuickMargin('mrp-10')}
                className="px-3 py-1 text-xs rounded bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 transition-colors font-mono"
            >
                MRP - 10%
            </button>
            <button
                type="button"
                onClick={() => applyQuickMargin('mrp-15')}
                className="px-3 py-1 text-xs rounded bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 transition-colors font-mono"
            >
                MRP - 15%
            </button>
            <button
                type="button"
                onClick={() => applyQuickMargin('mrp-20')}
                className="px-3 py-1 text-xs rounded bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 transition-colors font-mono"
            >
                MRP - 20%
            </button>
            
            {/* Custom % Input (NEW!) */}
            <div className="flex items-center gap-1 ml-3 border-l border-emerald-500/20 pl-3">
                <span className="text-xs text-emerald-400 font-medium">Custom:</span>
                <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.5"
                    placeholder="7"
                    className="w-16 px-2 py-1 text-xs rounded bg-neutral-800 border border-emerald-500/30 text-emerald-300 font-mono text-center focus:border-emerald-500 focus:outline-none"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            const pct = Number((e.target as HTMLInputElement).value);
                            if (pct >= 0 && pct <= 100) {
                                applyQuickMargin(`mrp-${pct}`);
                                (e.target as HTMLInputElement).value = '';
                                toast({ title: "Applied", description: `MRP-${pct}% applied` });
                            } else {
                                toast({ title: "Invalid", description: "Enter 0-100", variant: "destructive" });
                            }
                        }
                    }}
                />
                <span className="text-xs text-neutral-500">% ↵</span>
            </div>
            
            <span className="text-xs text-neutral-500 ml-auto">
                {items.filter(i => i.mrp && i.mrp > 0).length} items
            </span>
        </div>
    </div>
)}
```

### Step 3: Update the applyQuickMargin function signature (line ~205)

Change from:
```typescript
const applyQuickMargin = (marginTemplate: 'mrp-5' | 'mrp-10' | 'mrp-15' | 'mrp-20') => {
```

To:
```typescript
const applyQuickMargin = (marginTemplate: string) => {
```

### Step 4: Update the toast message (line ~222)

Change from:
```typescript
toast({ title: "Pricing Applied", description: `MRP-${discountPct}% applied to all items` });
```

To:
```typescript
const msg = discountPct === 0 ? 'Sale Price = MRP' : `MRP-${discountPct}%`;
toast({ title: "Pricing Applied", description: `${msg} applied to all items` });
```

---

## ✅ That's It!

### Now you'll have:

**Buttons:**
- `[MRP = Sale]` - Blue button for 0% discount
- `[MRP - 5%]`, `[MRP - 10%]`, etc. - Existing buttons

**Custom Input:**
- Type any % (0, 3, 7, 12, 13.5, etc.)
- Press Enter to apply
- Handles decimals (7.5%)

---

## 🎯 Usage Examples:

### MRP = Sale:
1. Click `[MRP = Sale]` → Done!

### 7% Discount:
1. Type `7` in Custom box
2. Press Enter → Done!

### 12.5% Discount:
1. Type `12.5` in Custom box  
2. Press Enter → Done!

---

**After making these changes, refresh browser and test!**
