# Prescription to Pharmacy Sales - Complete Guide

## Feature Overview

**Scenario:**
1. Doctor writes prescription with medicines for patient
2. Patient goes to pharmacy counter 
3. Pharmacy staff selects patient
4. Clicks "Load from Prescription" button
5. Medicines auto-fill into sale bill with calculated quantities

---

## How It Works

### **Step 1: Patient Selection**

Pharmacy staff opens `/hms/billing/new` and selects the patient from the dropdown.

### **Step 2: Load Prescription Button Appears**

Once patient is selected, a purple "Load from Prescription" button appears below the patient selector.

### **Step 3: Auto-Fill Magic**

When clicked:
1. Fetches patient's most recent prescription (last 30 days)
2. Calculates total medicine quantity based on dosage:
   ```
   Total Quantity = (Morning + Afternoon + Evening + Night) × Days
   
   Example:
   Medicine: Paracetamol 500mg
   Dosage: 1-0-1 (morning-afternoon-evening-night)
   Days: 5
   
   Total = (1 + 0 + 1 + 0) × 5 = 10 tablets
   ```
3. Auto-fills invoice lines with:
   - Medicine name
   - Calculated quantity
   - Unit price from product catalog
   - Description with dosage info

---

## API Endpoint

### **GET `/api/prescriptions/by-patient/[patientId]`**

**Request:**
```typescript
GET /api/prescriptions/by-patient/abc-123-patient-id
```

**Response:**
```json
{
  "success": true,
  "patient_id": "abc-123",
  "prescriptions": [
    {
      "prescription_id": "rx-456",
      "visit_date": "2025-12-19T10:00:00Z",
      "diagnosis": "Common Cold",
      "doctor_id": "doc-789",
      "medicines": [
        {
          "id": "med-001",
          "name": "Paracetamol 500mg",
          "category": "Analgesic",
          "morning": 1,
          "afternoon": 0,
          "evening": 1,
          "night": 0,
          "days": 5,
          "quantity": 10,
          "unit_price": 5.50,
          "description": "Paracetamol 500mg - 2x daily for 5 days"
        }
      ]
    }
  ],
  "latest": { /* Latest prescription object */ }
}
```

---

## Database Tables

### **prescription**
```sql
CREATE TABLE prescription (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id UUID NOT NULL,
  doctor_id UUID,
  visit_date TIMESTAMPTZ,
  diagnosis TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### **prescription_items**
```sql
CREATE TABLE prescription_items (
  id UUID PRIMARY KEY,
  prescription_id UUID REFERENCES prescription(id),
  medicine_id UUID REFERENCES hms_product(id),
  
  -- Dosage (doses per time of day)
  morning INT DEFAULT 0,
  afternoon INT DEFAULT 0,
  evening INT DEFAULT 0,
  night INT DEFAULT 0,
  days INT DEFAULT 3,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Code Flow

### **1. UI Component (invoice-editor.tsx)**

```typescript
const loadPrescriptionMedicines = async () => {
  if (!selectedPatientId) return

  const res = await fetch(`/api/prescriptions/by-patient/${selectedPatientId}`)
  const data = await res.json()

  if (data.latest && data.latest.medicines.length > 0) {
    // Convert medicines to invoice lines
    const medicineLines = data.latest.medicines.map(med => ({
      product_id: med.id,
      description: med.description,
      quantity: med.quantity,    // Auto-calculated!
      unit_price: med.unit_price
    }))

    setLines(medicineLines)
  }
}
```

**Button:**
```tsx
{selectedPatientId && (
  <button
    onClick={loadPrescriptionMedicines}
    className="bg-purple-600 text-white..."
  >
    <FileText /> Load from Prescription
  </button>
)}
```

### **2. API Handler (route.ts)**

```typescript
// Fetch prescriptions
const prescriptions = await prisma.prescription.findMany({
  where: {
    patient_id: patientId,
    created_at: { gte: last30Days }
  },
  include: {
    prescription_items: {
      include: { hms_product: true }
    }
  }
})

// Calculate quantities
medicines: prescription_items.map(item => ({
  quantity: (item.morning + item.afternoon + item.evening + item.night) * item.days
}))
```

---

## Usage Example

### **Scenario: Patient Visit**

1. **Doctor Visit (Morning)**
   ```
   Patient: John Doe
   Diagnosis: Viral Fever
   Prescription:
   - Paracetamol 500mg: 1-0-1-0 for 5 days
   - Vitamin C: 1-0-0-0 for 7 days
   - Cetirizine: 0-0-0-1 for 3 days
   ```

2. **Pharmacy Counter (Evening)**
   ```
   Pharmacist:
   1. Opens "/hms/billing/new"
   2. Selects "John Doe" from patient list
   3. Clicks "Load from Prescription"
   
   Result:
   ┌────────────────────┬─────┬────────┬────────┐
   │ Medicine           │ Qty │ Price  │ Total  │
   ├────────────────────┼─────┼────────┼────────┤
   │ Paracetamol 500mg  │ 10  │ 5.00   │ 50.00  │
   │ Vitamin C          │ 7   │ 3.00   │ 21.00  │
   │ Cetirizine         │ 3   │ 8.00   │ 24.00  │
   ├────────────────────┴─────┴────────┼────────┤
   │ Total                             │ 95.00  │
   └───────────────────────────────────┴────────┘
   ```

3. **Pharmacist reviews, adjusts if needed, and posts invoice**

---

## Quantities Calculation Logic

```typescript
function calculateMedicineQuantity(item) {
  // Doses per day
  const dosesPerDay = 
    item.morning +    // e.g., 1
    item.afternoon +  // e.g., 0
    item.evening +    // e.g., 1
    item.night        // e.g., 0
  // = 2 doses per day

  // Total doses
  const totalDoses = dosesPerDay * item.days
  // = 2 × 5 = 10 tablets

  return totalDoses
}
```

**Examples:**
| Dosage | Days | Calculation | Result |
|--------|------|-------------|--------|
| 1-0-1-0 | 5 | (1+0+1+0) × 5 | 10 |
| 1-1-1-1 | 3 | (1+1+1+1) × 3 | 12 |
| 2-0-0-1 | 7 | (2+0+0+1) × 7 | 21 |
| 1-0-0-0 | 10 | (1+0+0+0) × 10 | 10 |

---

## Features

✅ **Auto-Calculate Quantities** - No manual calculation needed
✅ **Recent Prescriptions** - Fetches last 30 days 
✅ **Smart Filtering** - Only active medicines shown
✅ **Dosage Description** - Shows "2x daily for 5 days"
✅ **One-Click Load** - Instant auto-fill
✅ **Price Pre-Filled** - From product catalog
✅ **Edit After Load** - Can adjust quantities/prices

---

## Troubleshooting

### **Issue: "No recent prescriptions found"**
**Cause:** Patient has no prescriptions in last 30 days
**Solution:** Create prescription first, or manually add items

### **Issue: Quantity showing as 0**
**Cause:** All dosage fields (morning/afternoon/evening/night) are 0
**Solution:** Check prescription has valid dosage

### **Issue: Medicine not appearing**
**Cause:** Medicine is marked as inactive
**Solution:** Activate the medicine in product catalog

### **Issue: Wrong price**
**Cause:** Price field not set in hms_product
**Solution:** Update product pricing

---

## Future Enhancements

🔮 **Multiple Prescriptions Selector** - Choose which prescription to load
🔮 **Partial Load** - Select individual medicines from prescription
🔮 **Insurance Claims** - Link to insurance for coverage
🔮 **Stock Check** - Warn if medicine out of stock
🔮 **Alternative Medicines** - Suggest alternatives if unavailable
🔮 **Prescription Status** - Mark as "dispensed" when billed

---

## Testing

### **Manual Test:**
```javascript
// In browser console
fetch('/api/prescriptions/by-patient/YOUR_PATIENT_ID')
  .then(r => r.json())
  .then(data => console.log(data))
```

### **Expected Output:**
```json
{
  "success": true,
  "patient_id": "...",
  "prescriptions": [...],
  "latest": {
    "prescription_id": "...",
    "medicines": [
      {
        "id": "...",
        "name": "Paracetamol 500mg",
        "quantity": 10,
        "unit_price": 5.50
      }
    ]
  }
}
```

---

## Summary

**You now have:**
1. ✅ API endpoint to fetch prescriptions by patient
2. ✅ Smart quantity calculation based on dosage
3. ✅ "Load from Prescription" button in billing form
4. ✅ One-click auto-fill for pharmacy sales

**Perfect for:**
- Pharmacy counters
- Hospital dispensaries  
- Outpatient pharmacy
- Quick bill generation

**The pharmacy staff just needs to:**
1. Select patient
2. Click button
3. Review & post invoice

That's it! 🎉
