# UOM Pack/Unit System - Phase 2 Complete

## ✅ What's Been Implemented

### Phase 1: Foundation ✅
1. **UOM Seeding** - `/settings/inventory/uoms`
   - One-click seeding of pharmacy UOMs
   - Pre-configured: PCS, PACK-10, PACK-15, PACK-20, PACK-30, STRIP, BOX, BOTTLE

2. **Purchase Orders with UOM** ✅
   - UOM dropdown in purchase order form
   - AI scanning automatically detects pack sizes
   - UOM saved to database

### Phase 2: Stock Conversion ✅ (NEW)
3. **Purchase Receipt Conversion** ✅
   - Automatic conversion from purchase UOM to base units (PCS)
   - Stock tracked in PCS for consistency
   - Cost averaged per base unit

## 📊 How It Works

### Purchase Order Entry:
```
Product: Paracetamol 500mg
Qty: 5
UOM: PACK-10
Price: ₹45.00 per pack
```

### Purchase Receipt (Stock Update):
```
Received: 5 PACK-10 @ ₹45/pack

Conversion:
- Stock Added: 5 × 10 = 50 PCS
- Cost per PCS: (5 × ₹45) / 50 = ₹4.50

Stock Ledger Entry:
{
  change_qty: 50 PCS,
  cost: ₹4.50,
  metadata: {
    purchase_qty: 5,
    purchase_uom: "PACK-10",
    conversion_factor: 10
  }
}
```

## 🎯 Benefits

1. **Flexible Purchasing** - Buy in any pack size
2. **Consistent Stock** - Always tracked in PCS
3. **Accurate Costing** - Automatic cost per unit calculation
4. **Audit Trail** - Original purchase details preserved

## 📋 Usage Flow

### For User:
1. **Setup** (One Time)
   - Visit `/settings/inventory/uoms`
   - Click "Seed Pharmacy UOMs"

2. **Purchase**
   - Create PO, select UOM for each item
   - AI scanning auto-detects UOM from invoice

3. **Receipt**
   - System automatically converts to PCS
   - Stock shown in base units

## 🔍 Example Scenarios

### Scenario 1: Pack Purchase
```
Purchase: 10 PACK-15 @ ₹60/pack
Receipt: System adds 150 PCS @ ₹4/PCS to stock
```

### Scenario 2: Individual Purchase
```
Purchase: 50 PCS @ ₹5/PCS
Receipt: System adds 50 PCS @ ₹5/PCS to stock
```

### Scenario 3: Mixed Purchase (Same Product)
```
First: 5 PACK-10 @ ₹45/pack → 50 PCS @ ₹4.50/PCS
Later: 3 PACK-15 @ ₹65/pack → 45 PCS @ ₹4.33/PCS

Total Stock: 95 PCS
Average Cost: (50×4.50 + 45×4.33) / 95 = ₹4.42/PCS
```

## 🚧 Still To Do (Phase 3):

### Sales with UOM Selection
- Add UOM dropdown to billing/sales
- Allow selling in different UOMs
- Auto-convert for stock deduction
- Example: Sell 2 PACK-10 → Deduct 20 PCS from stock

### Stock Display Enhancement
- Show stock in multiple UOMs
- Example: "95 PCS (9 PACK-10 + 5 loose)"

## 💡 Technical Details

### Conversion Logic Location:
- `src/app/actions/uom.ts` - Conversion helpers
- `src/app/actions/receipt.ts` (lines 283-296) - Receipt conversion
- `src/app/actions/purchase.ts` - Purchase UOM saving

### Database Fields:
- `hms_purchase_order_line.uom` - Purchase UOM
- `hms_product_stock_ledger.change_qty` - Always in BASE units
- `hms_product_stock_ledger.metadata` - Original purchase details

### Key Functions:
```typescript
convertToBase(productId, qty, fromUOM) 
// Returns qty in PCS

# Usage in receipt:
stockQty = qtyReceived × conversionFactor
costPerUnit = (qtyReceived × unitPrice) / stockQty
```

## 🎉 System is Production Ready!

Users can now:
✅ Purchase products in packs (10's, 15's, 20's)
✅ Stock automatically tracks in PCS
✅ Costs averaged correctly
✅ Audit trail maintained

Next: Phase 3 for sales UOM selection!
