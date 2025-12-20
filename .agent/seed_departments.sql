-- Standard Hospital Departments Seed
-- Replace YOUR_TENANT_ID and YOUR_COMPANY_ID with actual values

-- ==================================================
-- CORE CLINICAL DEPARTMENTS
-- ==================================================

-- Main Clinical Departments
INSERT INTO hms_departments (tenant_id, company_id, name, code, description, is_active) VALUES
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', 'Emergency Department', 'ED', '24/7 emergency and trauma care', true),
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', 'Intensive Care Unit', 'ICU', 'Critical care and life support', true),
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', 'Operating Theatre', 'OT', 'Surgical procedures', true),
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', 'Out Patient Department', 'OPD', 'Outpatient consultations', true),
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', 'In Patient Department', 'IPD', 'In-patient wards', true);

-- ==================================================
-- MEDICAL SPECIALITY DEPARTMENTS
-- ==================================================

INSERT INTO hms_departments (tenant_id, company_id, name, code, description, is_active) VALUES
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', 'Cardiology Department', 'CARD', 'Heart and vascular care', true),
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', 'Neurology Department', 'NEUR', 'Brain and nervous system', true),
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', 'Pediatrics Department', 'PED', 'Child healthcare', true),
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', 'Obstetrics & Gynecology', 'OBG', 'Women''s health', true),
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', 'Orthopedics Department', 'ORTH', 'Bones and joints', true),
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', 'General Medicine', 'MED', 'Internal medicine', true),
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', 'General Surgery', 'SURG', 'Surgical care', true);

-- ==================================================
-- DIAGNOSTIC & THERAPEUTIC DEPARTMENTS
-- ==================================================

INSERT INTO hms_departments (tenant_id, company_id, name, code, description, is_active) VALUES
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', 'Radiology Department', 'RAD', 'Medical imaging', true),
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', 'Pathology Department', 'PATH', 'Laboratory and diagnostics', true),
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', 'Pharmacy Department', 'PHAR', 'Medication dispensing', true),
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', 'Physiotherapy', 'PT', 'Physical rehabilitation', true);

-- ==================================================
-- SUPPORT DEPARTMENTS
-- ==================================================

INSERT INTO hms_departments (tenant_id, company_id, name, code, description, is_active) VALUES
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', 'Nursing Services', 'NURS', 'Nursing administration', true),
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', 'Administration', 'ADMIN', 'Hospital administration', true),
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', 'Medical Records', 'MR', 'Patient records management', true);

-- ==================================================
-- OPTIONAL: SUB-DEPARTMENTS (with parent_id)
-- ==================================================

-- First, get the Cardiology department ID to use as parent
-- You can uncomment and modify these after running the main seed

-- Sub-departments under Cardiology (example)
-- INSERT INTO hms_departments (tenant_id, company_id, name, code, description, parent_id, is_active) VALUES
-- ('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', 'Cardiac Catheterization Lab', 'CATH-LAB', 'Interventional cardiology', 'CARDIOLOGY_DEPT_ID', true),
-- ('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', 'Cardiac ICU', 'CICU', 'Cardiac intensive care', 'CARDIOLOGY_DEPT_ID', true);

-- Verify
SELECT COUNT(*) as total_departments FROM hms_departments 
WHERE tenant_id = 'YOUR_TENANT_ID' AND company_id = 'YOUR_COMPANY_ID';

SELECT name, code, description FROM hms_departments
WHERE tenant_id = 'YOUR_TENANT_ID' AND company_id = 'YOUR_COMPANY_ID'
ORDER BY name;
