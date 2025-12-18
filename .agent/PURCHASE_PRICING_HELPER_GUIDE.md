# 🎯 Purchase Pricing Helper - Instant UOM Calculator

## ✅ WHAT THIS IS

**A set of ready-to-use helper functions** for calculating pack/unit pricing in purchase entries.

**File**: `src/app/actions/purchase-pricing-helper.ts`

**Use Case**: When entering purchases, quickly calculate unit prices from pack prices WITHOUT modifying your existing form.

---

## 🚀 INSTANT USAGE

### 1. Calculate Pack/Unit Pricing

```typescript
import { calculatePurchasePricing } from '@/app/actions/purchase-pricing-helper'

// When entering: 10 Strips @ ₹30, selling @ ₹45, 1 Strip = 15 tablets
const pricing = await calculatePurchasePricing({
  packPrice: 30,
  packSalePrice: 45,
  conversionFactor: 15
})

console.log(pricing)
```

**Result:**
```json
{
  "packCost": 30,
  "packSalePrice": 45,
  "unitCost": 2,              // ₹30 ÷ 15 = ₹2 per tablet
  "unitSalePrice": 3,          // ₹45 ÷ 15 = ₹3 per tablet
  "marginPct": 33.33,          // (45-30)/45 × 100
  "markupPct": 50,             // (45-30)/30 × 100
  "purchaseUOM": "Strip",
  "baseUOM": "Unit",
  "conversionFactor": 15,
  "isValid": true
}
```

**Now you know**: 
- Cost per tablet: ₹2
- Sale price per tablet: ₹3
- Margin: 33.33%

---

### 2. Quick Calculator (Copy-Paste Friendly)

```typescript
import { quickCalc } from '@/app/actions/purchase-pricing-helper'

// Format: "packCost/packSale/factor"
const result = await quickCalc("30/45/15")
```

**Super fast for manual entry!** Just type the numbers.

---

### 3. Validate Before Saving

```typescript
import { validatePurchaseData } from '@/app/actions/purchase-pricing-helper'

const validation = await validatePurchaseData({
  items: [
    {
      productName: "Paracetamol",
      unitPrice: 2,
      salePrice: 3,
      mrp: 5
    }
  ]
})

if (!validation.isValid) {
  console.log("Errors:", validation.errors)
}
```

**Catches:**
- Missing sale prices
- Sale price > MRP
- Sale price < cost
- Low margins (warnings)

---

### 4. Batch Calculate Multiple Products

```typescript
import { batchCalculate } from '@/app/actions/purchase-pricing-helper'

const batch = await batchCalculate([
  { name: "Paracetamol", packPrice: 30, packSalePrice: 45, factor: 15 },
  { name: "Ibuprofen", packPrice: 40, packSalePrice: 60, factor: 10 },
  { name: "Aspirin", packPrice: 25, packSalePrice: 35, factor: 10 }
])

console.table(batch)
```

**Result:**
```
┌────────────────┬──────────┬──────────┬───────────┬──────────┐
│ Name           │ UnitCost │ UnitSale │ MarginPct │ MarkupPct│
├────────────────┼──────────┼──────────┼───────────┼──────────┤
│ Paracetamol    │   ₹2.00  │   ₹3.00  │   33.33%  │    50%   │
│ Ibuprofen      │   ₹4.00  │   ₹6.00  │   33.33%  │    50%   │
│ Aspirin        │   ₹2.50  │   ₹3.50  │   28.57%  │    40%   │
└────────────────┴──────────┴──────────┴───────────┴──────────┘
```

---

### 5. Apply Pricing Templates

```typescript
import { applyPricingTemplate } from '@/app/actions/purchase-pricing-helper'

// MRP-based pricing
const pricing1 = await applyPricingTemplate(30, 50, 'mrpMinus10')
// Returns: { salePrice: 45, marginPct: 33.33, markupPct: 50 }

// Cost-plus pricing
const pricing2 = await applyPricingTemplate(30, undefined, 'costPlus50')
// Returns: { salePrice: 45, marginPct: 33.33, markupPct: 50 }
```

**Available Templates:**
- `mrpMinus5` - MRP - 5%
- `mrpMinus10` - MRP - 10%
- `mrpMinus15` - MRP - 15%
- `mrpMinus20` - MRP - 20%
- `costPlus25` - Cost + 25%
- `costPlus33` - Cost + 33%
- `costPlus50` - Cost + 50%
- `costPlus100` - Cost + 100% (double)

---

## 🎯 REAL-WORLD WORKFLOW

### Scenario: Receiving Medicine Stock

**Step 1: Calculate Pricing**
```typescript
// Receiving: 10 Strips @ ₹30, want to sell @ ₹45
// 1 Strip = 15 tablets

const pricing = await calculatePurchasePricing({
  packPrice: 30,
  packSalePrice: 45,
  conversionFactor: 15,
  mrp: 50
})

if (!pricing.isValid) {
  alert(pricing.errors.join(', '))
  return
}

console.log(`
  Pack Cost: ₹${pricing.packCost}
  Pack Sale: ₹${pricing.packSalePrice}
  
  Unit Cost: ₹${pricing.unitCost}
  Unit Sale: ₹${pricing.unitSalePrice}
  
  Margin: ${pricing.marginPct}%
  Markup: ${pricing.markupPct}%
`)
```

**Step 2: Use in Purchase Entry**
```typescript
const purchaseData = {
  ...otherFields,
  items: [{
    productId: "paracetamol-id",
    qtyReceived: 10,
    unitPrice: pricing.packCost,        // ₹30
    salePrice: pricing.packSalePrice,    // ₹45
    
    // UOM data
    purchaseUOM: pricing.purchaseUOM,
    baseUOM: pricing.baseUOM,
    conversionFactor: pricing.conversionFactor,
    salePricePerUnit: pricing.unitSalePrice  // ₹3
  }]
}

await createPurchaseReceipt(purchaseData)
```

---

## 📊 CONSOLE HELPERS

### Quick Test in Browser Console

```javascript
// Test pricing calculation
const test = await fetch('/api/test-pricing', {
  method: 'POST',
  body: JSON.stringify({
    packPrice: 30,
    packSalePrice: 45,
    conversionFactor: 15
  })
}).then(r => r.json())

console.table(test)
```

### Excel-Style Bulk Import

```typescript
// Copy from Excel: "Product,Cost,Sale,Factor"
const csvData = `
Paracetamol,30,45,15
Ibuprofen,40,60,10
Aspirin,25,35,10
`.trim()

const items = csvData.split('\n').map(line => {
  const [name, packPrice, packSalePrice, factor] = line.split(',')
  return {
    name,
    packPrice: Number(packPrice),
    packSalePrice: Number(packSalePrice),
    factor: Number(factor)
  }
})

const calculated = await batchCalculate(items)
console.table(calculated)
```

---

## 🛠️ INTEGRATION WITH EXISTING FORMS

### Option A: Manual Calculation (No Form Changes)

```typescript
// In your purchase entry page
const handleCalculate = async () => {
  const pricing = await calculatePurchasePricing({
    packPrice: formData.unitPrice,
    packSalePrice: formData.salePrice,
    conversionFactor: 15  // User knows from packaging
  })
  
  // Show results in a modal or sidebar
  setCalculatedPricing(pricing)
}
```

### Option B: Add to Form (Minimal Changes)

```tsx
{/* Add a "Calculate" button next to your price inputs */}
<button onClick={async () => {
  const pricing = await calculatePurchasePricing({
    packPrice: item.unitPrice,
    packSalePrice: item.salePrice,
    conversionFactor: 15
  })
  
  toast({
    title: "Pricing Calculated",
    description: `Unit Price: ₹${pricing.unitSalePrice} | Margin: ${pricing.marginPct}%`
  })
  
  // Optionally auto-fill fields
  setItem({
    ...item,
    purchaseUOM: pricing.purchaseUOM,
    baseUOM: pricing.baseUOM,
    conversionFactor: pricing.conversionFactor,
    salePricePerUnit: pricing.unitSalePrice
  })
}}>
  Calculate UOM
</button>
```

---

## 📝 COMMON USE CASES

### 1. **Quick Price Check**
```typescript
// Is my pricing correct?
const pricing = await quickCalc("30/45/15")
console.log(`Margin: ${pricing.marginPct}%`) // Check if acceptable
```

### 2. **Bulk Entry Preparation**
```typescript
// Preparing to enter 50 products
const allProducts = await batchCalculate([...products])
// Export to CSV for review
```

### 3. **Price Validation Before Save**
```typescript
// In your submit handler
const validation = await validatePurchaseData({ items })
if (!validation.isValid) {
  showErrors(validation.errors)
  return
}
// Proceed with save
```

### 4. **Apply Standard Pricing**
```typescript
// Company policy: Always sell at MRP - 10%
for (const item of items) {
  const pricing = await applyPricingTemplate(
    item.cost,
    item.mrp,
    'mrpMinus10'
  )
  item.salePrice = pricing.salePrice
}
```

---

## 🎯 ADVANTAGES

✅ **No form changes needed** - Works with existing code  
✅ **Instant calculations** - Server-side accuracy  
✅ **Built-in validations** - Catches pricing errors  
✅ **Batch processing** - Handle multiple products  
✅ **Template support** - Apply standard pricing rules  
✅ **Type-safe** - Full TypeScript support  

---

## 🔧 TROUBLESHOOTING

### Error: "Sale price is less than cost"
```typescript
// Check your input
const pricing = await calculatePurchasePricing({
  packPrice: 45,          // ❌ Cost
  packSalePrice: 30,      // ❌ Sale (should be higher)
  conversionFactor: 15
})
// Fix: Swap the prices or increase sale price
```

### Warning: "Low margin"
```typescript
// Margin < 10%
const pricing = await calculatePurchasePricing({
  packPrice: 40,
  packSalePrice: 42,      // Only ₹2 profit
  conversionFactor: 15
})
// Consider: Increase sale price or reduce cost
```

---

## 📦 EXAMPLE: Complete Purchase Flow

```typescript
// 1. Calculate pricing
const pricing = await calculatePurchasePricing({
  packPrice: 30,
  packSalePrice: 45,
  conversionFactor: 15,
  mrp: 50
})

// 2. Validate
if (!pricing.isValid) {
  console.error(pricing.errors)
  return
}

// 3. Create purchase entry
const purchase = {
  supplierId: "supplier-123",
  receivedDate: new Date(),
  items: [{
    productId: "para-123",
    qtyReceived: 10,                    // 10 strips
    unitPrice: pricing.packCost,         // ₹30
    salePrice: pricing.packSalePrice,    // ₹45
    purchaseUOM: pricing.purchaseUOM,
    baseUOM: pricing.baseUOM,
    conversionFactor: pricing.conversionFactor,
    salePricePerUnit: pricing.unitSalePrice  // ₹3
  }]
}

// 4. Validate full purchase
const validation = await validatePurchaseData(purchase)
if (!validation.isValid) {
  console.error(validation.errors)
  return
}

// 5. Save
await createPurchaseReceipt(purchase)

// Stock: +150 tablets (10 × 15)
```

---

## ✅ READY TO USE

Just import and call these functions in your purchase entry workflow!

```typescript
import {
  calculatePurchasePricing,
  quickCalc,
  validatePurchaseData,
  batchCalculate,
  applyPricingTemplate
} from '@/app/actions/purchase-pricing-helper'
```

**No form modifications needed** - Use as standalone helpers! 🚀
