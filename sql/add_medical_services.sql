-- Add Common Medical Services to hms_product
-- These are non-stock items (consultations, lab tests, procedures)
-- Run this after replacing :tenant_id and :company_id with actual values

-- CONSULTATION FEES
INSERT INTO hms_product (
    id, tenant_id, company_id, sku, name, description, 
    price, cost, uom, is_service, track_inventory, 
    is_active, created_at, updated_at
)
VALUES 
-- Regular Consultation
(gen_random_uuid(), :tenant_id, :company_id, 'SRV-CONSULT', 'Consultation Fee', 
 'General consultation with doctor', 
 500.00, 0, 'Service', true, false, 
 true, NOW(), NOW()),

-- Follow-up Visit
(gen_random_uuid(), :tenant_id, :company_id, 'SRV-FOLLOWUP', 'Follow-up Visit', 
 'Follow-up consultation within 15 days', 
 300.00, 0, 'Service', true, false, 
 true, NOW(), NOW()),

-- Emergency Consultation
(gen_random_uuid(), :tenant_id, :company_id, 'SRV-EMERGENCY', 'Emergency Consultation', 
 'Emergency/After hours consultation', 
 1000.00, 0, 'Service', true, false, 
 true, NOW(), NOW()),

-- Specialist Consultation
(gen_random_uuid(), :tenant_id, :company_id, 'SRV-SPECIALIST', 'Specialist Consultation', 
 'Consultation with specialist doctor', 
 1500.00, 0, 'Service', true, false, 
 true, NOW(), NOW());

-- LAB TESTS (PATHOLOGY)
INSERT INTO hms_product (
    id, tenant_id, company_id, sku, name, description, 
    price, cost, uom, is_service, track_inventory, 
    is_active, created_at, updated_at
)
VALUES 
-- Blood Tests
(gen_random_uuid(), :tenant_id, :company_id, 'LAB-CBC', 'CBC (Complete Blood Count)', 
 'Full blood count test', 
 800.00, 0, 'Test', true, false, 
 true, NOW(), NOW()),

(gen_random_uuid(), :tenant_id, :company_id, 'LAB-SUGAR', 'Blood Sugar Test', 
 'Fasting/Random blood glucose test', 
 150.00, 0, 'Test', true, false, 
 true, NOW(), NOW()),

(gen_random_uuid(), :tenant_id, :company_id, 'LAB-HBA1C', 'HbA1c Test', 
 'Glycated hemoglobin test', 
 600.00, 0, 'Test', true, false, 
 true, NOW(), NOW()),

(gen_random_uuid(), :tenant_id, :company_id, 'LAB-LIPID', 'Lipid Profile', 
 'Complete cholesterol panel', 
 900.00, 0, 'Test', true, false, 
 true, NOW(), NOW()),

(gen_random_uuid(), :tenant_id, :company_id, 'LAB-LFT', 'Liver Function Test (LFT)', 
 'Complete liver function panel', 
 1200.00, 0, 'Test', true, false, 
 true, NOW(), NOW()),

(gen_random_uuid(), :tenant_id, :company_id, 'LAB-KFT', 'Kidney Function Test (KFT)', 
 'Renal function panel', 
 1100.00, 0, 'Test', true, false, 
 true, NOW(), NOW()),

(gen_random_uuid(), :tenant_id, :company_id, 'LAB-THYROID', 'Thyroid Profile', 
 'T3, T4, TSH tests', 
 700.00, 0, 'Test', true, false, 
 true, NOW(), NOW()),

-- Urine/Stool Tests
(gen_random_uuid(), :tenant_id, :company_id, 'LAB-URINE', 'Urine Routine Test', 
 'Complete urine analysis', 
 200.00, 0, 'Test', true, false, 
 true, NOW(), NOW()),

(gen_random_uuid(), :tenant_id, :company_id, 'LAB-STOOL', 'Stool Test', 
 'Stool routine and microscopy', 
 250.00, 0, 'Test', true, false, 
 true, NOW(), NOW());

-- LAB TESTS (RADIOLOGY/IMAGING)
INSERT INTO hms_product (
    id, tenant_id, company_id, sku, name, description, 
    price, cost, uom, is_service, track_inventory, 
    is_active, created_at, updated_at
)
VALUES 
-- X-Rays
(gen_random_uuid(), :tenant_id, :company_id, 'LAB-XRAY-CHEST', 'X-Ray Chest', 
 'Chest X-ray (PA view)', 
 600.00, 0, 'Test', true, false, 
 true, NOW(), NOW()),

(gen_random_uuid(), :tenant_id, :company_id, 'LAB-XRAY-ABD', 'X-Ray Abdomen', 
 'Abdominal X-ray', 
 700.00, 0, 'Test', true, false, 
 true, NOW(), NOW()),

-- Ultrasound
(gen_random_uuid(), :tenant_id, :company_id, 'LAB-USG-ABD', 'USG Abdomen', 
 'Ultrasound complete abdomen', 
 1500.00, 0, 'Test', true, false, 
 true, NOW(), NOW()),

(gen_random_uuid(), :tenant_id, :company_id, 'LAB-USG-PELVIS', 'USG Pelvis', 
 'Pelvic ultrasound', 
 1200.00, 0, 'Test', true, false, 
 true, NOW(), NOW()),

-- ECG/Echo
(gen_random_uuid(), :tenant_id, :company_id, 'LAB-ECG', 'ECG', 
 'Electrocardiogram test', 
 300.00, 0, 'Test', true, false, 
 true, NOW(), NOW()),

(gen_random_uuid(), :tenant_id, :company_id, 'LAB-ECHO', 'Echocardiography', 
 '2D Echo with doppler', 
 2000.00, 0, 'Test', true, false, 
 true, NOW(), NOW()),

-- CT/MRI Scans
(gen_random_uuid(), :tenant_id, :company_id, 'LAB-CT-HEAD', 'CT Scan Head', 
 'CT scan of brain', 
 3500.00, 0, 'Test', true, false, 
 true, NOW(), NOW()),

(gen_random_uuid(), :tenant_id, :company_id, 'LAB-MRI-BRAIN', 'MRI Brain', 
 'MRI scan of brain', 
 6000.00, 0, 'Test', true, false, 
 true, NOW(), NOW());

-- PROCEDURES
INSERT INTO hms_product (
    id, tenant_id, company_id, sku, name, description, 
    price, cost, uom, is_service, track_inventory, 
    is_active, created_at, updated_at
)
VALUES 
-- Injections/IV
(gen_random_uuid(), :tenant_id, :company_id, 'PROC-INJ-IM', 'IM Injection', 
 'Intramuscular injection', 
 100.00, 0, 'Service', true, false, 
 true, NOW(), NOW()),

(gen_random_uuid(), :tenant_id, :company_id, 'PROC-INJ-IV', 'IV Injection', 
 'Intravenous injection', 
 150.00, 0, 'Service', true, false, 
 true, NOW(), NOW()),

(gen_random_uuid(), :tenant_id, :company_id, 'PROC-IV-FLUID', 'IV Fluid/Drip', 
 'Intravenous fluid administration', 
 500.00, 0, 'Service', true, false, 
 true, NOW(), NOW()),

-- Wound Care
(gen_random_uuid(), :tenant_id, :company_id, 'PROC-DRESS-SIMPLE', 'Simple Dressing', 
 'Simple wound dressing', 
 200.00, 0, 'Service', true, false, 
 true, NOW(), NOW()),

(gen_random_uuid(), :tenant_id, :company_id, 'PROC-DRESS-COMPLEX', 'Complex Dressing', 
 'Complex wound dressing', 
 500.00, 0, 'Service', true, false, 
 true, NOW(), NOW()),

(gen_random_uuid(), :tenant_id, :company_id, 'PROC-SUTURE', 'Suturing/Stitching', 
 'Wound suturing', 
 800.00, 0, 'Service', true, false, 
 true, NOW(), NOW()),

-- Other Procedures
(gen_random_uuid(), :tenant_id, :company_id, 'PROC-NEB', 'Nebulization', 
 'Nebulizer therapy', 
 150.00, 0, 'Service', true, false, 
 true, NOW(), NOW()),

(gen_random_uuid(), :tenant_id, :company_id, 'PROC-CATHETER', 'Catheterization', 
 'Urinary catheter insertion', 
 400.00, 0, 'Service', true, false, 
 true, NOW(), NOW()),

(gen_random_uuid(), :tenant_id, :company_id, 'PROC-OXYGEN', 'Oxygen Therapy (per hour)', 
 'Oxygen therapy', 
 100.00, 0, 'Service', true, false, 
 true, NOW(), NOW());

-- ROOM/BED CHARGES
INSERT INTO hms_product (
    id, tenant_id, company_id, sku, name, description, 
    price, cost, uom, is_service, track_inventory, 
    is_active, created_at, updated_at
)
VALUES 
(gen_random_uuid(), :tenant_id, :company_id, 'ROOM-GEN', 'General Ward (per day)', 
 'General ward bed charge', 
 1500.00, 0, 'Day', true, false, 
 true, NOW(), NOW()),

(gen_random_uuid(), :tenant_id, :company_id, 'ROOM-SEMI', 'Semi-Private Room (per day)', 
 'Semi-private room bed charge', 
 2500.00, 0, 'Day', true, false, 
 true, NOW(), NOW()),

(gen_random_uuid(), :tenant_id, :company_id, 'ROOM-PRIV', 'Private Room (per day)', 
 'Private room bed charge', 
 3500.00, 0, 'Day', true, false, 
 true, NOW(), NOW()),

(gen_random_uuid(), :tenant_id, :company_id, 'ROOM-ICU', 'ICU (per day)', 
 'Intensive care unit charge', 
 5000.00, 0, 'Day', true, false, 
 true, NOW(), NOW()),

(gen_random_uuid(), :tenant_id, :company_id, 'ROOM-NICU', 'NICU (per day)', 
 'Neonatal ICU charge', 
 6000.00, 0, 'Day', true, false, 
 true, NOW(), NOW());

-- MISCELLANEOUS
INSERT INTO hms_product (
    id, tenant_id, company_id, sku, name, description, 
    price, cost, uom, is_service, track_inventory, 
    is_active, created_at, updated_at
)
VALUES 
(gen_random_uuid(), :tenant_id, :company_id, 'MISC-AMBULANCE', 'Ambulance Service', 
 'Emergency ambulance charge', 
 2000.00, 0, 'Service', true, false, 
 true, NOW(), NOW()),

(gen_random_uuid(), :tenant_id, :company_id, 'MISC-REGISTRATION', 'Registration Fee', 
 'New patient registration', 
 200.00, 0, 'Service', true, false, 
 true, NOW(), NOW()),

(gen_random_uuid(), :tenant_id, :company_id, 'MISC-MEDICAL-CERT', 'Medical Certificate', 
 'Medical fitness certificate', 
 100.00, 0, 'Service', true, false, 
 true, NOW(), NOW()),

(gen_random_uuid(), :tenant_id, :company_id, 'MISC-REPORT-COPY', 'Report Copy', 
 'Duplicate report copy', 
 50.00, 0, 'Service', true, false, 
 true, NOW(), NOW());

-- Verify insertion
SELECT COUNT(*) as total_services FROM hms_product WHERE is_service = true;
