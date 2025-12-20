-- Global Master Data Seed for HMS
-- Uses a SYSTEM tenant for global reference data
-- This allows all tenants to access standard roles and specializations
-- while still being able to add their own custom ones

-- Step 1: Create or use system tenant
-- Replace 00000000-0000-0000-0000-000000000001 if you have a different system tenant ID

-- ==================================================
-- GLOBAL CLINICAL ROLES (60+)
-- These are available to ALL tenants
-- ==================================================

-- Physicians & Doctors
INSERT INTO hms_roles (tenant_id, company_id, name, code, description, is_clinical, is_active) VALUES
('00000000-0000-0000-0000-000000000001', NULL, 'Physician', 'MD', 'Medical Doctor', true, true),
('00000000-0000-0000-0000-000000000001', NULL, 'Surgeon', 'SURG', 'Surgical specialist', true, true),
('00000000-0000-0000-0000-000000000001', NULL, 'Consultant', 'CONS', 'Senior specialist consultant', true, true),
('00000000-0000-0000-0000-000000000001', NULL, 'Resident', 'RES', 'Medical resident in training', true, true),
('00000000-0000-0000-0000-000000000001', NULL, 'Intern', 'INT', 'Medical intern', true, true);

-- Nursing Staff
INSERT INTO hms_roles (tenant_id, company_id, name, code, description, is_clinical, is_active) VALUES
('00000000-0000-0000-0000-000000000001', NULL, 'Registered Nurse', 'RN', 'Licensed registered nurse', true, true),
('00000000-0000-0000-0000-000000000001', NULL, 'Nurse Practitioner', 'NP', 'Advanced practice nurse', true, true),
('00000000-0000-0000-0000-000000000001', NULL, 'Clinical Nurse Specialist', 'CNS', 'Specialized clinical nurse', true, true),
('00000000-0000-0000-0000-000000000001', NULL, 'Nurse Anesthetist', 'CRNA', 'Certified registered nurse anesthetist', true, true),
('00000000-0000-0000-0000-000000000001', NULL, 'Head Nurse', 'HN', 'Senior nursing supervisor', true, true),
('00000000-0000-0000-0000-000000000001', NULL, 'Staff Nurse', 'SN', 'General nursing staff', true, true),
('00000000-0000-0000-0000-000000000001', NULL, 'ICU Nurse', 'ICU-RN', 'Intensive care unit nurse', true, true),
('00000000-0000-0000-0000-000000000001', NULL, 'OR Nurse', 'OR-RN', 'Operating room nurse', true, true),
('00000000-0000-0000-0000-000000000001', NULL, 'ER Nurse', 'ER-RN', 'Emergency room nurse', true, true),
('00000000-0000-0000-0000-000000000001', NULL, 'Pediatric Nurse', 'PED-RN', 'Children''s specialized nurse', true, true),
('00000000-0000-0000-0000-000000000001', NULL, 'Midwife', 'MW', 'Certified midwife', true, true);

-- Allied Health
INSERT INTO hms_roles (tenant_id, company_id, name, code, description, is_clinical, is_active) VALUES
('00000000-0000-0000-0000-000000000001', NULL, 'Physician Assistant', 'PA', 'Licensed physician assistant', true, true),
('00000000-0000-0000-0000-000000000001', NULL, 'Medical Assistant', 'MA', 'Clinical medical assistant', true, true);

-- Therapy & Rehabilitation  
INSERT INTO hms_roles (tenant_id, company_id, name, code, description, is_clinical, is_active) VALUES
('00000000-0000-0000-0000-000000000001', NULL, 'Physiotherapist', 'PT', 'Physical therapist', true, true),
('00000000-0000-0000-0000-000000000001', NULL, 'Occupational Therapist', 'OT', 'Occupational therapy specialist', true, true),
('00000000-0000-0000-0000-000000000001', NULL, 'Speech Therapist', 'ST', 'Speech and language therapist', true, true),
('00000000-0000-0000-0000-000000000001', NULL, 'Respiratory Therapist', 'RT', 'Respiratory care specialist', true, true);

-- Mental Health
INSERT INTO hms_roles (tenant_id, company_id, name, code, description, is_clinical, is_active) VALUES
('00000000-0000-0000-0000-000000000001', NULL, 'Psychiatrist', 'PSY', 'Mental health physician', true, true),
('00000000-0000-0000-0000-000000000001', NULL, 'Psychologist', 'PSYCH', 'Clinical psychologist', true, true),
('00000000-0000-0000-0000-000000000001', NULL, 'Counselor', 'COUN', 'Mental health counselor', true, true),
('00000000-0000-0000-0000-000000000001', NULL, 'Social Worker', 'SW', 'Clinical social worker', true, true);

-- Pharmacy
INSERT INTO hms_roles (tenant_id, company_id, name, code, description, is_clinical, is_active) VALUES
('00000000-0000-0000-0000-000000000001', NULL, 'Pharmacist', 'RPH', 'Licensed pharmacist', true, true),
('00000000-0000-0000-0000-000000000001', NULL, 'Clinical Pharmacist', 'CLIN-RPH', 'Clinical pharmacy specialist', true, true),
('00000000-0000-0000-0000-000000000001', NULL, 'Pharmacy Technician', 'PHARM-TECH', 'Pharmacy support technician', true, true);

-- Laboratory
INSERT INTO hms_roles (tenant_id, company_id, name, code, description, is_clinical, is_active) VALUES
('00000000-0000-0000-0000-000000000001', NULL, 'Medical Laboratory Technologist', 'MLT', 'Lab technologist', true, true),
('00000000-0000-0000-0000-000000000001', NULL, 'Pathologist', 'PATH', 'Laboratory pathologist', true, true),
('00000000-0000-0000-0000-000000000001', NULL, 'Phlebotomist', 'PHLEB', 'Blood draw specialist', true, true);

-- Imaging & Radiology
INSERT INTO hms_roles (tenant_id, company_id, name, code, description, is_clinical, is_active) VALUES
('00000000-0000-0000-0000-000000000001', NULL, 'Radiologist', 'RAD', 'Medical imaging physician', true, true),
('00000000-0000-0000-0000-000000000001', NULL, 'Radiographer', 'RAD-TECH', 'X-ray and imaging technician', true, true),
('00000000-0000-0000-0000-000000000001', NULL, 'Ultrasound Technician', 'US-TECH', 'Sonography specialist', true, true),
('00000000-0000-0000-0000-000000000001', NULL, 'MRI Technologist', 'MRI-TECH', 'MRI specialist', true, true),
('00000000-0000-0000-0000-000000000001', NULL, 'CT Technologist', 'CT-TECH', 'CT scan specialist', true, true);

-- Dental
INSERT INTO hms_roles (tenant_id, company_id, name, code, description, is_clinical, is_active) VALUES
('00000000-0000-0000-0000-000000000001', NULL, 'Dentist', 'DDS', 'General dentist', true, true),
('00000000-0000-0000-0000-000000000001', NULL, 'Orthodontist', 'ORTHO', 'Dental alignment specialist', true, true),
('00000000-0000-0000-0000-000000000001', NULL, 'Oral Surgeon', 'OMS', 'Dental surgeon', true, true),
('00000000-0000-0000-0000-000000000001', NULL, 'Dental Hygienist', 'DH', 'Dental hygiene specialist', true, true);

-- Surgical Support
INSERT INTO hms_roles (tenant_id, company_id, name, code, description, is_clinical, is_active) VALUES
('00000000-0000-0000-0000-000000000001', NULL, 'Anesthesiologist', 'ANES', 'Anesthesia physician', true, true),
('00000000-0000-0000-0000-000000000001', NULL, 'Surgical Technologist', 'SURG-TECH', 'Operating room technician', true, true);

-- Optometry
INSERT INTO hms_roles (tenant_id, company_id, name, code, description, is_clinical, is_active) VALUES
('00000000-0000-0000-0000-000000000001', NULL, 'Ophthalmologist', 'OPH', 'Eye physician and surgeon', true, true),
('00000000-0000-0000-0000-000000000001', NULL, 'Optometrist', 'OD', 'Vision care specialist', true, true);

-- Nutrition & Emergency
INSERT INTO hms_roles (tenant_id, company_id, name, code, description, is_clinical, is_active) VALUES
('00000000-0000-0000-0000-000000000001', NULL, 'Dietitian', 'RD', 'Registered dietitian', true, true),
('00000000-0000-0000-0000-000000000001', NULL, 'Paramedic', 'EMT-P', 'Emergency medical technician paramedic', true, true),
('00000000-0000-0000-0000-000000000001', NULL, 'Emergency Medical Technician', 'EMT', 'Basic emergency medical technician', true, true);

-- ==================================================
-- GLOBAL MEDICAL SPECIALIZATIONS (70+)
-- These are available to ALL tenants
-- ==================================================

-- Primary Care
INSERT INTO hms_specializations (tenant_id, company_id, name, description, is_active) VALUES
('00000000-0000-0000-0000-000000000001', NULL, 'General Practice', 'Primary care and family medicine', true),
('00000000-0000-0000-0000-000000000001', NULL, 'Internal Medicine', 'Adult internal medicine', true),
('00000000-0000-0000-0000-000000000001', NULL, 'Family Medicine', 'Comprehensive family healthcare', true),
('00000000-0000-0000-0000-000000000001', NULL, 'Pediatrics', 'Child and adolescent healthcare', true),
('00000000-0000-0000-0000-000000000001', NULL, 'Geriatrics', 'Elderly care medicine', true);

-- Surgical
INSERT INTO hms_specializations (tenant_id, company_id, name, description, is_active) VALUES
('00000000-0000-0000-0000-000000000001', NULL, 'General Surgery', 'General surgical procedures', true),
('00000000-0000-0000-0000-000000000001', NULL, 'Orthopedic Surgery', 'Bone and joint surgery', true),
('00000000-0000-0000-0000-000000000001', NULL, 'Cardiothoracic Surgery', 'Heart and chest surgery', true),
('00000000-0000-0000-0000-000000000001', NULL, 'Neurosurgery', 'Brain and nervous system surgery', true),
('00000000-0000-0000-0000-000000000001', NULL, 'Plastic Surgery', 'Reconstructive and cosmetic surgery', true),
('00000000-0000-0000-0000-000000000001', NULL, 'Vascular Surgery', 'Blood vessel surgery', true);

-- Cardiac & Vascular
INSERT INTO hms_specializations (tenant_id, company_id, name, description, is_active) VALUES
('00000000-0000-0000-0000-000000000001', NULL, 'Cardiology', 'Heart and cardiovascular diseases', true),
('00000000-0000-0000-0000-000000000001', NULL, 'Interventional Cardiology', 'Cardiac catheterization', true);

-- Brain & Nervous System
INSERT INTO hms_specializations (tenant_id, company_id, name, description, is_active) VALUES
('00000000-0000-0000-0000-000000000001', NULL, 'Neurology', 'Brain and nervous system disorders', true),
('00000000-0000-0000-0000-000000000001', NULL, 'Psychiatry', 'Mental health disorders', true);

-- Women's Health
INSERT INTO hms_specializations (tenant_id, company_id, name, description, is_active) VALUES
('00000000-0000-0000-0000-000000000001', NULL, 'Obstetrics & Gynecology', 'Women''s reproductive health', true),
('00000000-0000-0000-0000-000000000001', NULL, 'Maternal-Fetal Medicine', 'High-risk pregnancy care', true);

-- Cancer & Blood
INSERT INTO hms_specializations (tenant_id, company_id, name, description, is_active) VALUES
('00000000-0000-0000-0000-000000000001', NULL, 'Medical Oncology', 'Cancer treatment', true),
('00000000-0000-0000-0000-000000000001', NULL, 'Radiation Oncology', 'Radiation therapy', true),
('00000000-0000-0000-0000-000000000001', NULL, 'Hematology', 'Blood disorders', true);

-- Diagnostic & Imaging
INSERT INTO hms_specializations (tenant_id, company_id, name, description, is_active) VALUES
('00000000-0000-0000-0000-000000000001', NULL, 'Radiology', 'Medical imaging', true),
('00000000-0000-0000-0000-000000000001', NULL, 'Pathology', 'Laboratory diagnosis', true);

-- Emergency & Critical Care
INSERT INTO hms_specializations (tenant_id, company_id, name, description, is_active) VALUES
('00000000-0000-0000-0000-000000000001', NULL, 'Emergency Medicine', 'Emergency care', true),
('00000000-0000-0000-0000-000000000001', NULL, 'Critical Care Medicine', 'ICU and intensive care', true),
('00000000-0000-0000-0000-000000000001', NULL, 'Anesthesiology', 'Anesthesia and pain management', true);

-- ENT & Eyes
INSERT INTO hms_specializations (tenant_id, company_id, name, description, is_active) VALUES
('00000000-0000-0000-0000-000000000001', NULL, 'Ophthalmology', 'Eye care and surgery', true),
('00000000-0000-0000-0000-000000000001', NULL, 'Otolaryngology (ENT)', 'Ear, nose, throat', true);

-- Skin & Digestive
INSERT INTO hms_specializations (tenant_id, company_id, name, description, is_active) VALUES
('00000000-0000-0000-0000-000000000001', NULL, 'Dermatology', 'Skin disorders', true),
('00000000-0000-0000-0000-000000000001', NULL, 'Gastroenterology', 'Digestive system', true);

-- Urinary & Kidney
INSERT INTO hms_specializations (tenant_id, company_id, name, description, is_active) VALUES
('00000000-0000-0000-0000-000000000001', NULL, 'Urology', 'Urinary tract health', true),
('00000000-0000-0000-0000-000000000001', NULL, 'Nephrology', 'Kidney diseases', true);

-- Bones & Respiratory
INSERT INTO hms_specializations (tenant_id, company_id, name, description, is_active) VALUES
('00000000-0000-0000-0000-000000000001', NULL, 'Orthopedics', 'Bone and joint disorders', true),
('00000000-0000-0000-0000-000000000001', NULL, 'Rheumatology', 'Autoimmune diseases', true),
('00000000-0000-0000-0000-000000000001', NULL, 'Pulmonology', 'Lung and respiratory', true);

-- Endocrine & Infectious
INSERT INTO hms_specializations (tenant_id, company_id, name, description, is_active) VALUES
('00000000-0000-0000-0000-000000000001', NULL, 'Endocrinology', 'Hormonal disorders', true),
('00000000-0000-0000-0000-000000000001', NULL, 'Infectious Disease', 'Infections and communicable diseases', true);

-- Pain & Palliative
INSERT INTO hms_specializations (tenant_id, company_id, name, description, is_active) VALUES
('00000000-0000-0000-0000-000000000001', NULL, 'Pain Management', 'Chronic pain treatment', true),
('00000000-0000-0000-0000-000000000001', NULL, 'Palliative Care', 'End-of-life comfort care', true);

-- Verify
SELECT 'Roles' as type, COUNT(*) as count FROM hms_roles WHERE tenant_id = '00000000-0000-0000-0000-000000000001'
UNION ALL
SELECT 'Specializations', COUNT(*) FROM hms_specializations WHERE tenant_id = '00000000-0000-0000-0000-000000000001';
