# Appointment to Billing Integration Guide

## Overview
This guide explains how to fetch and auto-fill bill details from a patient's appointment card when creating a new bill/invoice.

## Current Implementation

### 1. **URL Parameters Flow**
When navigating from an appointment to the billing page, you can pass the following URL parameters:

```typescript
/hms/billing/new?patientId={patientId}&appointmentId={appointmentId}
```

**Example Link from Appointment Card:**
```tsx
<Link href={`/hms/billing/new?patient_id=${appointment.patient_id}&appointmentId=${appointment.id}`}>
  Bill This Visit
</Link>
```

### 2. **What Gets Auto-Filled**

The `InvoiceEditor` component automatically:

1. **Selects the patient** based on `patientId` URL parameter
2. **Fetches appointment data** from `/api/appointments/[appointmentId]`
3. **Auto-adds line items** for:
   - Consultation fee (if available)
   - Lab tests ordered (with test names and fees)
   - Services attached to the appointment

### 3. **Data Sources**

#### From `hms_appointments` table:
- Patient ID
- Clinician ID
- Appointment type and mode
- Status and notes

#### From `hms_appointment_services` table:
- Service charges
- Quantities and prices
- Service descriptions

#### From `hms_billing_rule` table:
- Consultation fees based on clinician/department
- Service pricing rules

## How to Implement

### Step 1: Update Appointment Card Component

Add a "Create Bill" button that passes the appointment ID:

```tsx
// In your appointment card component
<Link 
  href={`/hms/billing/new?patient_id=${appointment.patient_id}&appointmentId=${appointment.id}`}
  className="btn btn-primary"
>
  <IndianRupee className="h-4 w-4" />
  Create Bill
</Link>
```

### Step 2: API Endpoint Structure

The API endpoint `/api/appointments/[appointmentId]/route.ts` should return:

```typescript
{
  success: true,
  appointment: {
    id: string,
    patient_id: string,
    clinician_id: string,
    consultation_fee: number,  // From billing rules
    lab_tests: [
      {
        id: string,
        test_name: string,
        test_fee: number
      }
    ],
    services: [
      {
        id: string,
        service_name: string,
        qty: number,
        unit_price: number,
        total_price: number
      }
    ]
  }
}
```

### Step 3: Billing Page Auto-Fill Logic

The `InvoiceEditor` component (already implemented) handles:

1. **Reading URL parameters**:
```typescript
const urlPatientId = searchParams.get('patientId')
const urlAppointmentId = searchParams.get('appointmentId')
```

2. **Fetching appointment data**:
```typescript
useEffect(() => {
  if (urlAppointmentId) {
    const res = await fetch(`/api/appointments/${urlAppointmentId}`)
    const data = await res.json()
    
    if (data.success) {
      // Auto-add consultation fee
      // Auto-add lab tests
      // Auto-add services
    }
  }
}, [urlAppointmentId])
```

3. **Creating invoice lines**:
```typescript
const appointmentLines = [
  {
    id: Date.now(),
    product_id: '',
    description: 'Consultation Fee',
    quantity: 1,
    unit_price: appointment.consultation_fee,
    uom: 'Service',
    tax_rate_id: defaultTaxId,
    tax_amount: 0,
    discount_amount: 0
  },
  // ... lab tests
  // ... services
]
```

## Database Schema Reference

### Key Tables

1. **`hms_appointments`** - Main appointment data
2. **`hms_appointment_services`** - Services linked to appointments
3. **`hms_billing_rule`** - Pricing rules for consultations
4. **`hms_lab_order`** & **`hms_lab_order_lines`** - Lab tests ordered

### Consultation Fee Logic

Consultation fees can be determined by:

1. **Direct pricing** in `hms_billing_rule` where:
   - `applies_to = 'clinician'` and `applies_to_id = clinician_id`
   - Or `applies_to = 'department'` and `applies_to_id = department_id`

2. **Default pricing** from `hms_appointment_services` table

3. **Fallback** to a global consultation fee setting

## Example: Complete Flow

### 1. User clicks "Bill This Visit" on appointment card
```
URL: /hms/appointments/abc-123
Button: href="/hms/billing/new?patient_id=patient-456&appointmentId=abc-123"
```

### 2. Billing page loads
```
- InvoiceEditor reads URL params
- Fetches appointment details from API
- Auto-selects patient
- Auto-fills line items
```

### 3. API Response Structure
```json
{
  "success": true,
  "appointment": {
    "id": "abc-123",
    "patient_id": "patient-456",
    "consultation_fee": 500.00,
    "services": [
      {
        "id": "svc-1",
        "description": "General Consultation",
        "qty": 1,
        "unit_price": 500.00
      }
    ],
    "lab_tests": [
      {
        "id": "test-1",
        "test_name": "CBC",
        "test_fee": 800.00
      }
    ]
  }
}
```

### 4. Invoice Auto-Generated
```
Items:
1. General Consultation     Qty: 1    Price: ₹500.00
2. CBC (Lab Test)           Qty: 1    Price: ₹800.00
-------------------------------------------
Subtotal:                              ₹1,300.00
Tax (18%):                             ₹234.00
Total:                                 ₹1,534.00
```

## Current Status

✅ **Already Implemented:**
- URL parameter handling in InvoiceEditor
- Auto-patient selection
- API endpoint structure
- Auto-fill logic for medicines (from prescriptions)
- Auto-fill logic for appointment charges (framework ready)

⚠️ **Needs Implementation:**
- Update `/api/appointments/[appointmentId]/route.ts` to fetch real data
- Query `hms_appointment_services` table
- Query `hms_billing_rule` for consultation fees
- Link lab orders to appointments
- Handle multiple payment methods

## Next Steps

1. **Update the API endpoint** to query real appointment data
2. **Add billing rules** for clinicians/departments
3. **Link services to appointments** when scheduling
4. **Test the complete flow** from appointment → billing
5. **Add validation** for missing fees/services

## Quick Fix for Immediate Use

Update the appointment card button to use the correct parameter names:

```tsx
// OLD - Not working properly
href={`/hms/billing/new?patient_id=${appointment.patient_id}`}

// NEW - Works with auto-fill
href={`/hms/billing/new?patientId=${appointment.patient_id}&appointmentId=${appointment.id}`}
```

**Note:** The parameter is `patientId` (camelCase), not `patient_id` (snake_case)!
