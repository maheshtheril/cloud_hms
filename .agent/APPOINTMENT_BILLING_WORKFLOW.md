# COMPLETE APPOINTMENT → PRESCRIPTION → BILLING WORKFLOW

## Overview
This document explains the complete patient journey from appointment booking to final billing.

## Workflow Steps

### 1. APPOINTMENT BOOKING
Patient books appointment with:
- Consultation fee
- Optional lab tests
- Gets **Appointment Number** or **QR Code**

```
Example: APT-2024-001
```

### 2. DOCTOR CONSULTATION
Doctor receives patient by:
- **Scanning QR code**, OR
- **Entering appointment number**, OR
- **Searching patient name/phone**

Opens prescription page:
```
/hms/prescriptions/new?patientId=xxx&appointmentId=xxx
```

### 3. PRESCRIPTION WRITING
Doctor:
1. Writes vitals, diagnosis, complaint, etc. (handwriting or typed)
2. Searches and adds medicines via modal
3. Configures dosage, days, timing for each medicine

### 4. SAVE & CREATE BILL
Doctor clicks **"💊 Save & Create Bill"** button

**Backend Process:**
1. Saves prescription to database
2. Saves all medicine items
3. Calculates medicine quantities:
   - Dosage: 1-1-1 = 3 tablets/day
   - Days: 5 days
   - Total: 15 tablets
4. Returns medicine list with prices

**Redirect to Billing:**
```
/hms/billing/new?patientId=xxx&appointmentId=xxx&medicines=[...]
```

### 5. AUTO-FILLED BILLING PAGE
Billing page receives:
- `patientId` - Patient information
- `appointmentId` - Links to appointment
- `medicines` - Already calculated quantities and prices

**Billing page should fetch and auto-add:**

#### A. Consultation Fee (From Appointment)
```javascript
const appointment = await fetch(`/api/appointments/${appointmentId}`)
// Add: Consultation Fee - ₹500
```

#### B. Lab Tests/Fees (If ordered in appointment)
```javascript
const labTests = await fetch(`/api/appointments/${appointmentId}/lab-tests`)
// Add: CBC Test - ₹800
// Add: X-Ray - ₹1200
```

#### C. Medicines (Already passed from prescription)
```javascript
// Already in URL params
medicines = [
  { id: 'med1', name: 'Paracetamol 650mg', quantity: 15, price: 2 },
  { id: 'med2', name: 'Pantoprazole 40mg', quantity: 14, price: 5 }
]
```

### 6. FINAL BILL
Auto-generated bill includes:
```
1. Consultation Fee         ₹500
2. CBC Test                 ₹800
3. X-Ray                    ₹1200
4. Paracetamol 650mg (15)   ₹30
5. Pantoprazole 40mg (14)   ₹70
                    ---------------
   TOTAL:                   ₹2600
```

Doctor just clicks **"Generate Invoice"**!

## URL Parameters

### Prescription Page
```
/hms/prescriptions/new?patientId=xxx&appointmentId=xxx
```
- `patientId` - Required for patient info
- `appointmentId` - Optional, links to appointment for billing

### Billing Page
```
/hms/billing/new?patientId=xxx&appointmentId=xxx&medicines=[...]
```
- `patientId` - Patient info
- `appointmentId` - Fetch consultation fee & lab tests
- `medicines` - Pre-calculated medicine list (JSON encoded)

## Database Tables Involved

### 1. `appointments`
- id
- patient_id
- consultation_fee
- status
- appointment_date

### 2. `appointment_lab_tests` (if exists)
- id
- appointment_id
- test_name
- test_fee

### 3. `prescription`
- id
- patient_id
- vitals, diagnosis, complaint, examination, plan
- created_at

### 4. `prescription_items`
- id
- prescription_id
- medicine_id
- morning, afternoon, evening, night
- days

### 5. `hms_product` (medicines)
- id
- name
- sku
- sale_price

## Time Savings
- ⚡ **Before:** 10-15 minutes per patient (manual entry)
- ⚡ **After:** 30 seconds (just click generate)
- 🎯 **Saved:** ~90% time on billing

## Implementation Checklist

### ✅ Already Implemented
- Prescription page with modal medicine selection
- Save prescription to database
- Calculate medicine quantities
- Pass medicines to billing page

### 📋 TODO (Billing Page)
- [ ] Fetch appointment by appointmentId
- [ ] Extract consultation_fee from appointment
- [ ] Fetch lab tests linked to appointment
- [ ] Auto-add all items to billing form
- [ ] Pre-fill patient info
- [ ] Support both "from prescription" and "manual" billing

## Example Code for Billing Page

```typescript
// In billing page
useEffect(() => {
  const appointmentId = searchParams.get('appointmentId')
  const medicinesParam = searchParams.get('medicines')
  
  if (appointmentId) {
    // Fetch appointment
    fetch(`/api/appointments/${appointmentId}`)
      .then(res => res.json())
      .then(appointment => {
        // Add consultation fee
        addItem({
          name: 'Consultation Fee',
          type: 'service',
          price: appointment.consultation_fee,
          quantity: 1
        })
        
        // Add lab tests if any
        if (appointment.lab_tests) {
          appointment.lab_tests.forEach(test => {
            addItem({
              name: test.test_name,
              type: 'lab_test',
              price: test.test_fee,
              quantity: 1
            })
          })
        }
      })
  }
  
  if (medicinesParam) {
    // Add medicines
    const medicines = JSON.parse(decodeURIComponent(medicinesParam))
    medicines.forEach(med => {
      addItem({
        name: med.name,
        type: 'medicine',
        price: med.price,
        quantity: med.quantity
      })
    })
  }
}, [appointmentId, medicinesParam])
```

## QR Code Integration (Future)
Generate QR code for appointment containing:
```
APT-2024-001|PatientID|AppointmentID
```

Doctor scans → Auto-opens prescription with all IDs pre-filled!

---
**Status:** Prescription side complete ✅
**Next:** Implement billing page auto-fill from appointmentId
