
DO $$
DECLARE
    v_tenant_id uuid;
    v_company_id uuid;
BEGIN
    -- Get active company
    SELECT tenant_id, company_id INTO v_tenant_id, v_company_id
    FROM company_profiles
    WHERE is_active = true
    LIMIT 1;

    IF v_company_id IS NULL THEN
        RAISE NOTICE 'No active company found';
        RETURN;
    END IF;

    -- Insert Lab Products
    -- CBC
    IF NOT EXISTS (SELECT 1 FROM hms_product WHERE sku = 'LAB001' AND company_id = v_company_id) THEN
        INSERT INTO hms_product (
            id, tenant_id, company_id, sku, name, description, is_service, is_stockable, uom, price, currency, is_active, metadata
        ) VALUES (
            gen_random_uuid(), v_tenant_id, v_company_id, 'LAB001', 'Complete Blood Count (CBC)', 'Hemogram, TLC, DLC, Platelets', true, false, 'TEST', 450, 'INR', true, '{"type": "lab_test", "tax_exempt": true}'
        );
    END IF;

    -- Lipid Profile
    IF NOT EXISTS (SELECT 1 FROM hms_product WHERE sku = 'LAB002' AND company_id = v_company_id) THEN
        INSERT INTO hms_product (
            id, tenant_id, company_id, sku, name, description, is_service, is_stockable, uom, price, currency, is_active, metadata
        ) VALUES (
            gen_random_uuid(), v_tenant_id, v_company_id, 'LAB002', 'Lipid Profile', 'Cholesterol, Triglycerides, HDL, LDL', true, false, 'TEST', 900, 'INR', true, '{"type": "lab_test", "tax_exempt": true}'
        );
    END IF;

    -- LFT
    IF NOT EXISTS (SELECT 1 FROM hms_product WHERE sku = 'LAB003' AND company_id = v_company_id) THEN
        INSERT INTO hms_product (
            id, tenant_id, company_id, sku, name, description, is_service, is_stockable, uom, price, currency, is_active, metadata
        ) VALUES (
            gen_random_uuid(), v_tenant_id, v_company_id, 'LAB003', 'Liver Function Test (LFT)', 'Bilirubin, SGOT, SGPT, ALP', true, false, 'TEST', 850, 'INR', true, '{"type": "lab_test", "tax_exempt": true}'
        );
    END IF;

    -- KFT
    IF NOT EXISTS (SELECT 1 FROM hms_product WHERE sku = 'LAB004' AND company_id = v_company_id) THEN
        INSERT INTO hms_product (
            id, tenant_id, company_id, sku, name, description, is_service, is_stockable, uom, price, currency, is_active, metadata
        ) VALUES (
            gen_random_uuid(), v_tenant_id, v_company_id, 'LAB004', 'Kidney Function Test (KFT)', 'Urea, Creatinine, Uric Acid', true, false, 'TEST', 950, 'INR', true, '{"type": "lab_test", "tax_exempt": true}'
        );
    END IF;

    -- Thyroid
    IF NOT EXISTS (SELECT 1 FROM hms_product WHERE sku = 'LAB005' AND company_id = v_company_id) THEN
        INSERT INTO hms_product (
            id, tenant_id, company_id, sku, name, description, is_service, is_stockable, uom, price, currency, is_active, metadata
        ) VALUES (
            gen_random_uuid(), v_tenant_id, v_company_id, 'LAB005', 'Thyroid Profile (T3, T4, TSH)', 'Thyroid Function Test', true, false, 'TEST', 1200, 'INR', true, '{"type": "lab_test", "tax_exempt": true}'
        );
    END IF;

    -- HbA1c
    IF NOT EXISTS (SELECT 1 FROM hms_product WHERE sku = 'LAB006' AND company_id = v_company_id) THEN
        INSERT INTO hms_product (
            id, tenant_id, company_id, sku, name, description, is_service, is_stockable, uom, price, currency, is_active, metadata
        ) VALUES (
            gen_random_uuid(), v_tenant_id, v_company_id, 'LAB006', 'HbA1c (Glycosylated Hemoglobin)', '3 Month Average Blood Sugar', true, false, 'TEST', 600, 'INR', true, '{"type": "lab_test", "tax_exempt": true}'
        );
    END IF;

    -- Blood Sugar Fasting
    IF NOT EXISTS (SELECT 1 FROM hms_product WHERE sku = 'LAB007' AND company_id = v_company_id) THEN
        INSERT INTO hms_product (
            id, tenant_id, company_id, sku, name, description, is_service, is_stockable, uom, price, currency, is_active, metadata
        ) VALUES (
            gen_random_uuid(), v_tenant_id, v_company_id, 'LAB007', 'Blood Sugar (Fasting)', 'Glucose - Fasting', true, false, 'TEST', 150, 'INR', true, '{"type": "lab_test", "tax_exempt": true}'
        );
    END IF;

     -- Blood Sugar PP
    IF NOT EXISTS (SELECT 1 FROM hms_product WHERE sku = 'LAB008' AND company_id = v_company_id) THEN
        INSERT INTO hms_product (
            id, tenant_id, company_id, sku, name, description, is_service, is_stockable, uom, price, currency, is_active, metadata
        ) VALUES (
            gen_random_uuid(), v_tenant_id, v_company_id, 'LAB008', 'Blood Sugar (PP)', 'Glucose - Post Prandial', true, false, 'TEST', 150, 'INR', true, '{"type": "lab_test", "tax_exempt": true}'
        );
    END IF;

     -- Urine
    IF NOT EXISTS (SELECT 1 FROM hms_product WHERE sku = 'LAB009' AND company_id = v_company_id) THEN
        INSERT INTO hms_product (
            id, tenant_id, company_id, sku, name, description, is_service, is_stockable, uom, price, currency, is_active, metadata
        ) VALUES (
            gen_random_uuid(), v_tenant_id, v_company_id, 'LAB009', 'Urine Routine & Microscopy', 'Urine R/M', true, false, 'TEST', 200, 'INR', true, '{"type": "lab_test", "tax_exempt": true}'
        );
    END IF;

     -- Vitamin D
    IF NOT EXISTS (SELECT 1 FROM hms_product WHERE sku = 'LAB010' AND company_id = v_company_id) THEN
        INSERT INTO hms_product (
            id, tenant_id, company_id, sku, name, description, is_service, is_stockable, uom, price, currency, is_active, metadata
        ) VALUES (
            gen_random_uuid(), v_tenant_id, v_company_id, 'LAB010', 'Vitamin D Total', '25-Hydroxy Vitamin D', true, false, 'TEST', 1800, 'INR', true, '{"type": "lab_test", "tax_exempt": true}'
        );
    END IF;
    
    RAISE NOTICE 'Lab products seeded successfully.';
END $$;
