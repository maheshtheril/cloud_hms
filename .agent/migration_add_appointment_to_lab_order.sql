-- Migration: Add appointment_id to lab orders for proper linking
-- This allows lab tests to be directly linked to the appointment where they were ordered

-- Step 1: Add the appointment_id column
ALTER TABLE hms_lab_order 
ADD COLUMN IF NOT EXISTS appointment_id UUID;

-- Step 2: Add foreign key constraint
ALTER TABLE hms_lab_order 
ADD CONSTRAINT fk_lab_order_appointment 
FOREIGN KEY (appointment_id) 
REFERENCES hms_appointments(id) 
ON DELETE SET NULL;

-- Step 3: Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_lab_order_appointment 
ON hms_lab_order(tenant_id, appointment_id);

-- Step 4: (Optional) Backfill existing data
-- This tries to link existing lab orders to appointments based on time and patient
UPDATE hms_lab_order lo
SET appointment_id = (
    SELECT a.id
    FROM hms_appointments a
    WHERE a.patient_id = lo.patient_id
      AND a.tenant_id = lo.tenant_id
      AND lo.ordered_at BETWEEN 
          (a.starts_at - INTERVAL '1 hour') AND 
          (a.ends_at + INTERVAL '2 hours')
    ORDER BY a.starts_at DESC
    LIMIT 1
)
WHERE lo.appointment_id IS NULL 
  AND lo.ordered_at IS NOT NULL;

-- Verify the migration
SELECT 
    COUNT(*) as total_lab_orders,
    COUNT(appointment_id) as linked_to_appointment,
    COUNT(*) - COUNT(appointment_id) as not_linked
FROM hms_lab_order;
