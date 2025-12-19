# ADDING NON-STOCK SERVICES TO BILLING

## Overview
For single consolidated billing, we need to support both:
1. **Stock Items** (Medicines) - tracked in inventory
2. **Services/Fees** (Consultation, Lab Tests) - NOT tracked in inventory

## Solution: Use `hms_product` Table for Both

### Why?
- ✅ Billing system already uses `hms_product`
- ✅ Same tax rates, pricing logic
- ✅ Same search/selection UI
- ✅ Just need a flag to identify services

### Implementation

#### 1. Add Services as Products (Manual/Admin)

Create products with special category or flag:

```sql
-- Example: Add "Consultation Fee" as a service
INSERT INTO hms_product (
    id, 
    tenant_id, 
    company_id,
    sku,
    name,
    price,
    is_service, -- This flag indicates it's a service, not physical product
    track_inventory, -- FALSE for services
    is_active
) VALUES (
    gen_random_uuid(),
    'tenant-id',
    'company-id',
    'SRV-CONSULT',
    'Consultation Fee',
    500.00,
    true, -- It's a service
    false, -- Don't track inventory
    true
);
```

#### 2. Common Services to Add

**Medical Services:**
```
SKU: SRV-CONSULT      | Consultation Fee         | ₹500
SKU: SRV-FOLLOWUP     | Follow-up Visit          | ₹300
SKU: SRV-EMERGENCY    | Emergency Consultation   | ₹1000
```

**Lab Tests:**
```
SKU: LAB-CBC          | CBC Blood Test           | ₹800
SKU: LAB-XRAY         | X-Ray                    | ₹1200
SKU: LAB-MRI          | MRI Scan                 | ₹5000
SKU: LAB-CT           | CT Scan                  | ₹3000
SKU: LAB-ECG          | ECG Test                 | ₹300
SKU: LAB-ECHO         | Echocardiography         | ₹2000
SKU: LAB-URINE        | Urine Test               | ₹200
SKU: LAB-SUGAR        | Blood Sugar Test         | ₹150
```

**Procedures:**
```
SKU: PROC-INJ         | Injection                | ₹100
SKU: PROC-DRESS       | Wound Dressing           | ₹200
SKU: PROC-STITCH      | Suturing                 | ₹500
SKU: PROC-NEB         | Nebulization             | ₹150
SKU: PROC-IV          | IV Drip                  | ₹300
```

**Room/Bed Charges:**
```
SKU: ROOM-GEN         | General Ward (per day)   | ₹1500
SKU: ROOM-PRIV        | Private Room (per day)   | ₹3000
SKU: ROOM-ICU         | ICU (per day)            | ₹5000
```

#### 3. Service Categories

Create a category called "Services" or "Medical Services":

```sql
INSERT INTO hms_product_category (
    id,
    tenant_id,
    company_id,
    name,
    is_service_category
) VALUES (
    gen_random_uuid(),
    'tenant-id',
    'company-id',
    'Medical Services',
    true
);
```

Then link services to this category.

#### 4. In Billing Page

**Services appear in same search dropdown as medicines!**

Doctor/billing person searches:
- Types "con" → Shows "Consultation Fee"
- Types "cbc" → Shows "CBC Blood Test"
- Types "para" → Shows "Paracetamol 650mg"

All in **ONE SEARCH BOX**!

#### 5. Inventory Handling

For services (`is_service = true` or `track_inventory = false`):
- ❌ **Don't reduce stock** on sale
- ✅ Still create sale_line_item
- ✅ Still apply taxes
- ✅ Still show in invoice

For medicines (`is_service = false` and `track_inventory = true`):
- ✅ **Reduce stock** on sale
- ✅ Show "Out of Stock" warning
- ✅ Track batch/expiry

## Current System Already Supports This!

The `getBillableItems()` function in `billing.ts` already:
- ✅ Fetches all `hms_product` items
- ✅ Shows in search dropdown
- ✅ No filtering by `is_service`

**You just need to ADD services as products!**

## How to Add Services (Quick Method)

### Option 1: Via UI (Future)
Create a "Add Service Item" page in settings

### Option 2: Via Database (Now)
Run SQL to insert common services:

```sql
-- Consultation Fees
INSERT INTO hms_product (id, tenant_id, company_id, sku, name, price, is_service, track_inventory, is_active)
VALUES 
(gen_random_uuid(), :tenant_id, :company_id, 'SRV-CONSULT', 'Consultation Fee', 500, true, false, true),
(gen_random_uuid(), :tenant_id, :company_id, 'SRV-FOLLOWUP', 'Follow-up Visit', 300, true, false, true);

-- Lab Tests
INSERT INTO hms_product (id, tenant_id, company_id, sku, name, price, is_service, track_inventory, is_active)
VALUES 
(gen_random_uuid(), :tenant_id, :company_id, 'LAB-CBC', 'CBC Blood Test', 800, true, false, true),
(gen_random_uuid(), :tenant_id, :company_id, 'LAB-XRAY', 'X-Ray', 1200, true, false, true),
(gen_random_uuid(), :tenant_id, :company_id, 'LAB-ECG', 'ECG Test', 300, true, false, true);

-- Procedures
INSERT INTO hms_product (id, tenant_id, company_id, sku, name, price, is_service, track_inventory, is_active)
VALUES 
(gen_random_uuid(), :tenant_id, :company_id, 'PROC-INJ', 'Injection', 100, true, false, true),
(gen_random_uuid(), :tenant_id, :company_id, 'PROC-DRESS', 'Wound Dressing', 200, true, false, true);
```

## Testing

1. Add a service product (e.g., "Consultation Fee")
2. Go to billing page
3. Search for "consult"
4. It appears in dropdown!
5. Add to invoice
6. Generate bill → Works!

## Auto-Fill from Appointment

When `appointmentId` is passed to billing:

```javascript
// In billing page
useEffect(() => {
  if (appointmentId) {
    fetch(`/api/appointments/${appointmentId}`).then(res => {
      const appointment = res.json()
      
      // Auto-add consultation fee service
      addItem({
        id: 'srv-consult-id', // Service product ID
        name: 'Consultation Fee',
        price: 500,
        quantity: 1,
        isService: true
      })
    })
  }
}, [appointmentId])
```

## Summary

✅ **Already Supported** - No code changes needed!
✅ Just **add services as products** in database
✅ Use `is_service = true` or `track_inventory = false`
✅ They appear in same search as medicines
✅ Single consolidated bill works perfectly!

**Action Item:** Add common services to `hms_product` table
