## UOM Pack/Unit Sales - Quick Start Guide

### ✅ COMPLETED (Backend Ready)

All backend infrastructure is complete and functional:
- UOM management system
- Product conversions
- Price calculations
- Quantity conversions
- Purchase receipt UOM storage

### �� HOW TO USE (Current State)

#### Step 1: Initialize UOMs (Once)

Add this to your settings or admin page:

```tsx
import { UOMQuickSetup } from '@/components/inventory/uom-quick-setup'

// In your admin/settings page
<UOMQuickSetup />
```

Click "Initialize UOMs" to create default pharmaceutical UOMs.

#### Step 2: Configure Products with Pack/Unit

For products that need pack/unit sales, configure the conversion:

```typescript
import { createProductUOMConversion } from '@/app/actions/uom'

// Example: Paracetamol - 1 Strip = 15 Tablets
await createProductUOMConversion({
  productId: "your-product-id",
  fromUOM: "Strip",
  toUOM: "Unit",
  factor: 15
})
```

#### Step 3: Purchase Entry (Manual Process)

When entering purchase receipts, you can manually add UOM data:

1. **In Purchase Entry Form** - Add these fields manually to the payload:

```typescript
// In your purchase receipt item
{
  productId: "xxx",
  qtyReceived: 10,  // 10 strips
  unitPrice: 30,    // ₹30 per strip
  salePrice: 45,    // ₹45 per strip selling price
  
  // Add UOM fields
  purchaseUOM: "Strip",
  baseUOM: "Unit",
  conversionFactor: 15,
  salePricePerUnit: 3  // 45 ÷ 15
}
```

2. The backend will automatically store this in metadata.

#### Step 4: Sales (Manual Calculation Currently)

When billing, calculate manually:
- Selling in **Strips**: Use `salePrice` (₹45)
- Selling in **Units**: Use `salePricePerUnit` (₹3)

**Inventory reduction**: Always in base UOM (units)

---

### 🎯 NEXT: UI Automation (Optional)

To fully automate UOM in the UI, you would need:

1. **Purchase Form Enhancement**:
   - Add UOM dropdown per item
   - Auto-calculate unit price from pack price
   - Show conversion factor
   - Display both pack and unit prices

2. **Sales Form Enhancement**:
   - UOM selector dropdown
   - Real-time price adjustment
   - Stock display in selected UOM

### 📋 Manual Workflow (Current Best Practice)

Until UI is enhanced, follow this workflow:

**For Purchase:**
```
1. Create product with base UOM = "Unit"
2. Set up conversion: 1 Strip = 15 Units
3. When purchasing 10 strips @ ₹30:
   - Enter qty: 10
   - Enter price: ₹30
   - Enter sale price: ₹45
   - Manually note in "packing": "1 Strip (15 units)"
   - Calculate unit price: ₹3 (45÷15)
4. Stock increases by: 150 units (10 × 15)
```

**For Sales:**
```
Option A: Sell 2 Strips
- Price: 2 × ₹45 = ₹90
- Stock reduces: 30 units

Option B: Sell 25 Tablets
- Price: 25 × ₹3 = ₹75
- Stock reduces: 25 units
```

---

### 🛠️ Helper Functions Available

Use these in your forms for calculations:

```typescript
import { calculateSalePriceForUOM, convertToBaseUOM } from '@/app/actions/product-uom'

// Calculate price for UOM
const result = await calculateSalePriceForUOM(productId, basePrice, "Strip")
// Returns: { success: true, price: 45 }

// Convert quantity to base UOM
const result = await convertToBaseUOM(productId, 2, "Strip")
// Returns: { success: true, baseQuantity: 30 }
```

---

### 💡 RECOMMENDATION

**Current State**: The backend is fully functional. You can:
1. ✅ Initialize UOMs now
2. ✅ Configure product conversions
3. ✅ Manually track pack/unit in purchase entry
4. ✅ Manually calculate pack/unit prices in sales

**Future Enhancement**: When you're ready for full automation, we can add:
- UOM dropdowns to forms
- Automatic price calculation
- Real-time conversion display

**Best Approach**: 
- Start using the manual process now
- Get familiar with the workflow
- Later, we can enhance the UI for automation

---

**Files Reference**:
- **UOM Actions**: `src/app/actions/uom.ts`
- **Product UOM Helpers**: `src/app/actions/product-uom.ts`
- **Quick Setup Component**: `src/components/inventory/uom-quick-setup.tsx`
- **Complete Guide**: `.agent/UOM_COMPLETE_GUIDE.md`
