-- World-Standard Clinical Roles Seed
-- Replace YOUR_TENANT_ID and YOUR_COMPANY_ID with actual values

-- ==================================================
-- PHYSICIANS & DOCTORS
-- ==================================================
INSERT INTO hms_roles (tenant_id, company_id, name, code, description, is_clinical, is_active) VALUES
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', 'Physician', 'MD', 'Medical Doctor', true, true),
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', 'Surgeon', 'SURG', 'Surgical specialist', true, true),
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', 'Consultant', 'CONS', 'Senior specialist consultant', true, true),
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', 'Resident', 'RES', 'Medical resident in training', true, true),
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', 'Intern', 'INT', 'Medical intern', true, true);

-- ==================================================
-- NURSING STAFF
-- ==================================================
INSERT INTO hms_roles (tenant_id, company_id, name, code, description, is_clinical, is_active) VALUES
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', 'Registered Nurse', 'RN', 'Licensed registered nurse', true, true),
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', 'Nurse Practitioner', 'NP', 'Advanced practice nurse', true, true),
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', 'Clinical Nurse Specialist', 'CNS', 'Specialized clinical nurse', true, true),
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', 'Nurse Anesthetist', 'CRNA', 'Certified registered nurse anesthetist', true, true),
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', 'Head Nurse', 'HN', 'Senior nursing supervisor', true, true),
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', 'Staff Nurse', 'SN', 'General nursing staff', true, true),
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', 'ICU Nurse', 'ICU-RN', 'Intensive care unit nurse', true, true),
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', 'OR Nurse', 'OR-RN', 'Operating room nurse', true, true),
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', 'ER Nurse', 'ER-RN', 'Emergency room nurse', true, true),
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', 'Pediatric Nurse', 'PED-RN', 'Children''s specialized nurse', true, true),
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', 'Midwife', 'MW', 'Certified midwife', true, true);

-- ==================================================
-- ALLIED HEALTH PROFESSIONALS
-- ==================================================
INSERT INTO hms_roles (tenant_id, company_id, name, code, description, is_clinical, is_active) VALUES
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', 'Physician Assistant', 'PA', 'Licensed physician assistant', true, true),
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', 'Medical Assistant', 'MA', 'Clinical medical assistant', true, true);

-- ==================================================
-- THERAPY & REHABILITATION
-- ==================================================
INSERT INTO hms_roles (tenant_id, company_id, name, code, description, is_clinical, is_active) VALUES
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', 'Physiotherapist', 'PT', 'Physical therapist', true, true),
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', 'Occupational Therapist', 'OT', 'Occupational therapy specialist', true, true),
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', 'Speech Therapist', 'ST', 'Speech and language therapist', true, true),
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', 'Respiratory Therapist', 'RT', 'Respiratory care specialist', true, true);

-- ==================================================
-- MENTAL HEALTH
-- ==================================================
INSERT INTO hms_roles (tenant_id, company_id, name, code, description, is_clinical, is_active) VALUES
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', 'Psychiatrist', 'PSY', 'Mental health physician', true, true),
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', 'Psychologist', 'PSYCH', 'Clinical psychologist', true, true),
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', 'Counselor', 'COUN', 'Mental health counselor', true, true),
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', 'Social Worker', 'SW', 'Clinical social worker', true, true);

-- ==================================================
-- PHARMACY
-- ==================================================
INSERT INTO hms_roles (tenant_id, company_id, name, code, description, is_clinical, is_active) VALUES
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', 'Pharmacist', 'RPH', 'Licensed pharmacist', true, true),
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', 'Clinical Pharmacist', 'CLIN-RPH', 'Clinical pharmacy specialist', true, true),
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', 'Pharmacy Technician', 'PHARM-TECH', 'Pharmacy support technician', true, true);

-- ==================================================
-- LABORATORY & DIAGNOSTICS
-- ==================================================
INSERT INTO hms_roles (tenant_id, company_id, name, code, description, is_clinical, is_active) VALUES
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', 'Medical Laboratory Technologist', 'MLT', 'Lab technologist', true, true),
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', 'Pathologist', 'PATH', 'Laboratory pathologist', true, true),
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', 'Phlebotomist', 'PHLEB', 'Blood draw specialist', true, true),
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', 'Cytotechnologist', 'CYTO', 'Cell analysis specialist', true, true);

-- ==================================================
-- IMAGING & RADIOLOGY
-- ==================================================
INSERT INTO hms_roles (tenant_id, company_id, name, code, description, is_clinical, is_active) VALUES
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', 'Radiologist', 'RAD', 'Medical imaging physician', true, true),
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', 'Radiographer', 'RAD-TECH', 'X-ray and imaging technician', true, true),
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', 'Ultrasound Technician', 'US-TECH', 'Sonography specialist', true, true),
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', 'MRI Technologist', 'MRI-TECH', 'MRI specialist', true, true),
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', 'CT Technologist', 'CT-TECH', 'CT scan specialist', true, true);

-- ==================================================
-- DENTAL
-- ==================================================
INSERT INTO hms_roles (tenant_id, company_id, name, code, description, is_clinical, is_active) VALUES
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', 'Dentist', 'DDS', 'General dentist', true, true),
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', 'Orthodontist', 'ORTHO', 'Dental alignment specialist', true, true),
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', 'Oral Surgeon', 'OMS', 'Dental surgeon', true, true),
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', 'Dental Hygienist', 'DH', 'Dental hygiene specialist', true, true),
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', 'Dental Assistant', 'DA', 'Dental chair-side assistant', true, true);

-- ==================================================
-- SURGICAL SUPPORT
-- ==================================================
INSERT INTO hms_roles (tenant_id, company_id, name, code, description, is_clinical, is_active) VALUES
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', 'Anesthesiologist', 'ANES', 'Anesthesia physician', true, true),
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', 'Surgical Technologist', 'SURG-TECH', 'Operating room technician', true, true),
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', 'Perfusionist', 'PERF', 'Heart-lung machine operator', true, true);

-- ==================================================
-- OPTOMETRY & OPHTHALMOLOGY
-- ==================================================
INSERT INTO hms_roles (tenant_id, company_id, name, code, description, is_clinical, is_active) VALUES
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', 'Ophthalmologist', 'OPH', 'Eye physician and surgeon', true, true),
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', 'Optometrist', 'OD', 'Vision care specialist', true, true),
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', 'Optician', 'OPT', 'Eyewear specialist', true, true);

-- ==================================================
-- NUTRITION & WELLNESS
-- ==================================================
INSERT INTO hms_roles (tenant_id, company_id, name, code, description, is_clinical, is_active) VALUES
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', 'Dietitian', 'RD', 'Registered dietitian', true, true),
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', 'Nutritionist', 'NUT', 'Nutrition specialist', true, true);

-- ==================================================
-- EMERGENCY & PARAMEDICS
-- ==================================================
INSERT INTO hms_roles (tenant_id, company_id, name, code, description, is_clinical, is_active) VALUES
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', 'Paramedic', 'EMT-P', 'Emergency medical technician paramedic', true, true),
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', 'Emergency Medical Technician', 'EMT', 'Basic emergency medical technician', true, true);

-- ==================================================
-- OTHER CLINICAL STAFF
-- ==================================================
INSERT INTO hms_roles (tenant_id, company_id, name, code, description, is_clinical, is_active) VALUES
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', 'Audiologist', 'AUD', 'Hearing specialist', true, true),
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', 'Podiatrist', 'DPM', 'Foot and ankle specialist', true, true),
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', 'Chiropractor', 'DC', 'Spinal adjustment specialist', true, true),
('YOUR_TENANT_ID', 'YOUR_COMPANY_ID', 'Acupuncturist', 'LAC', 'Traditional Chinese medicine practitioner', true, true);

-- Verify insertion
SELECT COUNT(*) as total_roles FROM hms_roles 
WHERE tenant_id = 'YOUR_TENANT_ID' AND company_id = 'YOUR_COMPANY_ID' AND is_clinical = true;
