# UOM Pack/Unit Implementation Plan

## Database Schema (✅ Already Exists!)

### Tables:
1. **hms_uom_category** - Groups UOMs (e.g., "Pharma Packaging")
2. **hms_uom** - UOM definitions (PCS, PACK-10, etc.)
3. **hms_product_uom_conversion** - Product-specific conversions

## Implementation Tasks

### Phase 1: Seed Common UOMs ✅
- [x] Create seed script for pharma UOMs
  - PCS (reference, ratio: 1)
  - PACK-10 (bigger, ratio: 10)
  - PACK-15 (bigger, ratio: 15)
  - PACK-20, PACK-30
  - STRIP, BOX, BOTTLE

### Phase 2: UOM Management UI
- [ ] `/settings/inventory/uoms` page
  - List all UOMs
  - Create/Edit/Delete UOMs
  - Set ratios and rounding

### Phase 3: Product UOM Configuration  
- [ ] Add UOM section in Product Form
  - Set base UOM
  - Define allowed purchase/sale UOMs
  - Set conversion factors

### Phase 4: Purchase with UOM Conversion
- [ ] Update Purchase Order to save UOM
- [ ] On receipt, convert to base UOM for stock
  - Example: Receive 5 PACK-10 → Add 50 PCS to stock

### Phase 5: Sales with UOM Selection
- [ ] Update Sales/Billing form
  - UOM dropdown per line
  - Auto-calculate based on conversion
  - Example: Sell 2 PACK-10 → Deduct 20 PCS from stock

### Phase 6: Stock Display
- [ ] Show stock in multiple UOMs
  - Stock: 50 PCS = 5 PACK-10 or 3 PACK-15 + 5 loose

## Conversion Logic

```typescript
// Purchase: 5 PACK-10 @ ₹45 per pack
qty: 5
uom: PACK-10
unitPrice: 45

// Convert to base for stock
baseQty = 5 × 10 = 50 PCS
avgCost = (5 × 45) / 50 = ₹4.50 per PCS

// Stock ledger entry
{
  qty: 50,
  uom: 'PCS',
  cost: 4.50
}
```

```typescript
// Sale: 2 PACK-10
qty: 2
uom: PACK-10  
price: 60 (per pack)

// Convert to base for stock deduction
baseQty = 2 × 10 = 20 PCS

// Invoice shows
{
  qty: 2,
  uom: 'PACK-10',
  price: 60,
  total: 120
}

// Stock deducted: 20 PCS
```

## Priority Order
1. Seed UOMs (Quick win)
2. Purchase UOM saving
3. Receipt conversion to base
4. Sales UOM selection  
5. UI for UOM management

## Files to Modify
- [x] `src/app/actions/scan-invoice.ts` - AI extraction
- [ ] `src/app/actions/purchase.ts` - Save UOM
- [ ] `src/app/actions/receipt.ts` - Convert on receipt
- [ ] `src/app/actions/billing.ts` - Sales with UOM
- [ ] `src/app/actions/uom.ts` - UOM CRUD
- [ ] `src/app/settings/inventory/uoms/page.tsx` - UI
- [ ] `src/lib/seed-uom.ts` - Seed script
