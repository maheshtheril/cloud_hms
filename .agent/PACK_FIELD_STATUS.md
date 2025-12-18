# Pack/UOM Field - Current Status

## ❌ USER ISSUE
"pack is not showing up in purchase edit mode"

## ✅ WHAT'S ALREADY THERE

The "Pack" field EXISTS in the purchase edit form!

**Location**: Line 850-923 in `src/app/hms/purchasing/receipts/[id]/page.tsx`

```tsx
// Column Header (Line 850)
<th>Pack</th>

// Field (Lines 904-923)
<SearchableSelect
  value={item.packing}
  onChange={(id, opt) => {
    const n = [...items];
    n[index].packing = opt?.label || id || '';
    setItems(n);
  }}
  defaultOptions={[
    ...PACKING_OPTIONS.map(o => ({ id: o, label: o })),
    ...(item.packing && !PACKING_OPTIONS.includes(item.packing) 
      ? [{ id: item.packing, label: item.packing }] 
      : []
    )
  ]}
  placeholder="Pack"
/>
```

**PACKING_OPTIONS** (Line 18):
```typescript
['1 Strip', '1 Box', '1 Bottle', '10x10', '1x10', '1x15', '1 Unit', '1 kg', '1 L']
```

## 🤔 WHY IT MIGHT NOT BE SHOWING

### Possible Issues:

1. **SearchableSelect might not display existing value**
   - Field uses `item.packing` as value
   - If `item.packing` is null/undefined, shows placeholder
   - Maybe the data isn't loading from database?

2. **Field might be visible but looks empty**
   - SearchableSelect might not show the value clearly
   - Dark theme styling issue?

3. **Data not loading from database**
   - Check if `item.packing` is actually populated when editing
   - Maybe metadata not being read correctly?

## 🔍 DIAGNOSIS NEEDED

Check:
1. Open purchase edit page
2. Open browser console
3. Look at items state - does `item.packing` have a value?
4. Is the Pack column visible in the table?
5. Is it empty or just not showing the value?

## 💡 QUICK FIX OPTIONS

### Option 1: Replace SearchableSelect with simple input
```tsx
<input
  value={item.packing || ''}
  onChange={(e) => {
    const n = [...items];
    n[index].packing = e.target.value;
    setItems(n);
  }}
  placeholder="Pack (e.g., 1x50)"
  list="packing-options"
/>
<datalist id="packing-options">
  {PACKING_OPTIONS.map(o => <option key={o} value={o} />)}
</datalist>
```

### Option 2: Change to simple dropdown
```tsx
<select
  value={item.packing || ''}
  onChange={(e) => {
    const n = [...items];
    n[index].packing = e.target.value;
    setItems(n);
  }}
>
  <option value="">Select...</option>
  {PACKING_OPTIONS.map(o => 
    <option key={o} value={o}>{o}</option>
  )}
  {item.packing && !PACKING_OPTIONS.includes(item.packing) &&
    <option value={item.packing}>{item.packing}</option>
  }
</select>
```

## 🎯 REAL QUESTION

What does user mean by "pack not showing"?

A. Column header "Pack" not visible? → It IS there
B. Pack field not visible in rows? → It IS there  
C. Pack value not displaying/loading? → Possible SearchableSelect issue
D. Want different UI (dropdown vs searchable)? → Can change

**Need clarification from user on what exactly they're seeing (or not seeing).**
