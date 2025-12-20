# World-Class HMS Schema Improvements
## Based on Epic, Cerner, NHS, and HL7 FHIR Standards

---

## 🎯 CRITICAL ISSUES IN YOUR CURRENT SCHEMA

### ❌ **ISSUE #1: Missing Direct Links (Causing Your Billing Problem!)**

```
Current Flow (BROKEN):
Appointment → ??? → Lab Orders
            ↓
         Encounter (maybe)

Problem: No direct appointment_id in lab_order!
```

### ❌ **ISSUE #2: Weak Billing Rules**
```sql
-- Current (Too Simple)
hms_billing_rule {
  applies_to: String?     -- Just "clinician" or "department"
  applies_to_id: String?  -- Just an ID
  price: Decimal?         -- Single price only
}
```

**Problem:** 
- No time-based pricing (day vs night rates)
- No insurance handling
- No procedure codes (CPT/ICD)
- No package pricing

### ❌ **ISSUE #3: Invoice Has encounter_id But No appointment_id**
```sql
hms_invoice {
  encounter_id String?     -- Has this
  -- MISSING: appointment_id  ← Should have this!
}
```

---

## ✅ WORLD-CLASS SOLUTION: The Perfect Schema

### **1. Clinical Flow Chain (Epic/Cerner Model)**

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ Appointment │────▶│ Encounter   │────▶│ Orders      │────▶│ Invoice     │
│             │     │             │     │             │     │             │
│ - Scheduled │     │ - Visit     │     │ - Lab       │     │ - Charges   │
│ - Confirmed │     │ - Started   │     │ - Radiology │     │ - Payments  │
│             │     │ - Ended     │     │ - Pharmacy  │     │             │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
      ↓                    ↓                    ↓                   ↓
  appointment_id      encounter_id         order_id           invoice_id
```

**Key Principle:** Each step references the previous step(s)!

---

## 📋 RECOMMENDED SCHEMA CHANGES

### **CHANGE #1: Add Missing Links (CRITICAL)**

```prisma
// ✅ FIX: Add appointment_id to lab orders
model hms_lab_order {
  id             String   @id @default(dbgenerated("gen_random_uuid()"))
  tenant_id      String   @db.Uuid
  company_id     String   @db.Uuid
  
  // ✅ ADD THIS - Missing link!
  appointment_id String?  @db.Uuid  // ← NEW!
  encounter_id   String?  @db.Uuid  // Keep existing
  patient_id     String?  @db.Uuid
  
  ordered_at     DateTime @default(now())
  status         String   @default("requested")
  
  // Relations
  hms_appointment hms_appointments? @relation(fields: [appointment_id], references: [id])
  hms_encounter   hms_encounter?    @relation(fields: [encounter_id], references: [id])
  hms_patient     hms_patient?      @relation(fields: [patient_id], references: [id])
  
  @@index([appointment_id])
  @@index([encounter_id])
}

// ✅ FIX: Add appointment link to encounter
model hms_encounter {
  id             String    @id @default(dbgenerated("gen_random_uuid()"))
  tenant_id      String    @db.Uuid
  
  // ✅ ADD THIS
  appointment_id String?   @db.Uuid  // ← NEW! Link back to appointment
  
  patient_id     String    @db.Uuid
  started_at     DateTime  @default(now())
  ended_at       DateTime?
  
  // Relations
  hms_appointment hms_appointments? @relation(fields: [appointment_id], references: [id])
  
  @@index([appointment_id])
}

// ✅ FIX: Add appointment_id to invoice
model hms_invoice {
  id             String    @id @default(dbgenerated("gen_random_uuid()"))
  tenant_id      String    @db.Uuid
  
  // ✅ ADD THIS - Direct link to appointment
  appointment_id String?   @db.Uuid  // ← NEW!
  encounter_id   String?   @db.Uuid  // Keep existing
  patient_id     String?   @db.Uuid
  
  // Relations
  hms_appointment hms_appointments? @relation(fields: [appointment_id], references: [id])
  
  @@index([appointment_id])
}
```

---

### **CHANGE #2: Better Billing Rules (Epic/Cerner Standard)**

```prisma
// ❌ OLD: Too simple
model hms_billing_rule {
  applies_to    String?
  applies_to_id String?
  price         Decimal?
}

// ✅ NEW: Industry standard
model hms_service_catalog {
  id                String   @id @default(dbgenerated("gen_random_uuid()"))
  tenant_id         String   @db.Uuid
  company_id        String   @db.Uuid
  
  // Service Info
  code              String   // Internal code
  cpt_code          String?  // CPT code (US standard)
  icd_code          String?  // ICD-10 code
  service_name      String
  service_category  String   // consultation, lab, radiology, procedure
  
  // Pricing (Multi-tier)
  base_price        Decimal  @db.Decimal(18, 2)
  insurance_price   Decimal? @db.Decimal(18, 2)
  cash_price        Decimal? @db.Decimal(18, 2)
  
  // Time-based pricing
  day_rate          Decimal? @db.Decimal(18, 2)  // Mon-Fri 9-5
  night_rate        Decimal? @db.Decimal(18, 2)  // After hours
  weekend_rate      Decimal? @db.Decimal(18, 2)
  
  // Department/Clinician pricing
  department_id     String?  @db.Uuid
  clinician_id      String?  @db.Uuid
  
  // Billing details
  billable          Boolean  @default(true)
  requires_auth     Boolean  @default(false)  // Pre-authorization needed
  
  // Metadata
  duration_minutes  Int?     // Expected duration
  instructions      String?
  is_active         Boolean  @default(true)
  
  created_at        DateTime @default(now())
  
  @@unique([tenant_id, company_id, code])
  @@index([cpt_code])
  @@index([department_id])
  @@index([clinician_id])
}

// ✅ Service Packages (Bundle pricing)
model hms_service_package {
  id           String   @id @default(dbgenerated("gen_random_uuid()"))
  tenant_id    String   @db.Uuid
  name         String   // e.g., "Annual Checkup Package"
  price        Decimal  @db.Decimal(18, 2)
  discount_pct Decimal? @db.Decimal(5, 2)
  
  // Package contents
  services     Json     // Array of service_ids
  
  is_active    Boolean  @default(true)
}
```

---

### **CHANGE #3: Unified Order System (HL7 FHIR Standard)**

```prisma
// ✅ Universal order table (Epic/Cerner approach)
model hms_clinical_order {
  id               String   @id @default(dbgenerated("gen_random_uuid()"))
  tenant_id        String   @db.Uuid
  company_id       String   @db.Uuid
  
  // Links
  appointment_id   String   @db.Uuid  // ← Direct link!
  encounter_id     String?  @db.Uuid
  patient_id       String   @db.Uuid
  
  // Order details
  order_number     String   @unique
  order_type       String   // "lab", "radiology", "pharmacy", "procedure"
  order_category   String?  // "diagnostic", "therapeutic"
  
  // Ordering info
  ordered_by       String   @db.Uuid  // Clinician
  ordered_at       DateTime @default(now())
  
  // Status workflow
  status           String   @default("ordered")  // ordered → scheduled → in_progress → completed → cancelled
  priority         String   @default("routine")  // stat, urgent, routine
  
  // Execution
  scheduled_for    DateTime?
  started_at       DateTime?
  completed_at     DateTime?
  completed_by     String?  @db.Uuid
  
  // Results
  result_status    String?  // preliminary, final, corrected
  result_data      Json?    // Flexible storage
  
  // Billing
  service_code     String?  // Links to service catalog
  estimated_cost   Decimal? @db.Decimal(18, 2)
  actual_cost      Decimal? @db.Decimal(18, 2)
  billable         Boolean  @default(true)
  
  // Relations
  hms_appointment  hms_appointments @relation(fields: [appointment_id], references: [id])
  
  // Audit
  created_at       DateTime @default(now())
  updated_at       DateTime @updatedAt
  
  @@index([appointment_id])
  @@index([patient_id])
  @@index([order_type, status])
  @@index([ordered_at])
}

// ✅ Order details (for complex orders)
model hms_clinical_order_detail {
  id           String   @id @default(dbgenerated("gen_random_uuid()"))
  tenant_id    String   @db.Uuid
  order_id     String   @db.Uuid
  
  // Test/Service details
  test_code    String?  // Lab test code, etc.
  test_name    String
  quantity     Decimal  @default(1) @db.Decimal(10, 2)
  unit_price   Decimal  @db.Decimal(18, 2)
  
  // Results (for lab tests)
  result_value String?
  result_unit  String?
  reference_range String?
  abnormal     Boolean? @default(false)
  
  // Billing
  billable     Boolean  @default(true)
  
  hms_clinical_order hms_clinical_order @relation(fields: [order_id], references: [id])
  
  @@index([order_id])
}
```

---

### **CHANGE #4: Smart Appointment Services**

```prisma
// ✅ Enhanced appointment services
model hms_appointment_services {
  id             String   @id @default(dbgenerated("gen_random_uuid()"))
  tenant_id      String   @db.Uuid
  appointment_id String   @db.Uuid
  
  // Service from catalog
  service_code   String   // Links to hms_service_catalog
  service_name   String   // Cached for performance
  
  // Pricing (from catalog but can override)
  qty            Decimal  @default(1) @db.Decimal(10, 2)
  unit_price     Decimal  @db.Decimal(18, 2)
  discount       Decimal? @default(0) @db.Decimal(18, 2)
  total_price    Decimal  @db.Decimal(18, 2)
  
  // Billing
  is_billable    Boolean  @default(true)
  billed         Boolean  @default(false)
  invoice_id     String?  @db.Uuid  // ← Link to invoice when billed
  
  // Status
  status         String   @default("planned")  // planned, provided, cancelled
  provided_at    DateTime?
  
  notes          String?
  
  hms_appointment hms_appointments @relation(fields: [appointment_id], references: [id])
  
  @@index([appointment_id])
  @@index([service_code])
  @@index([billed])
}
```

---

## 🚀 MIGRATION STRATEGY

### **Phase 1: Critical Links (DO THIS FIRST!)**

```sql
-- Add appointment_id to lab orders
ALTER TABLE hms_lab_order ADD COLUMN appointment_id UUID;
ALTER TABLE hms_lab_order ADD CONSTRAINT fk_lab_order_appointment 
  FOREIGN KEY (appointment_id) REFERENCES hms_appointments(id) ON DELETE SET NULL;
CREATE INDEX idx_lab_order_appointment ON hms_lab_order(appointment_id);

-- Add appointment_id to encounters
ALTER TABLE hms_encounter ADD COLUMN appointment_id UUID;
ALTER TABLE hms_encounter ADD CONSTRAINT fk_encounter_appointment 
  FOREIGN KEY (appointment_id) REFERENCES hms_appointments(id) ON DELETE SET NULL;
CREATE INDEX idx_encounter_appointment ON hms_encounter(appointment_id);

-- Add appointment_id to invoices
ALTER TABLE hms_invoice ADD COLUMN appointment_id UUID;
ALTER TABLE hms_invoice ADD CONSTRAINT fk_invoice_appointment 
  FOREIGN KEY (appointment_id) REFERENCES hms_appointments(id) ON DELETE SET NULL;
CREATE INDEX idx_invoice_appointment ON hms_invoice(appointment_id);
```

### **Phase 2: Service Catalog (Recommended)**

```sql
-- Create service catalog
CREATE TABLE hms_service_catalog (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  company_id UUID NOT NULL,
  code VARCHAR(50) NOT NULL,
  cpt_code VARCHAR(20),
  service_name VARCHAR(255) NOT NULL,
  service_category VARCHAR(50),
  base_price DECIMAL(18,2) NOT NULL,
  insurance_price DECIMAL(18,2),
  cash_price DECIMAL(18,2),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX ux_service_catalog_code ON hms_service_catalog(tenant_id, company_id, code);
CREATE INDEX idx_service_catalog_cpt ON hms_service_catalog(cpt_code);
```

### **Phase 3: Unified Orders (Future Enhancement)**

Create `hms_clinical_order` table to replace separate lab/radiology/pharmacy tables.

---

## 📊 COMPARISON: Before vs After

| Feature | ❌ Current | ✅ World-Class |
|---------|-----------|----------------|
| **Appointment → Lab Link** | Time-based guess | Direct appointment_id |
| **Billing Rules** | Single price | Multi-tier pricing |
| **Service Codes** | None | CPT/ICD codes |
| **Order Tracking** | Separate tables | Unified orders |
| **Invoice Link** | encounter_id only | appointment_id + encounter_id |
| **Package Pricing** | No | Yes |
| **Insurance** | No | Yes |
| **Audit Trail** | Limited | Complete |

---

## 💡 QUICK WINS (Implement Today!)

### **1. Add appointment_id to Three Tables**
```sql
ALTER TABLE hms_lab_order ADD COLUMN appointment_id UUID;
ALTER TABLE hms_encounter ADD COLUMN appointment_id UUID;
ALTER TABLE hms_invoice ADD COLUMN appointment_id UUID;
```

### **2. Update Your Lab Order Form**
```typescript
// When doctor orders lab test
await prisma.hms_lab_order.create({
  data: {
    appointment_id: currentAppointmentId,  // ← ADD THIS!
    patient_id: patientId,
    encounter_id: encounterId,
    // ... rest
  }
})
```

### **3. Update Billing API**
```typescript
// Now you can query directly!
const labOrders = await prisma.hms_lab_order.findMany({
  where: { appointment_id: appointmentId }  // Direct!
})
```

---

## 🎓 REFERENCES (World Standards)

1. **HL7 FHIR (Fast Healthcare Interoperability Resources)**
   - Appointment Resource: https://www.hl7.org/fhir/appointment.html
   - Order Resource: https://www.hl7.org/fhir/servicerequest.html

2. **Epic EHR Data Model**
   - Uses direct appointment links in all clinical orders
   - Service catalog with CPT/ICD coding
   - Multi-tier pricing (insurance, self-pay, contracted)

3. **Cerner Millennium Architecture**
   - Unified order tables (ORDERS table)
   - Clinical workflow status tracking
   - Audit trail for all changes

4. **NHS Digital Standards**
   - Direct referential integrity
   - Complete audit trails
   - SNOMED CT coding support

---

## 📈 BENEFITS YOU'LL GET

✅ **Billing**: Instant fetch of all appointment charges
✅ **Reporting**: Accurate revenue per appointment
✅ **Audit**: Full traceability from booking to payment
✅ **Compliance**: Meets healthcare standards
✅ **Performance**: Direct queries (no time-based guessing)
✅ **Scalability**: Ready for insurance, packages, etc.

---

## 🎯 FINAL RECOMMENDATION

### **DO THIS NOW (30 minutes):**
1. Run Phase 1 migration (add appointment_id columns)
2. Update your API to use direct links
3. Update forms to save appointment_id

### **DO THIS WEEK:**
1. Create service catalog table
2. Migrate billing rules to service catalog
3. Add CPT/service codes

### **DO THIS MONTH:**
1. Implement unified clinical orders
2. Add package pricing
3. Build insurance support

**Your schema is 70% there! Just needs these critical links.**
