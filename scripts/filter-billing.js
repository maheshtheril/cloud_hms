
const fs = require('fs');
const data = JSON.parse(fs.readFileSync('all_arrays.json', 'utf8'));

const billingTables = ['hms_invoice', 'hms_invoice_lines', 'hms_invoice_payments', 'hms_patient', 'hms_appointments', 'hms_encounter'];

data.forEach(col => {
    if (billingTables.includes(col.table_name)) {
        console.log(`${col.table_name}.${col.column_name} (${col.udt_name}) DEFAULT: ${col.column_default}`);
    }
});
