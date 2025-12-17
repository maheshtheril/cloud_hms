# Sale Price Implementation During Purchase Entry

## Problem Statement
Currently, the purchase entry system only captures the **purchase price (cost)** but doesn't capture the **sale price**. This is a critical missing feature in major ERP systems, where businesses set selling prices during purchase to maintain healthy margins.

## Current State Analysis

### Existing Schema
1. **`hms_product` table** has:
   - `price` (Decimal) - Currently used as the sale price at product master level
   - `default_cost` (Decimal) - Default cost price

2. **`hms_product_batch` table** has:
   - `cost` (Decimal) - Purchase cost for specific batch
   - `mrp` (Decimal) - Maximum Retail Price
   - **Missing**: Sale price for the batch

3. **Purchase Receipt** captures:
   - Unit Price (purchase price)
   - MRP
   - Batch details
   - **Missing**: Sale price input

## Industry Best Practices (SAP, Oracle, Zoho, etc.)

Major ERP systems handle sale price during purchase in these ways:

### 1. **Direct Sale Price Entry**
   - User enters sale price directly for each line item
   - System validates: Sale Price > Purchase Price
   - Updates product master and/or batch-specific pricing

### 2. **Margin/Markup Calculation**
   - **Markup %**: Sale Price = Cost × (1 + Markup%)
   - **Margin %**: Sale Price = Cost ÷ (1 - Margin%)
   - Example: Cost = 100, Markup 20% → Sale = 120
   - Example: Cost = 100, Margin 20% → Sale = 125

### 3. **Price Level Management**
   - Multiple price levels (Wholesale, Retail, Corporate)
   - Each batch can have different prices for different customer types

### 4. **Auto-Update Options**
   - **Update Master**: Sale price updates the product master
   - **Batch-Specific**: Sale price only for this batch
   - **History Tracking**: All price changes recorded

## Recommended Implementation

### Phase 1: Core Sale Price Feature (Most Important)

#### A. Database Changes

**Option 1: Add to `hms_product_batch` (Recommended for HMS)**
```prisma
model hms_product_batch {
  // ... existing fields
  cost                     Decimal?    @db.Decimal(14, 4)  // Purchase cost
  sale_price               Decimal?    @db.Decimal(14, 2)  // ✅ NEW: Sale price for this batch
  mrp                      Decimal?    @db.Decimal(14, 2)  // Maximum Retail Price
  margin_percentage        Decimal?    @db.Decimal(5, 2)   // ✅ NEW: Calculated margin %
  markup_percentage        Decimal?    @db.Decimal(5, 2)   // ✅ NEW: Calculated markup %
}
```

**Migration Script:**
```sql
-- Add sale_price column
ALTER TABLE hms_product_batch 
ADD COLUMN sale_price DECIMAL(14,2),
ADD COLUMN margin_percentage DECIMAL(5,2),
ADD COLUMN markup_percentage DECIMAL(5,2);

-- Optionally, copy MRP to sale_price as initial value
UPDATE hms_product_batch 
SET sale_price = mrp 
WHERE sale_price IS NULL AND mrp IS NOT NULL;
```

#### B. UI Changes in Purchase Entry

**Add to Purchase Receipt Item Row:**
```typescript
type ReceiptItem = {
  // ... existing fields
  unitPrice: number;        // Purchase cost from supplier
  mrp?: number;             // Maximum Retail Price
  salePrice?: number;       // ✅ NEW: Sale price
  marginPct?: number;       // ✅ NEW: Auto-calculated margin %
  markupPct?: number;       // ✅ NEW: Auto-calculated markup %
  updateMaster?: boolean;   // ✅ NEW: Should update product master price?
}
```

**Table Columns (after MRP column):**
| Batch | Exp | MRP | **Sale Price** | **Margin %** | Qty | Price | Taxable |
|-------|-----|-----|----------------|--------------|-----|-------|---------|
| BT001 | 12/25 | 150 | **125** | **20%** | 10 | 100 | 1000 |

**Calculation Logic:**
```typescript
// When user enters Sale Price
const onSalePriceChange = (salePrice: number, cost: number) => {
  if (salePrice <= cost) {
    toast({ title: "Warning", description: "Sale price should be higher than cost!" });
  }
  
  // Calculate Margin % = ((Sale - Cost) / Sale) × 100
  const margin = ((salePrice - cost) / salePrice) * 100;
  
  // Calculate Markup % = ((Sale - Cost) / Cost) × 100
  const markup = ((salePrice - cost) / cost) * 100;
  
  setItem({ ...item, salePrice, marginPct: margin, markupPct: markup });
};

// When user enters Markup %
const onMarkupChange = (markupPct: number, cost: number) => {
  const salePrice = cost * (1 + markupPct / 100);
  const margin = ((salePrice - cost) / salePrice) * 100;
  setItem({ ...item, salePrice, marginPct: margin, markupPct });
};

// When user enters Margin %
const onMarginChange = (marginPct: number, cost: number) => {
  const salePrice = cost / (1 - marginPct / 100);
  const markup = ((salePrice - cost) / cost) * 100;
  setItem({ ...item, salePrice, marginPct, markupPct: markup });
};
```

#### C. Backend Changes

**Update `createPurchaseReceipt` action:**
```typescript
// In receipt.ts action
const batch = await tx.hms_product_batch.create({
  data: {
    // ... existing fields
    batch_no: item.batch,
    cost: item.unitPrice,
    mrp: item.mrp,
    sale_price: item.salePrice,          // ✅ NEW
    margin_percentage: item.marginPct,   // ✅ NEW
    markup_percentage: item.markupPct,   // ✅ NEW
  }
});

// If user wants to update product master
if (item.updateMaster) {
  await tx.hms_product.update({
    where: { id: item.productId },
    data: { 
      price: item.salePrice,              // Update master sale price
      default_cost: item.unitPrice        // Update master cost
    }
  });
}
```

### Phase 2: Advanced Features (Optional)

#### A. Price Validation Rules
```typescript
interface PriceValidationRules {
  minMargin?: number;           // Minimum margin % required
  maxDiscount?: number;         // Max discount % from MRP
  enforceMinMargin: boolean;    // Block if margin < minimum
  warnOnLowMargin: boolean;     // Warn but allow
}

// Example validation
if (rules.enforceMinMargin && marginPct < rules.minMargin) {
  throw new Error(`Margin must be at least ${rules.minMargin}%`);
}
```

#### B. Price History Tracking
```typescript
// Use existing hms_product_price_history table
await tx.hms_product_price_history.create({
  data: {
    product_id: item.productId,
    old_price: oldPrice,
    new_price: item.salePrice,
    changed_by: session.user.id,
    change_reason: "Purchase Receipt",
    reference_id: receipt.id
  }
});
```

#### C. Multiple Price Levels
```sql
-- New table for advanced pricing
CREATE TABLE hms_product_price_levels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  company_id UUID NOT NULL,
  product_id UUID REFERENCES hms_product(id),
  batch_id UUID REFERENCES hms_product_batch(id),
  price_level VARCHAR(50), -- 'RETAIL', 'WHOLESALE', 'CORPORATE'
  price DECIMAL(14,2) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## UI/UX Recommendations

### Smart Input Features

1. **Quick Margin Templates**
   ```
   [+10%] [+20%] [+30%] [+50%] [Custom]
   ```

2. **Color-Coded Margin Indicators**
   - Green: Margin > 20%
   - Yellow: Margin 10-20%
   - Red: Margin < 10%

3. **Bulk Update**
   ```
   [Apply 20% markup to all items]
   [Copy from previous purchase]
   ```

4. **Smart Defaults**
   - Auto-fill sale price from previous batch of same product
   - Suggest margin based on product category defaults

### Column Layout (Optimized)

**Compact View:**
| Item | Batch | Exp | Qty | **Cost** | **Sale** | **Margin** | Tax % | Total |
|------|-------|-----|-----|----------|----------|------------|-------|-------|

**Detailed View (Expandable Row):**
- MRP: 150
- Cost: 100
- Sale Price: 125 ← Editable
- Margin: 20% ← Editable (recalculates Sale)
- Markup: 25% ← Editable (recalculates Sale)
- [ ] Update product master price

## Implementation Steps

### Step 1: Database Migration
```bash
# Create migration file
npx prisma migrate dev --name add_sale_price_to_batch
```

### Step 2: Update TypeScript Types
- Update `ReceiptItem` type
- Update Prisma schema
- Regenerate Prisma client

### Step 3: Update UI Components
- Add Sale Price column to table
- Add Margin/Markup input fields
- Add calculation logic
- Add validation

### Step 4: Update Backend Actions
- Modify `createPurchaseReceipt`
- Modify `updatePurchaseReceipt`
- Add validation logic

### Step 5: Update Sales Module
- Ensure billing uses batch-specific sale price
- Fallback to product master price if batch price not set

## Testing Checklist

- [ ] Can enter sale price during purchase
- [ ] Margin % calculates correctly
- [ ] Markup % calculates correctly
- [ ] Validates sale price > cost price
- [ ] Batch-specific price saves correctly
- [ ] Product master updates when checkbox enabled
- [ ] Price history records changes
- [ ] Sales invoice uses correct batch price
- [ ] Reports show margin analysis

## Benefits

1. **Better Margin Control**: Real-time visibility of profit margins
2. **Faster Purchase Entry**: No need to update prices separately
3. **Batch-Specific Pricing**: Different batches can have different prices
4. **Price History**: Track all price changes over time
5. **Margin Analysis**: Reports showing margin by product/category
6. **Competitive Pricing**: Compare cost vs. sale price vs. MRP

## Migration Strategy for Existing Data

```sql
-- Option 1: Set sale price = MRP for all existing batches
UPDATE hms_product_batch 
SET sale_price = mrp 
WHERE sale_price IS NULL;

-- Option 2: Set sale price with 20% markup on cost
UPDATE hms_product_batch 
SET sale_price = ROUND(cost * 1.20, 2),
    markup_percentage = 20.00
WHERE sale_price IS NULL AND cost > 0;

-- Option 3: Copy from product master
UPDATE hms_product_batch b
SET sale_price = p.price
FROM hms_product p
WHERE b.product_id = p.id 
  AND b.sale_price IS NULL;
```

## Next Steps

Would you like me to:
1. ✅ **Implement the database migration?**
2. ✅ **Add the UI fields to purchase entry page?**
3. ✅ **Update the backend actions?**
4. ✅ **Add margin calculation logic?**
5. Create a price history report?
6. Add bulk update features?

Let me know which approach you prefer, and I'll proceed with the implementation!
