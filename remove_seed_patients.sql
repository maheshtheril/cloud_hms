-- Remove seed patient data that is causing duplicate patients for new tenants
-- These are hardcoded patient records from the schema dump

-- Option 1: Delete the specific seed patients
DELETE FROM public.hms_patient 
WHERE id IN (
    '9c23da47-b7c4-48cf-99e1-f00aeb81fd4d',
    '959f2ae6-c68f-4501-84e3-5f4d944fcf9f'
);

-- Option 2: If you want to delete all patients from the old seed tenant
-- DELETE FROM public.hms_patient WHERE tenant_id = 'b69b3952-f737-4295-80de-f1dd3c275020';
