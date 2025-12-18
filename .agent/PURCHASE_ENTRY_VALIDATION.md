# Purchase Entry Validation Implementation

## Changes Made

Added comprehensive validation for purchase entry (purchase receipt) to ensure data integrity for sale price fields.

## Validation Rules

The following validation rules are now enforced for **both INSERT and UPDATE** operations:

### 1. Sale Price is Required
- **Rule**: Sale price must be provided and greater than 0
- **Error Message**: "Sale price is required for all items and must be greater than 0."
- **Location**: Applied to all items in purchase receipt

### 2. Sale Price Cannot Exceed MRP
- **Rule**: If MRP is provided, sale price must not be greater than MRP
- **Error Message**: "Sale price (X) cannot be greater than MRP (Y)."
- **Rationale**: Prevents selling items above Maximum Retail Price

### 3. Sale Price Cannot Be Less Than Net Cost
- **Rule**: If unit price (net cost) is provided, sale price must not be less than unit price
- **Error Message**: "Sale price (X) cannot be less than net cost/unit price (Y)."
- **Rationale**: Prevents selling items at a loss

## Implementation Details

### File Modified
- `c:\2035-HMS\SAAS_ERP\src\app\actions\receipt.ts`

### Functions Updated

#### 1. `createPurchaseReceipt()`
- **Lines**: 99-115
- **Validation Location**: Before database transaction
- **Action**: Validates all items before creating the purchase receipt

#### 2. `updatePurchaseReceipt()`
- **Lines**: 461-477
- **Validation Location**: Before database update
- **Action**: Validates all items before updating the purchase receipt
- **Additional Change**: Updated metadata storage to include `sale_price`, `margin_pct`, `markup_pct`, and `pricing_strategy` fields

## Validation Flow

```
User submits purchase entry
    ↓
Validate: Supplier & Items exist
    ↓
For each item:
    ↓
    1. Check: salePrice > 0?
       ↓ (No) → Return error
       ↓ (Yes) → Continue
    ↓
    2. Check: salePrice <= MRP? (if MRP provided)
       ↓ (No) → Return error
       ↓ (Yes) → Continue
    ↓
    3. Check: salePrice >= unitPrice? (if unitPrice provided)
       ↓ (No) → Return error
       ↓ (Yes) → Continue
    ↓
All validations pass
    ↓
Proceed with database operation
```

## Testing Recommendations

1. **Test Case 1: Missing Sale Price**
   - Submit purchase entry without sale price
   - Expected: Error message about required sale price

2. **Test Case 2: Sale Price > MRP**
   - Submit with salePrice = 150, mrp = 100
   - Expected: Error message about exceeding MRP

3. **Test Case 3: Sale Price < Net Cost**
   - Submit with salePrice = 50, unitPrice = 75
   - Expected: Error message about being below net cost

4. **Test Case 4: Valid Entry**
   - Submit with unitPrice = 80, salePrice = 95, mrp = 100
   - Expected: Success

5. **Test Case 5: Update Existing Entry**
   - Update existing entry with invalid sale price
   - Expected: Same validation rules apply

## Impact

- **User Experience**: Users will receive immediate feedback if they attempt to save invalid pricing
- **Data Integrity**: Ensures all purchase entries have valid pricing relationships
- **Business Logic**: Prevents accidental losses from selling below cost or above MRP compliance

## Notes

- Validation occurs on the server-side (Next.js server action)
- Client-side validation should also be implemented for better UX
- Error messages are clear and indicate the specific values that caused the validation failure
