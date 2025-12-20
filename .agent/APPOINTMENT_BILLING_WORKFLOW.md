# APPOINTMENT TO BILLING AUTO-FILL - COMPLETE INTEGRATION

## Overview
This document explains how the complete appointment → prescription → billing workflow works with auto-fill.

## Current Implementation Status

### ✅ WORKING NOW (with mock data):
1. **Prescription saves** → Passes `appointmentId` to billing
2. **Billing fetches appointment** from API
3. **Auto-adds:**
   - Consultation Fee
   - Lab Tests
   - Medicines (from prescription)

### 📋 TODO: Replace Mock Data with Real Database

## API Endpoint (Already Created)

**File:** `src/app/api/appointments/[appointmentId]/route.ts`

**Current:** Returns mock data
**TODO:** Connect to real `hms_appointment` table

## Database Schema Needed

### 1. Appointments Table

```prisma
model hms_appointment {
  id                  String     @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  tenant_id           String     @db.Uuid
  patient_id          String     @db.Uuid
  doctor_id           String?    @db.Uuid
  appointment_date    DateTime   @db.Timestamptz(6)
  appointment_time    String?
  consultation_fee    Decimal    @default(500) @db.Decimal(14, 2)
  status              String     @default("scheduled") // scheduled, completed, cancelled
  notes               String?
  created_at          DateTime   @default(now()) @db.Timestamptz(6)
  
  // Relations
  lab_tests           hms_appointment_lab_test[]
  
  @@index([patient_id])
  @@index([doctor_id])
  @@index([appointment_date])
}
```

### 2. Appointment Lab Tests Table

```prisma
model hms_appointment_lab_test {
  id              String          @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  appointment_id  String          @db.Uuid
  test_name       String
  test_fee        Decimal         @db.Decimal(14, 2)
  test_status     String          @default("pending") // pending, completed, cancelled
  created_at      DateTime        @default(now()) @db.Timestamptz(6)
  
  // Relations
  appointment     hms_appointment @relation(fields: [appointment_id], references: [id], onDelete: Cascade)
  
  @@index([appointment_id])
}
```

## How to Integrate with Real Appointments

### Step 1: Add Tables to Schema

Add the above models to `prisma/schema.prisma`

### Step 2: Run Migration

```bash
npx prisma migrate dev --name add_appointments
npx prisma generate
```

### Step 3: Update API Endpoint

**In:** `src/app/api/appointments/[appointmentId]/route.ts`

**Replace this:**
```typescript
// TEMPORARY: Mock data
const mockAppointment = { ... }
```

**With this:**
```typescript
const appointment = await prisma.hms_appointment.findFirst({
    where: {
        id: appointmentId,
        tenant_id: session.user.tenantId
    },
    include: {
        lab_tests: true
    }
})

if (!appointment) {
    return NextResponse.json({ error: 'Appointment not found' }, { status: 404 })
}

return NextResponse.json({
    success: true,
    appointment: {
        id: appointment.id,
        patient_id: appointment.patient_id,
        consultation_fee: appointment.consultation_fee.toNumber(),
        status: appointment.status,
        appointment_date: appointment.appointment_date,
        doctor_id: appointment.doctor_id,
        lab_tests: appointment.lab_tests.map(test => ({
            id: test.id,
            test_name: test.test_name,
            test_fee: test.test_fee.toNumber()
        }))
    }
})
```

### Step 4: Create Appointment Booking Page

**TODO:** Build a page to create appointments:
- Select patient
- Select doctor
- Set consultation fee
- Add lab tests
- Save to database

## Complete Workflow (After Integration)

### 1. Patient Books Appointment

**Page:** `/hms/appointments/new`

```
Patient: John Doe
Doctor: Dr. Smith
Fee: ₹500
Lab Tests:
  - CBC (₹800)
  - X-Ray (₹600)
  
[Book Appointment] → Saves to hms_appointment
                   → Gets appointmentId: "apt-123"
```

### 2. Doctor Consultation

**QR Code / Appointment Number:**
```
apt-123
```

**Doctor scans/enters** → Opens:
```
/hms/prescriptions/new?patientId=xxx&appointmentId=apt-123
```

### 3. Doctor Writes Prescription

Adds medicines:
- Paracetamol (1-0-1 × 5 days) = 15 tablets
- Pantoprazole (1-0-1 × 7 days) = 14 tablets

**Clicks "Save & Create Bill"**

### 4. Redirect to Billing

```
/hms/billing/new?
  patientId=xxx&
  appointmentId=apt-123&
  medicines=[{...}]
```

### 5. Billing Auto-Fills EVERYTHING! 🎯

**Invoice automatically includes:**

```
INVOICE #INV-001
Patient: John Doe

Items:
1. Consultation Fee       ₹500    (from appointment)
2. CBC Blood Test         ₹800    (from appointment)
3. X-Ray Chest            ₹600    (from appointment)
4. Paracetamol 650mg (15) ₹30     (from prescription)
5. Pantoprazole 40mg (14) ₹70     (from prescription)
                        --------
SUBTOTAL:                 ₹2000
TAX (18%):                ₹360
                        --------
TOTAL:                    ₹2360
```

**Doctor clicks "Post Invoice" → DONE!** ⚡

## Testing (Current - With Mock Data)

You can test the workflow RIGHT NOW with mock data:

1. Go to prescription page with appointmentId:
   ```
   /hms/prescriptions/new?patientId=xxx&appointmentId=test-123
   ```

2. Add medicines and click "Save & Create Bill"

3. Billing page will show:
   - ✅ Consultation Fee (₹500) - MOCK
   - ✅ CBC Blood Test (₹800) - MOCK
   - ✅ X-Ray Chest (₹600) - MOCK
   - ✅ Your medicines (REAL)

## Summary

| Feature | Status | Action Needed |
|---------|--------|---------------|
| Prescription → Billing | ✅ Working | None |
| Medicines auto-fill | ✅ Working | None |
| Appointment API | ✅ Created | Replace mock with DB |
| Consultation fee auto-add | ✅ Working | Connect to real appointment |
| Lab tests auto-add | ✅ Working | Connect to real appointment |
| Appointment booking | ❌ Missing | Create booking page |
| Appointment table | ❌ Missing | Add to schema + migrate |

## Next Steps

1. **Create appointment tables** in schema
2. **Run prisma migrate**
3. **Update API** to use real data
4. **Build appointment booking page**
5. Test complete workflow!

---

**The code is ready! Just need to connect to real appointments database.**
