ALTER TABLE hms_appointments DROP CONSTRAINT IF EXISTS hms_appointments_status_check;
ALTER TABLE hms_appointments ADD CONSTRAINT hms_appointments_status_check CHECK (status IN ('scheduled', 'confirmed', 'cancelled', 'completed', 'no_show', 'rescheduled', 'arrived', 'checked_in', 'in_progress'));
