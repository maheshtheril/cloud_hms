# How Appointment to Billing Integration Works

## Quick Summary

When you click "Bill This Visit" from an appointment card, the system:

1. ✅ **Auto-selects the patient**
2. ✅ **Fetches consultation fees** from billing rules
3. ✅ **Adds appointment services** (procedures, consultations)
4. ✅ **Includes lab tests** ordered during the appointment
5. ✅ **Pre-fills all line items** in the invoice

## Step-by-Step Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│ Step 1: User Views Appointment                                      │
│ URL: /hms/appointments/abc-123                                      │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────┐      │
│  │ Patient: John Doe                                         │      │
│  │ Doctor: Dr. Smith                                         │      │
│  │ Date: 2025-12-20 10:00 AM                                │      │
│  │                                                           │      │
│  │ [Bill This Visit] ← User clicks this button              │      │
│  └──────────────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│ Step 2: Navigate to Billing Page with Parameters                    │
│ URL: /hms/billing/new?patientId=patient-456&appointmentId=abc-123  │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│ Step 3: InvoiceEditor Component Loads                               │
│                                                                      │
│  useEffect(() => {                                                  │
│    const patientId = searchParams.get('patientId')                 │
│    const appointmentId = searchParams.get('appointmentId')         │
│                                                                      │
│    // Auto-select patient                                          │
│    setSelectedPatientId(patientId)                                 │
│                                                                      │
│    // Fetch appointment data                                       │
│    if (appointmentId) {                                            │
│      fetch(`/api/appointments/${appointmentId}`)                   │
│    }                                                                │
│  }, [])                                                             │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│ Step 4: API Fetches Appointment Details                             │
│ GET /api/appointments/abc-123                                       │
│                                                                      │
│  1. Query hms_appointments table                                   │
│  2. Query hms_appointment_services (procedures, fees)              │
│  3. Query hms_billing_rule (consultation fees)                     │
│  4. Query hms_lab_order + hms_lab_order_lines (lab tests)         │
│                                                                      │
│  Returns:                                                           │
│  {                                                                  │
│    consultation_fee: 500,                                          │
│    services: [{ description: "ECG", price: 200 }],                │
│    lab_tests: [{ test_name: "CBC", test_fee: 800 }]              │
│  }                                                                  │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│ Step 5: Invoice Auto-Populated                                      │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────┐      │
│  │ New Invoice                                               │      │
│  │ Patient: [John Doe] ← Auto-selected                      │      │
│  │ Date: 2025-12-20                                         │      │
│  │                                                           │      │
│  │ Items:                                                    │      │
│  │ ┌────────────────┬─────┬────────┬────────┐              │      │
│  │ │ Consultation   │  1  │  500   │  500   │              │      │
│  │ │ ECG            │  1  │  200   │  200   │              │      │
│  │ │ CBC Blood Test │  1  │  800   │  800   │              │      │
│  │ └────────────────┴─────┴────────┴────────┘              │      │
│  │                                                           │      │
│  │ Subtotal:                           ₹1,500               │      │
│  │ Tax (18%):                          ₹270                 │      │
│  │ Total:                              ₹1,770               │      │
│  │                                                           │      │
│  │ [Save Draft]  [Post Invoice]                            │      │
│  └──────────────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────────────┘
```

## Database Tables Involved

### 1. **hms_appointments**
Stores appointment basic info (patient, doctor, time, status)

### 2. **hms_appointment_services**
Links services/procedures to appointments with prices
```sql
┌─────────────────┬───────────────┬────────────┬─────────────┐
│ appointment_id  │ service_id    │ qty        │ unit_price  │
├─────────────────┼───────────────┼────────────┼─────────────┤
│ abc-123         │ service-001   │ 1          │ 200.00      │
└─────────────────┴───────────────┴────────────┴─────────────┘
```

### 3. **hms_billing_rule**
Defines consultation fees per doctor/department
```sql
┌───────────────┬──────────────────┬──────────────┬─────────┐
│ applies_to    │ applies_to_id    │ billing_code │ price   │
├───────────────┼──────────────────┼──────────────┼─────────┤
│ clinician     │ doctor-smith-123 │ CONSULT      │ 500.00  │
│ department    │ dept-cardio-456  │ CONSULT      │ 600.00  │
└───────────────┴──────────────────┴──────────────┴─────────┘
```

### 4. **hms_lab_order** + **hms_lab_order_lines**
Lab tests ordered for the patient (linked by patient_id and time range)
```sql
hms_lab_order:
┌─────────────┬──────────────┬─────────────────────┐
│ id          │ patient_id   │ ordered_at          │
├─────────────┼──────────────┼─────────────────────┤
│ order-789   │ patient-456  │ 2025-12-20 10:15:00 │
└─────────────┴──────────────┴─────────────────────┘

hms_lab_order_lines:
┌─────────────┬──────────┬────────────────┬─────────┐
│ order_id    │ test_id  │ requested_name │ price   │
├─────────────┼──────────┼────────────────┼─────────┤
│ order-789   │ test-cbc │ CBC Blood Test │ 800.00  │
└─────────────┴──────────┴────────────────┴─────────┘
```

## Key Code Locations

### 1. Appointment Card Button
**File:** `src/app/hms/appointments/[id]/page.tsx`
```tsx
<Link href={`/hms/billing/new?patientId=${appointment.patient_id}&appointmentId=${appointment.id}`}>
  Bill This Visit
</Link>
```

### 2. Billing Page (Invoice Editor)
**File:** `src/components/billing/invoice-editor.tsx`
```tsx
// Lines 74-132: Auto-load appointment data
useEffect(() => {
  if (urlAppointmentId) {
    const loadAppointmentData = async () => {
      const res = await fetch(`/api/appointments/${urlAppointmentId}`)
      const data = await res.json()
      // ... auto-add line items
    }
    loadAppointmentData()
  }
}, [urlAppointmentId])
```

### 3. API Endpoint
**File:** `src/app/api/appointments/[appointmentId]/route.ts`
```tsx
export async function GET(request, { params }) {
  // Fetch appointment
  // Fetch services
  // Fetch consultation fees
  // Fetch lab tests
  // Return combined data
}
```

## What's Currently Working

✅ URL parameter passing from appointment card
✅ Patient auto-selection in billing form
✅ API endpoint to fetch appointment details
✅ Database queries for services, billing rules, lab tests
✅ Auto-population of invoice line items
✅ Tax calculation and totals

## Testing the Feature

### 1. Create Test Data
```sql
-- Add a billing rule for consultation fee
INSERT INTO hms_billing_rule (tenant_id, company_id, applies_to, applies_to_id, billing_code, price)
VALUES ('your-tenant-id', 'your-company-id', 'clinician', 'doctor-id', 'CONSULT', 500.00);

-- Add appointment services
INSERT INTO hms_appointment_services (tenant_id, appointment_id, qty, unit_price, notes)
VALUES ('your-tenant-id', 'appointment-id', 1, 200.00, 'ECG Test');
```

### 2. Navigate to Appointment
```
/hms/appointments/[appointment-id]
```

### 3. Click "Bill This Visit"
The billing page should open with:
- Patient pre-selected
- Consultation fee added
- Services added
- Lab tests added (if any)

### 4. Verify Console Logs
Check browser console for:
```
📋 Appointment billing data fetched: {
  appointmentId: "...",
  consultationFee: 500,
  servicesCount: 2,
  labTestsCount: 1
}

✅ Auto-added appointment fee & lab tests: 3 items
```

## Common Issues & Solutions

### Issue: Patient not auto-selected
**Cause:** Wrong parameter name in URL
**Fix:** Use `patientId` not `patient_id`

### Issue: No consultation fee
**Cause:** No billing rule for the clinician/department
**Fix:** Add a billing rule:
```sql
INSERT INTO hms_billing_rule (applies_to, applies_to_id, price)
VALUES ('clinician', 'doctor-id', 500.00);
```

### Issue: Lab tests not showing
**Cause:** Lab orders not linked to appointment time
**Fix:** Ensure lab orders are created within 24 hours of appointment

### Issue: Services not appearing
**Cause:** No services added to the appointment
**Fix:** Add services to `hms_appointment_services` table

## Future Enhancements

🔮 **Direct appointment_id link in lab orders** (instead of time-based matching)
🔮 **Service catalog** for quick service selection during appointments
🔮 **Automatic billing rules** based on appointment type
🔮 **Package pricing** for common consultation + test combinations
🔮 **Insurance integration** to auto-apply coverage
