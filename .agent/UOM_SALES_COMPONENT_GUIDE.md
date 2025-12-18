# UOM-Enabled Sales Component - Usage Guide

## ✅ What I've Created

A **plug-and-play UOM selector component** that you can easily add to your billing/sales forms.

**File**: `src/components/billing/uom-selector.tsx`

---

## 🎯 Features

✅ **Automatic Price Calculation** - Price updates when UOM changes  
✅ **Real-time Total** - Shows line total instantly  
✅ **Conversion Display** - Shows conversion factor (e.g., "15x base")  
✅ **Smart Defaults** - Falls back to base UOM if no default provided  
✅ **Loading State** - Shows skeleton while loading UOMs  
✅ **Single UOM Handling** - Simplifies UI for products with one UOM  

---

## 📖 How to Use

### Basic Integration

```tsx
import { UOMSelector } from '@/components/billing/uom-selector'

function InvoiceLine() {
  const [lineData, setLineData] = useState(null)

  return (
    <UOMSelector
      productId="paracetamol-id"
      basePrice={3}  // Base price per unit
      defaultQty={1}
      onChange={(data) => {
        setLineData(data)
        console.log(data)
        // {
        //   qty: 2,
        //   uom: "Strip",
        //   unitPrice: 45,
        //   lineTotal: 90,
        //   conversionFactor: 15
        // }
      }}
    />
  )
}
```

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `productId` | string | ✅ | Product ID to load UOMs for |
| `basePrice` | number | ✅ | Base price per base UOM |
| `defaultQty` | number | ❌ | Initial quantity (default: 1) |
| `defaultUOM` | string | ❌ | Initial UOM (default: base UOM) |
| `onChange` | function | ✅ | Callback when qty/UOM changes |
| `className` | string | ❌ | Additional CSS classes |

###onChange Callback Data

```typescript
{
  qty: number                 // Selected quantity
  uom: string                 // Selected UOM
  unitPrice: number           // Calculated price for selected UOM
  lineTotal: number           // qty × unitPrice
  conversionFactor: number    // Factor to base UOM
}
```

---

## 🔧 Integration Example: Invoice Editor

### Step 1: Add to Your Line Item State

```typescript
type LineItem = {
  id: number
  productId: string
  productName: string
  qty: number
  uom: string
  unitPrice: number
  lineTotal: number
  conversionFactor: number
  taxRate: number
}
```

### Step 2: Use in Your Form

```tsx
{items.map((item, index) => (
  <tr key={item.id}>
    <td>
      {/* Product Selector */}
      <SearchableSelect
        value={item.productId}
        onChange={(id, opt) => {
          updateLine(item.id, 'productId', id)
          updateLine(item.id, 'productName', opt?.label)
        }}
        onSearch={searchProducts}
        placeholder="Select product..."
      />
    </td>
    
    <td>
      {/* UOM Selector */}
      <UOMSelector
        productId={item.productId}
        basePrice={item.basePrice || 0}
        defaultQty={item.qty}
        defaultUOM={item.uom}
        onChange={(data) => {
          // Update all line data at once
          updateLine(item.id, 'qty', data.qty)
          updateLine(item.id, 'uom', data.uom)
          updateLine(item.id, 'unitPrice', data.unitPrice)
          updateLine(item.id, 'lineTotal', data.lineTotal)
          updateLine(item.id, 'conversionFactor', data.conversionFactor)
        }}
      />
    </td>
    
    <td className="text-right font-semibold">
      ₹{item.lineTotal.toFixed(2)}
    </td>
  </tr>
))}
```

### Step 3: When Saving Invoice

```typescript
const handleSave = async () => {
  const payload = {
    patientId,
    invoiceDate: new Date(),
    items: items.map(item => ({
      productId: item.productId,
      quantity: item.qty,
      uom: item.uom,                      // Store selected UOM
      unitPrice: item.unitPrice,          // Price for that UOM
      conversionFactor: item.conversionFactor,  // For inventory reduction
      lineTotal: item.lineTotal,
      taxRate: item.taxRate
    }))
  }
  
  await createInvoice(payload)
}
```

---

## 🎨 UI Demo

### Multi-UOM Product (e.g., Paracetamol)

```
┌─────┬──────────┬──────────────┬──────────┐
│ Qty │ UOM      │ Price        │ Total    │
├─────┼──────────┼──────────────┼──────────┤
│  2  │ Strip ▼  │ @ ₹45.00     │ = ₹90.00 │ (15x base)
└─────┴──────────┴──────────────┴──────────┘

Dropdown options:
- Unit (base)
- Strip (15x)
- Box (150x)
```

### Single-UOM Product (e.g., Consultation)

```
┌─────┬──────┬──────────┐
│ Qty │ UOM  │ Price    │
├─────┼──────┼──────────┤
│  1  │ Unit │ @ ₹500.00│
└─────┴──────┴──────────┘

(No dropdown shown - simpler UI)
```

---

## 💡 Real-World Example

### Product Setup
```typescript
// Paracetamol 500mg
{
  id: "para-123",
  name: "Paracetamol 500mg",
  baseUOM: "Unit",
  basePrice: 3,  // ₹3 per tablet
  
  conversions: [
    { from: "Strip", to: "Unit", factor: 15 },  // 1 Strip = 15 tablets
    { from: "Box", to: "Unit", factor: 150 }   // 1 Box = 150 tablets
  ]
}
```

### Sales Scenarios

**Scenario 1: Sell 2 Strips**
```tsx
<UOMSelector
  productId="para-123"
  basePrice={3}
  onChange={(data) => {
    console.log(data)
    // {
    //   qty: 2,
    //   uom: "Strip",
    //   unitPrice: 45,        // 3 × 15
    //   lineTotal: 90,        // 2 × 45
    //   conversionFactor: 15
    // }
  }}
/>
```

**Scenario 2: Sell 25 Tablets**
```tsx
// User selects:
// Qty: 25
// UOM: Unit

// Result:
// {
//   qty: 25,
//   uom: "Unit",
//   unitPrice: 3,
//   lineTotal: 75,
//   conversionFactor: 1
// }
```

---

## 🔄 Inventory Reduction

When processing the sale, use the `conversionFactor` to reduce inventory in base UOM:

```typescript
// In your billing action
async function processSale(items) {
  for (const item of items) {
    const baseQuantity = item.qty * item.conversionFactor
    
    // Reduce stock by base quantity
    await reduceInventory(item.productId, baseQuantity)
    
    // Example:
    // Sold: 2 Strips (conversionFactor = 15)
    // Reduce: 2 × 15 = 30 Units
  }
}
```

---

## 🎯 Complete Integration Checklist

- [x] Create UOM selector component
- [ ] Add to invoice line items
- [ ] Update line item state type
- [ ] Connect onChange handler
- [ ] Update save/submit logic to include UOM data
- [ ] Update inventory reduction to use conversion factor
- [ ] Test with multi-UOM product
- [ ] Test with single-UOM product

---

## 📝 Quick Copy-Paste Integration

### 1. Import Component
```tsx
import { UOMSelector } from '@/components/billing/uom-selector'
```

### 2. Update State
```tsx
const [items, setItems] = useState<LineItem[]>([])

type LineItem = {
  // ... existing fields
  uom: string
  conversionFactor: number
}
```

### 3. Add to Render
```tsx
<UOMSelector
  productId={item.productId}
  basePrice={item.basePrice}
  onChange={(data) => {
    // Update your state
    updateLine(item.id, data)
  }}
/>
```

---

## 🚀 Advanced: Display-Only Mode

For invoices in view/print mode:

```tsx
import { UOMDisplay } from '@/components/billing/uom-selector'

<UOMDisplay
  quantity={2}
  uom="Strip"
  unitPrice={45}
/>
// Renders: "2 Strip × ₹45.00 = ₹90.00"
```

---

## 🎁 What This Enables

✅ **Flexible Selling** - Sell same product in different UOMs  
✅ **Automatic Pricing** - No manual calculation needed  
✅ **Accurate Inventory** - Always tracked in base UOM  
✅ **Better UX** - Real-time price feedback  
✅ **Professional** - Industry-standard functionality  

---

## 📚 Related Files

- **Component**: `src/components/billing/uom-selector.tsx`
- **Actions**: `src/app/actions/product-uom.ts`
- **UOM Setup**: `src/app/actions/uom.ts`
- **Documentation**: `.agent/UOM_COMPLETE_GUIDE.md`

---

**Status**: ✅ Ready to Use
**Integration Time**: ~15 minutes
**Testing**: Verify with a multi-UOM product first

Need help integrating? Just ask! 🚀
