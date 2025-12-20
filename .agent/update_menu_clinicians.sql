-- Update menu label from "Doctors" to "Clinicians"
UPDATE menu_items
SET 
    label = 'Clinicians',
    key = 'hms-clinicians'
WHERE key = 'hms-doctors' OR url = '/hms/doctors';

-- Verify the update
SELECT id, key, label, url FROM menu_items WHERE url = '/hms/doctors';
