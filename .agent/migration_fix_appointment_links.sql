-- ============================================================================
-- CRITICAL SCHEMA FIX: Add Missing Appointment Links
-- Based on Epic/Cerner/NHS best practices
-- ============================================================================
-- This fixes the core issue: No direct link from orders/encounters to appointments
-- Run this on your production database after backing up!
-- ============================================================================

BEGIN;

-- ============================================================================
-- PHASE 1: ADD APPOINTMENT_ID COLUMNS (CRITICAL!)
-- ============================================================================

PRINT '🔧 Adding appointment_id to lab orders...';

-- 1. Add appointment_id to lab orders
ALTER TABLE hms_lab_order 
ADD COLUMN IF NOT EXISTS appointment_id UUID;

-- 2. Add foreign key
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_lab_order_appointment'
  ) THEN
    ALTER TABLE hms_lab_order 
    ADD CONSTRAINT fk_lab_order_appointment 
    FOREIGN KEY (appointment_id) 
    REFERENCES hms_appointments(id) 
    ON DELETE SET NULL;
  END IF;
END $$;

-- 3. Add index
CREATE INDEX IF NOT EXISTS idx_lab_order_appointment 
ON hms_lab_order(tenant_id, appointment_id);

PRINT '✅ Lab orders updated';

-- ============================================================================

PRINT '🔧 Adding appointment_id to encounters...';

-- 4. Add appointment_id to encounters
ALTER TABLE hms_encounter 
ADD COLUMN IF NOT EXISTS appointment_id UUID;

-- 5. Add foreign key
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_encounter_appointment'
  ) THEN
    ALTER TABLE hms_encounter 
    ADD CONSTRAINT fk_encounter_appointment 
    FOREIGN KEY (appointment_id) 
    REFERENCES hms_appointments(id) 
    ON DELETE SET NULL;
  END IF;
END $$;

-- 6. Add index
CREATE INDEX IF NOT EXISTS idx_encounter_appointment 
ON hms_encounter(tenant_id, appointment_id);

PRINT '✅ Encounters updated';

-- ============================================================================

PRINT '🔧 Adding appointment_id to invoices...';

-- 7. Add appointment_id to invoices
ALTER TABLE hms_invoice 
ADD COLUMN IF NOT EXISTS appointment_id UUID;

-- 8. Add foreign key
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_invoice_appointment'
  ) THEN
    ALTER TABLE hms_invoice 
    ADD CONSTRAINT fk_invoice_appointment 
    FOREIGN KEY (appointment_id) 
    REFERENCES hms_appointments(id) 
    ON DELETE SET NULL;
  END IF;
END $$;

-- 9. Add index
CREATE INDEX IF NOT EXISTS idx_invoice_appointment 
ON hms_invoice(tenant_id, appointment_id);

PRINT '✅ Invoices updated';

-- ============================================================================

PRINT '🔧 Adding billed flag to appointment services...';

-- 10. Add billed tracking to services
ALTER TABLE hms_appointment_services 
ADD COLUMN IF NOT EXISTS billed BOOLEAN DEFAULT false;

ALTER TABLE hms_appointment_services 
ADD COLUMN IF NOT EXISTS invoice_id UUID;

ALTER TABLE hms_appointment_services 
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'planned';

CREATE INDEX IF NOT EXISTS idx_appointment_services_billed 
ON hms_appointment_services(tenant_id, billed);

PRINT '✅ Appointment services enhanced';

-- ============================================================================
-- PHASE 2: BACKFILL EXISTING DATA (Smart matching)
-- ============================================================================

PRINT '🔄 Backfilling appointment links...';

-- Link encounters to appointments (by patient + time)
UPDATE hms_encounter e
SET appointment_id = (
  SELECT a.id
  FROM hms_appointments a
  WHERE a.patient_id = e.patient_id
    AND a.tenant_id = e.tenant_id
    AND e.started_at BETWEEN 
      (a.starts_at - INTERVAL '30 minutes') AND 
      (a.ends_at + INTERVAL '2 hours')
  ORDER BY a.starts_at DESC
  LIMIT 1
)
WHERE e.appointment_id IS NULL
  AND e.started_at IS NOT NULL;

PRINT '✅ Encounters linked to appointments';

-- Link lab orders to appointments (via encounter first, then time)
-- Method 1: Via encounter
UPDATE hms_lab_order lo
SET appointment_id = e.appointment_id
FROM hms_encounter e
WHERE lo.encounter_id = e.id
  AND lo.appointment_id IS NULL
  AND e.appointment_id IS NOT NULL;

PRINT '✅ Lab orders linked via encounters';

-- Method 2: Time-based for remaining
UPDATE hms_lab_order lo
SET appointment_id = (
  SELECT a.id
  FROM hms_appointments a
  WHERE a.patient_id = lo.patient_id
    AND a.tenant_id = lo.tenant_id
    AND lo.ordered_at BETWEEN 
      (a.starts_at - INTERVAL '1 hour') AND 
      (a.ends_at + INTERVAL '3 hours')
  ORDER BY a.starts_at DESC
  LIMIT 1
)
WHERE lo.appointment_id IS NULL
  AND lo.ordered_at IS NOT NULL
  AND lo.patient_id IS NOT NULL;

PRINT '✅ Lab orders linked via time correlation';

-- Link invoices to appointments (via encounter)
UPDATE hms_invoice i
SET appointment_id = e.appointment_id
FROM hms_encounter e
WHERE i.encounter_id = e.id
  AND i.appointment_id IS NULL
  AND e.appointment_id IS NOT NULL;

PRINT '✅ Invoices linked to appointments';

-- ============================================================================
-- PHASE 3: VERIFY MIGRATION
-- ============================================================================

PRINT '📊 Migration Statistics:';

-- Show linkage stats
DO $$
DECLARE
  lab_linked INTEGER;
  lab_total INTEGER;
  enc_linked INTEGER;
  enc_total INTEGER;
  inv_linked INTEGER;
  inv_total INTEGER;
BEGIN
  -- Lab orders
  SELECT COUNT(*) INTO lab_total FROM hms_lab_order;
  SELECT COUNT(*) INTO lab_linked FROM hms_lab_order WHERE appointment_id IS NOT NULL;
  
  -- Encounters
  SELECT COUNT(*) INTO enc_total FROM hms_encounter;
  SELECT COUNT(*) INTO enc_linked FROM hms_encounter WHERE appointment_id IS NOT NULL;
  
  -- Invoices
  SELECT COUNT(*) INTO inv_total FROM hms_invoice;
  SELECT COUNT(*) INTO inv_linked FROM hms_invoice WHERE appointment_id IS NOT NULL;
  
  RAISE NOTICE 'Lab Orders: % / % linked (%.1f%%)', 
    lab_linked, lab_total, 
    CASE WHEN lab_total > 0 THEN (lab_linked::NUMERIC / lab_total * 100) ELSE 0 END;
    
  RAISE NOTICE 'Encounters: % / % linked (%.1f%%)', 
    enc_linked, enc_total,
    CASE WHEN enc_total > 0 THEN (enc_linked::NUMERIC / enc_total * 100) ELSE 0 END;
    
  RAISE NOTICE 'Invoices: % / % linked (%.1f%%)', 
    inv_linked, inv_total,
    CASE WHEN inv_total > 0 THEN (inv_linked::NUMERIC / inv_total * 100) ELSE 0 END;
END $$;

-- Final verification query
SELECT 
  'Lab Orders' as table_name,
  COUNT(*) as total_records,
  COUNT(appointment_id) as linked_to_appointments,
  ROUND(COUNT(appointment_id)::NUMERIC / NULLIF(COUNT(*), 0) * 100, 1) as link_percentage
FROM hms_lab_order
UNION ALL
SELECT 
  'Encounters',
  COUNT(*),
  COUNT(appointment_id),
  ROUND(COUNT(appointment_id)::NUMERIC / NULLIF(COUNT(*), 0) * 100, 1)
FROM hms_encounter
UNION ALL
SELECT 
  'Invoices',
  COUNT(*),
  COUNT(appointment_id),
  ROUND(COUNT(appointment_id)::NUMERIC / NULLIF(COUNT(*), 0) * 100, 1)
FROM hms_invoice;

PRINT '';
PRINT '✅ Migration Complete!';
PRINT '';
PRINT 'Next Steps:';
PRINT '1. Update your code to save appointment_id when creating orders';
PRINT '2. Update API to query by appointment_id directly';
PRINT '3. Test the billing integration';

COMMIT;

-- ============================================================================
-- ROLLBACK SCRIPT (if needed)
-- ============================================================================
-- Uncomment and run if you need to rollback:
/*
BEGIN;

ALTER TABLE hms_lab_order DROP COLUMN IF EXISTS appointment_id;
ALTER TABLE hms_encounter DROP COLUMN IF EXISTS appointment_id;
ALTER TABLE hms_invoice DROP COLUMN IF EXISTS appointment_id;
ALTER TABLE hms_appointment_services DROP COLUMN IF EXISTS billed;
ALTER TABLE hms_appointment_services DROP COLUMN IF EXISTS invoice_id;
ALTER TABLE hms_appointment_services DROP COLUMN IF EXISTS status;

COMMIT;
*/
