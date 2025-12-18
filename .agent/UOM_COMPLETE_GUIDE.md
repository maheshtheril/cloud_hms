# UOM Pack/Unit Implementation - Complete Guide

## ✅ Implementation Status

### Phase 1: Core Infrastructure ✅ COMPLETE
- ✅ Created UOM management actions (`src/app/actions/uom.ts`)
- ✅ Created product UOM helper functions (`src/app/actions/product-uom.ts`)
- ✅ Updated purchase receipt types with UOM fields
- ✅ Updated purchase receipt creation to store UOM data
- ✅ Updated purchase receipt update to store UOM data
- ✅ Created UOM quick setup component

## 🎯 What This Enables

Your HMS ERP now supports:
1. **Multi-UOM Purchasing**: Buy in packs (strips, boxes)
2. **Multi-UOM Sales**: Sell in both packs AND individual units
3. **Automatic Price Calculation**: Unit price auto-calculated from pack price
4. **Accurate Inventory**: Stock tracked in base UOM regardless of sale UOM
5. **Flexible Conversions**: Product-specific conversion factors

## 📦 Real-World Example

### Product: Paracetamol 500mg Tablets

**Setup:**
```typescript
Base UOM: "Unit" (1 tablet)
Purchase UOM: "Strip" 
Conversion: 1 Strip = 15 Units
```

**Purchase Entry:**
```
Quantity: 10 strips
Unit Price: ₹30/strip
Sale Price (Strip): ₹45/strip
Auto-calculated -> Sale Price (Unit): ₹3/tablet
Stock Added: 150 units (10 × 15)
```

**Sales Options:**

**Option 1: Sell by Strip**
```
Customer buys: 2 strips
Price: 2 × ₹45 = ₹90
Stock reduced: 30 units (2 × 15)
```

**Option 2: Sell by Unit**
```
Customer buys: 25 tablets
Price: 25 × ₹3 = ₹75
Stock reduced: 25 units
```

**Option 3: Mixed Sale**
```
Line 1: 1 strip @ ₹45 = ₹45
Line 2: 10 tablets @ ₹3 = ₹30
Total: ₹75
Stock reduced: 25 units (15 + 10)
```

## 🔧 How to Use

### 1. Initialize UOMs (One-Time Setup)

**Option A: Use Quick Setup Component**
```tsx
import { UOMQuickSetup } from '@/components/inventory/uom-quick-setup'

// In your admin/settings page
<UOMQuickSetup />
```

**Option B: Call Action Directly**
```typescript
import { seedDefaultUOMs } from '@/app/actions/uom'

await seedDefaultUOMs()
```

This creates:
- **Count Category**: Unit, Strip, Box
- **Weight Category**: mg, g, kg
- **Volume Category**: ml, Bottle, Liter

### 2. Configure Product UOM Conversions

For each product that needs multi-UOM support:

```typescript
import { createProductUOMConversion } from '@/app/actions/uom'

// Example: Paracetamol - 1 Strip = 15 Tablets
await createProductUOMConversion({
    productId: "product-uuid",
    fromUOM: "Strip",
    toUOM: "Unit",
    factor: 15  // 1 Strip contains 15 Units
})

// Automatically creates reverse: 1 Unit = 0.0667 Strips
```

### 3. Purchase Entry with UOM

When creating a purchase receipt, include UOM data:

```typescript
import { createPurchaseReceipt } from '@/app/actions/receipt'

await createPurchaseReceipt({
    supplierId: "supplier-uuid",
    receivedDate: new Date(),
    items: [{
        productId: "product-uuid",
        qtyReceived: 10,  // 10 strips
        unitPrice: 30,    // ₹30 per strip
        salePrice: 45,    // ₹45 per strip
        mrp: 50,
        
        // UOM fields
        purchaseUOM: "Strip",
        baseUOM: "Unit",
        conversionFactor: 15,
        salePricePerUnit: 3  // Auto-calculated: 45 ÷ 15 = 3
    }]
})
```

### 4. Sales with UOM Selection

#### Get Available UOMs for Product
```typescript
import { getProductAvailableUOMs } from '@/app/actions/product-uom'

const result = await getProductAvailableUOMs(productId)
// Returns: [
//   { uom: "Unit", factor: 1.0, isBase: true },
//   { uom: "Strip", factor: 15, isBase: false }
// ]
```

#### Calculate Price for Selected UOM
```typescript
import { calculateSalePriceForUOM } from '@/app/actions/product-uom'

// Base price (Unit): ₹3
const result = await calculateSalePriceForUOM(productId, 3, "Strip")
// Returns: { success: true, price: 45 } // 3 × 15 = 45
```

#### Convert Quantity to Base UOM
```typescript
import { convertToBaseUOM } from '@/app/actions/product-uom'

// Customer buys 2 strips
const result = await convertToBaseUOM(productId, 2, "Strip")
// Returns: { success: true, baseQuantity: 30 } // 2 × 15 = 30 units
```

## 🛠️ Available Actions & Functions

### UOM Management (`src/app/actions/uom.ts`)

| Function | Purpose | Example |
|----------|---------|---------|
| `getUOMCategories()` | Get all UOM categories with their UOMs | Admin settings |
| `createUOMCategory(name)` | Create new UOM category | "Length", "Time" |
| `getUOMs(categoryId?)` | Get UOMs, optionally filtered | Get all "Count" UOMs |
| `createUOM(data)` | Create new UOM | "Dozen", "Gross" |
| `getProductUOMConversions(productId)` | Get conversions for a product | Product config page |
| `createProductUOMConversion(data)` | Define conversion rule | 1 Box = 100 Units |
| `seedDefaultUOMs()` | Initialize default pharmaceutical UOMs | One-time setup |

### Product UOM Helpers (`src/app/actions/product-uom.ts`)

| Function | Purpose | Returns |
|----------|---------|---------|
| `getProductWithUOM(productId)` | Get product + UOM + pricing | Full product info |
| `getProductAvailableUOMs(productId)` | Get sellable UOMs | UOM dropdown options |
| `calculateSalePriceForUOM(productId, basePrice, targetUOM)` | Calculate price for UOM | Sale price in selected UOM |
| `convertToBaseUOM(productId, qty, sourceUOM)` | Convert to base for inventory | Inventory reduction qty |
| `getStockInUOM(productId, targetUOM)` | Check stock in specific UOM | Available stock display |

## 📊 Database Schema

### UOM Categories
```sql
hms_uom_category
├─ id
├─ tenant_id
├─ company_id
├─ name (e.g., "Count", "Weight")
└─ created_at
```

### UOMs
```sql
hms_uom
├─ id
├─ category_id → hms_uom_category
├─ name (e.g., "Strip", "Box")
├─ uom_type ("reference", "bigger", "smaller")
├─ ratio (conversion ratio to reference)
└─ rounding
```

### Product UOM Conversions
```sql
hms_product_uom_conversion
├─ id
├─ product_id → hms_product
├─ from_uom (e.g., "Strip")
├─ to_uom (e.g., "Unit")
└─ factor (e.g., 15)
```

### Purchase Receipt Line (metadata)
```json
{
  "mrp": 50,
  "sale_price": 45,
  "purchase_uom": "Strip",
  "base_uom": "Unit",
  "conversion_factor": 15,
  "sale_price_per_unit": 3
}
```

## 🔄 Workflow

### Purchase Flow
```
1. Receive stock: 10 Strips @ ₹30/strip
   ↓
2. System records:
   - Purchase UOM: Strip
   - Base UOM: Unit
   - Conversion: 15
   - Sale Price (Strip): ₹45
   - Sale Price (Unit): ₹3 (calculated)
   ↓
3. Inventory updated: +150 Units
```

### Sales Flow
```
1. Customer selects product
   ↓
2. Dropdown shows: [Unit, Strip]
   ↓
3. Customer chooses "Strip"
   ↓
4. Enter quantity: 2
   ↓
5. System calculates:
   - Price: 2 × ₹45 = ₹90
   - Inventory reduction: 2 × 15 = 30 Units
   ↓
6. Stock updated: -30 Units
```

## ⚠️ Important Validations

### Purchase Entry Validation
```typescript
✅ Sale price for pack must be provided
✅ Sale price for unit = pack price ÷ conversion factor
✅ Sale price (pack) ≤ MRP
✅ Sale price (unit) ≥ Cost per unit
```

### Sales Validation
```typescript
✅ Check stock availability in base UOM
✅ Validate UOM exists for product
✅ Ensure conversion factor is available
✅ Price must be positive
```

## 🚀 Next Steps to Complete

### Phase 2: UI Integration (PENDING)

1. **Update Purchase Entry Form**
   - Add UOM dropdown (default to product's base UOM)
   - Show conversion info: "1 Strip = 15 Units"
   - Auto-calculate unit price when pack price is entered
   - Display both pack and unit prices

2. **Update Sales Billing Form**
   - Add UOM selector per line item
   - Live price update when UOM changes
   - Show available stock in selected UOM
   - Display conversion info

3. **Product Configuration Page**
   - Manage UOM conversions
   - Set default purchase/sale UOMs
   - View all configured conversions

### Phase 3: Reports & Analytics (FUTURE)

1. Sales by UOM reports
2. Inventory valuation across UOMs
3. Purchase/Sales price comparison by UOM
4. UOM-wise profit margins

## 📝 Implementation Checklist

- [x] Create UOM management actions
- [x] Create product UOM helper functions
- [x] Update purchase receipt types
- [x] Update purchase receipt creation logic
- [x] Update purchase receipt update logic
- [x] Create validation rules
- [x] Create quick setup component
- [x] Write comprehensive documentation
- [ ] Update purchase entry UI form
- [ ] Update sales billing UI form
- [ ] Update product configuration UI
- [ ] Add UOM selection dropdowns
- [ ] Add price calculation in real-time
- [ ] Test with real products
- [ ] Train users on UOM system

## 💡 Best Practices

1. **Always define base UOM** for products (usually the smallest sellable unit)
2. **Use consistent naming** for UOMs across products
3. **Test conversions** before going live
4. **Inform users** about available UOMs during sales
5. **Review pricing** regularly to ensure unit prices match pack prices
6. **Monitor inventory** to ensure conversions are working correctly

## 🐛 Troubleshooting

### Issue: UOM conversion not found
**Solution**: Ensure conversion is created for the product using `createProductUOMConversion()`

### Issue: Wrong unit price calculation
**Solution**: Verify conversion factor: pack_price ÷ factor = unit_price

### Issue: Stock mismatch
**Solution**: All inventory must be tracked in base UOM. Check that sales reduce stock by: qty × conversion_factor

### Issue: Cannot sell in different UOM
**Solution**: 
1. Check product has base UOM defined
2. Verify conversion exists in `hms_product_uom_conversion`
3. Ensure both forward and reverse conversions exist

## 📞 Support

For questions or issues, refer to:
- Implementation plan: `.agent/workflows/uom-pack-unit-implementation.md`
- This guide: `.agent/UOM_COMPLETE_GUIDE.md`
- UOM actions: `src/app/actions/uom.ts`
- Helper functions: `src/app/actions/product-uom.ts`

---

**Last Updated**: 2025-12-18
**Status**: Phase 1 Complete ✅ | Phase 2 Pending 🟡 | Phase 3 Future 🔵
