
-- Fix for "Employee Hierarchy" database schema
-- Run this in your database console or via psql

-- 1. Update crm_employee table
ALTER TABLE crm_employee ADD COLUMN IF NOT EXISTS designation_id UUID;
ALTER TABLE crm_employee ADD COLUMN IF NOT EXISTS department_id UUID;
ALTER TABLE crm_employee ADD COLUMN IF NOT EXISTS supervisor_id UUID;

-- 2. Update crm_designation table
ALTER TABLE crm_designation ADD COLUMN IF NOT EXISTS department_id UUID;
ALTER TABLE crm_designation ADD COLUMN IF NOT EXISTS parent_id UUID;

-- 3. Update hms_departments table (if missing parent_id for internal hierarchy)
ALTER TABLE hms_departments ADD COLUMN IF NOT EXISTS parent_id UUID;

-- Add foreign keys if they don't exist (optional but recommended)
-- Note: These might fail if there's orphaned data, so we'll leave them commented out
-- ALTER TABLE crm_employee ADD CONSTRAINT fk_emp_designation FOREIGN KEY (designation_id) REFERENCES crm_designation(id);
-- ALTER TABLE crm_employee ADD CONSTRAINT fk_emp_department FOREIGN KEY (department_id) REFERENCES hms_departments(id);
-- ALTER TABLE crm_employee ADD CONSTRAINT fk_emp_supervisor FOREIGN KEY (supervisor_id) REFERENCES crm_employee(id);
