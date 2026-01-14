-- Add created_by column to hms_vitals
ALTER TABLE hms_vitals ADD COLUMN IF NOT EXISTS created_by UUID;

-- Optional: Add foreign key constraint if you want strict referential integrity
-- ALTER TABLE hms_vitals ADD CONSTRAINT fk_hms_vitals_created_by FOREIGN KEY (created_by) REFERENCES app_user(id);
