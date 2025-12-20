-- Test Script: Appointment to Billing Integration
-- Run these queries to set up test data for the billing integration

-- Step 1: Find a test appointment (replace with your actual appointment ID)
SELECT 
    id as appointment_id,
    patient_id,
    clinician_id,
    department_id,
    starts_at,
    status
FROM hms_appointments
WHERE status = 'scheduled'
LIMIT 1;

-- Step 2: Add a consultation fee billing rule for a clinician
-- Replace 'YOUR_TENANT_ID', 'YOUR_COMPANY_ID', and 'YOUR_CLINICIAN_ID' with actual values
INSERT INTO hms_billing_rule (
    tenant_id,
    company_id,
    applies_to,
    applies_to_id,
    billing_code,
    price,
    metadata
)
VALUES (
    'YOUR_TENANT_ID',
    'YOUR_COMPANY_ID',
    'clinician',
    'YOUR_CLINICIAN_ID', -- From the appointment above
    'CONSULT',
    500.00,
    '{"description": "General Consultation"}'
)
ON CONFLICT DO NOTHING;

-- Step 3: Add sample appointment services
-- Replace 'YOUR_APPOINTMENT_ID' with the appointment ID from Step 1
INSERT INTO hms_appointment_services (
    tenant_id,
    appointment_id,
    service_id,
    qty,
    unit_price,
    total_price,
    notes
)
VALUES 
    (
        'YOUR_TENANT_ID',
        'YOUR_APPOINTMENT_ID',
        NULL, -- No specific service ID
        1,
        200.00,
        200.00,
        'ECG Test'
    ),
    (
        'YOUR_TENANT_ID',
        'YOUR_APPOINTMENT_ID',
        NULL,
        1,
        150.00,
        150.00,
        'Blood Pressure Monitoring'
    )
ON CONFLICT DO NOTHING;

-- Step 4: Create a lab order linked to the appointment's patient
-- Replace 'YOUR_PATIENT_ID' with the patient ID from Step 1
INSERT INTO hms_lab_order (
    tenant_id,
    company_id,
    order_number,
    patient_id,
    encounter_id,
    ordered_by,
    ordered_at,
    status,
    priority,
    clinical_notes
)
VALUES (
    'YOUR_TENANT_ID',
    'YOUR_COMPANY_ID',
    'LAB-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-001',
    'YOUR_PATIENT_ID',
    NULL,
    'YOUR_CLINICIAN_ID',
    NOW(),
    'requested',
    'routine',
    'Ordered during appointment'
)
RETURNING id;

-- Step 5: Add lab test lines to the order
-- Replace 'YOUR_LAB_ORDER_ID' with the ID returned from Step 4
-- First, find a test in your system
SELECT id, name, code FROM hms_lab_test LIMIT 5;

-- Then insert the order lines
INSERT INTO hms_lab_order_lines (
    tenant_id,
    company_id,
    order_id,
    test_id,
    requested_code,
    requested_name,
    price,
    status
)
VALUES 
    (
        'YOUR_TENANT_ID',
        'YOUR_COMPANY_ID',
        'YOUR_LAB_ORDER_ID',
        'YOUR_TEST_ID_1', -- From the query above
        'CBC',
        'Complete Blood Count',
        800.00,
        'pending'
    ),
    (
        'YOUR_TENANT_ID',
        'YOUR_COMPANY_ID',
        'YOUR_LAB_ORDER_ID',
        'YOUR_TEST_ID_2',
        'XRAY',
        'Chest X-Ray',
        600.00,
        'pending'
    )
ON CONFLICT DO NOTHING;

-- Step 6: Verify the data
-- Check that everything is linked correctly
SELECT 
    a.id as appointment_id,
    a.patient_id,
    a.clinician_id,
    a.starts_at,
    p.first_name || ' ' || p.last_name as patient_name,
    c.first_name || ' ' || c.last_name as doctor_name,
    br.price as consultation_fee,
    COUNT(DISTINCT aps.id) as service_count,
    COUNT(DISTINCT lol.id) as lab_test_count
FROM hms_appointments a
LEFT JOIN hms_patient p ON a.patient_id = p.id
LEFT JOIN hms_clinicians c ON a.clinician_id = c.id
LEFT JOIN hms_billing_rule br ON br.applies_to_id = a.clinician_id AND br.applies_to = 'clinician'
LEFT JOIN hms_appointment_services aps ON aps.appointment_id = a.id
LEFT JOIN hms_lab_order lo ON lo.patient_id = a.patient_id 
    AND lo.ordered_at BETWEEN (a.starts_at - INTERVAL '24 hours') AND (a.starts_at + INTERVAL '24 hours')
LEFT JOIN hms_lab_order_lines lol ON lol.order_id = lo.id
WHERE a.id = 'YOUR_APPOINTMENT_ID'
GROUP BY a.id, a.patient_id, a.clinician_id, a.starts_at, p.first_name, p.last_name, c.first_name, c.last_name, br.price;

-- Expected result should show:
-- - Appointment details
-- - Patient and doctor names
-- - Consultation fee (500.00)
-- - 2 services
-- - 2 lab tests

-- Step 7: Test the API endpoint
-- In your browser console or using curl:
/*
fetch('/api/appointments/YOUR_APPOINTMENT_ID')
  .then(r => r.json())
  .then(data => console.log('API Response:', data))
*/

-- Or use curl:
-- curl -X GET http://localhost:3000/api/appointments/YOUR_APPOINTMENT_ID

-- Expected API response:
/*
{
  "success": true,
  "appointment": {
    "id": "...",
    "patient_id": "...",
    "consultation_fee": 500,
    "services": [
      { "description": "ECG Test", "unit_price": 200 },
      { "description": "Blood Pressure Monitoring", "unit_price": 150 }
    ],
    "lab_tests": [
      { "test_name": "Complete Blood Count", "test_fee": 800 },
      { "test_name": "Chest X-Ray", "test_fee": 600 }
    ]
  }
}
*/

-- Step 8: Test the complete flow
-- 1. Navigate to: /hms/appointments/YOUR_APPOINTMENT_ID
-- 2. Click "Bill This Visit"
-- 3. Should redirect to: /hms/billing/new?patientId=...&appointmentId=...
-- 4. Invoice should auto-populate with:
--    - Patient pre-selected
--    - Consultation Fee (₹500)
--    - ECG Test (₹200)
--    - Blood Pressure Monitoring (₹150)
--    - CBC Test (₹800)
--    - X-Ray Test (₹600)
--    Total before tax: ₹2,250

-- Clean up test data (if needed):
/*
DELETE FROM hms_lab_order_lines WHERE order_id = 'YOUR_LAB_ORDER_ID';
DELETE FROM hms_lab_order WHERE id = 'YOUR_LAB_ORDER_ID';
DELETE FROM hms_appointment_services WHERE appointment_id = 'YOUR_APPOINTMENT_ID';
DELETE FROM hms_billing_rule WHERE applies_to_id = 'YOUR_CLINICIAN_ID' AND billing_code = 'CONSULT';
*/
