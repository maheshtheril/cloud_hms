---
description: UOM Pack/Unit Sales Implementation Plan
---

# UOM Pack/Unit Sales System Implementation

## Overview
Implement a complete Unit of Measure (UOM) conversion system to handle products purchased in packs but sold in both packs and individual units.

## Use Case Example
- **Product**: Paracetamol 500mg Tablets
- **Purchase**: 1 Strip = 15 Tablets @ ₹30/strip
- **Sales Options**: 
  - Sell 1 Strip @ ₹45/strip
  - Sell 1 Tablet @ ₹3/tablet
- **Inventory**: Automatically tracked in base UOM

## Database Schema (Already Available)

### `hms_uom_category`
- Groups related UOMs (e.g., "Count", "Weight", "Volume")

### `hms_uom`
- Defines individual units (e.g., "Strip", "Tablet", "Box")
- `uom_type`: 'reference' (base) or 'bigger'/'smaller'
- `ratio`: Conversion ratio to reference unit

### `hms_product_uom_conversion`
- Product-specific conversions
- `from_uom` → `to_uom`
- `factor`: Conversion multiplier

### `hms_product`
- `uom`: Default/base UOM for the product
- `uom_id`: Link to hms_uom table

## Implementation Steps

### Step 1: Create UOM Management Actions
**File**: `src/app/actions/uom.ts`

```typescript
// Actions needed:
- getUOMCategories()
- getUOMs(categoryId?)
- createUOM(data)
- createProductUOMConversion(productId, fromUOM, toUOM, factor)
- getProductUOMConversions(productId)
```

### Step 2: Seed Default UOMs
Create common pharmaceutical UOMs:
- **Tablets/Capsules**: Tablet, Strip, Box
- **Liquids**: ml, Bottle, Carton
- **Injectables**: Vial, Ampoule, Box

### Step 3: Update Purchase Entry
**File**: `src/app/actions/receipt.ts`

Add fields:
- `purchase_uom`: UOM used in purchase
- `base_uom`: Product's base UOM
- `conversion_factor`: Auto-calculated

### Step 4: Update Sales Billing
**File**: `src/app/actions/billing.ts` or invoice actions

Features:
- Dropdown to select UOM per line item
- Auto-calculate price based on UOM
- Show both pack and unit prices
- Update inventory in base UOM

### Step 5: Pricing Strategy

**Purchase Receipt**:
```json
{
  "product": "Paracetamol 500mg",
  "qty": 10,
  "purchase_uom": "Strip (15s)",
  "unit_cost": 30.00,
  "base_uom": "Tablet",
  "conversion_factor": 15,
  "pricing": {
    "strip_sale_price": 45.00,
    "tablet_sale_price": 3.00  // 45/15 = 3
  }
}
```

**Sales Invoice**:
- User selects "Strip" → Price: ₹45
- User selects "Tablet" → Price: ₹3
- Inventory reduced by: qty × conversion_factor (in base UOM)

### Step 6: UI Components

**Purchase Form Enhancement**:
- UOM dropdown (default to product's UOM)
- Show conversion info: "1 Strip = 15 Tablets"
- Pricing per UOM section

**Sales Form Enhancement**:
- UOM selector per line
- Live price update based on UOM
- Stock availability shown in selected UOM

## Pricing Calculation Logic

```typescript
// Calculate unit price from pack price
function calculateUnitPrice(packPrice: number, conversionFactor: number): number {
  return packPrice / conversionFactor;
}

// Calculate pack price from unit price
function calculatePackPrice(unitPrice: number, conversionFactor: number): number {
  return unitPrice * conversionFactor;
}

// Get selling price for selected UOM
function getSellingPrice(product: Product, selectedUOM: string): number {
  if (selectedUOM === product.base_uom) {
    return product.base_sale_price;
  }
  
  const conversion = getConversion(product.id, product.base_uom, selectedUOM);
  return product.base_sale_price * conversion.factor;
}
```

## Inventory Management

**Stock Ledger Update**:
- All inventory movements recorded in **base UOM**
- Display conversions in UI

```typescript
// Example: Sell 2 Strips
{
  product_id: "xxx",
  qty_sold: 2,
  uom_sold: "Strip",
  base_uom: "Tablet",
  conversion_factor: 15,
  inventory_reduction: 2 × 15 = 30 tablets // Stored in ledger
}
```

## Validation Rules

1. ✅ Base UOM must be defined for each product
2. ✅ Conversion factors must be positive
3. ✅ At purchase: Record both purchase UOM and base UOM pricing
4. ✅ At sale: Validate stock availability in base UOM
5. ✅ Price consistency: unit_price × factor ≈ pack_price

## Future Enhancements

1. **Multi-level conversions**: Box → Strip → Tablet
2. **Dynamic pricing**: Different margins for pack vs. unit sales
3. **Batch-wise UOM**: Different batches, different pack sizes
4. **Reports**: Sales by UOM analysis

## Testing Scenarios

### Scenario 1: Simple Pack/Unit
- Purchase: 100 strips @ ₹30/strip (1 strip = 15 tablets)
- Stock: 1,500 tablets
- Sale: 5 strips → Reduce 75 tablets
- Sale: 10 tablets → Reduce 10 tablets
- Remaining: 1,415 tablets

### Scenario 2: Mixed Sales
- Start: 1,000 tablets
- Sale 1: 2 strips (30 tablets) @ ₹45/strip
- Sale 2: 25 tablets @ ₹3/tablet
- Final: 945 tablets
- Revenue: ₹90 + ₹75 = ₹165

## Implementation Priority

**Phase 1** (Now):
1. Create UOM management actions
2. Seed default UOMs
3. Update purchase entry with UOM support

**Phase 2** (Next):
4. Enhance sales billing with UOM selection
5. Add UOM conversion UI components

**Phase 3** (Polish):
6. Reports and analytics
7. Advanced validations
8. Batch-specific UOM handling

---

**Status**: Ready to implement
**Estimated Time**: 2-3 hours for Phase 1 & 2
