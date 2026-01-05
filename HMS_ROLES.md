
# 🏥 Hospital Management System (HMS) - Standard Roles & Permissions

This document outlines the standard user roles and their associated permissions configured in the system. These roles follow industry best practices for segregating duties in a healthcare environment.

## 👥 User Roles

### 1. Super Admin
*   **Description**: Complete access to all system features, configuration, and tenant management.
*   **Key Privileges**: Full System Access (`*`).

### 2. Hospital Admin
*   **Description**: Manages hospital-wide operations, user accounts, master settings, and high-level reporting.
*   **Permissions**:
    *   `dashboard.view`: View administrative dashboards.
    *   `user.manage`: Create and manage staff accounts and roles.
    *   `billing.manage`, `inventory.manage`: Full control over financial and stock modules.
    *   `report.view_financial`: Access content-sensitive financial reports.

### 3. Doctor / Physician
*   **Description**: Clinical staff responsible for patient care, diagnosis, and treatment planning.
*   **Permissions**:
    *   `clinical.*`: Comprehensive access to clinical modules (EMR).
    *   `appointment.view`, `appointment.edit`: Manage own schedule.
    *   `clinical.prescription.create`: Issue e-prescriptions.
    *   `lab.order.create`, `imaging.order.create`: Request diagnostic tests.
    *   `patient.view`: Access full patient history.

### 4. Nurse
*   **Description**: Nursing staff responsible for triage, vitals, medication administration, and patient monitoring.
*   **Permissions**:
    *   `clinical.vitals.*`: Record and monitor patient vitals.
    *   `clinical.triage.create`: Perform initial patient assessment.
    *   `clinical.medication.administer`: Update Medication Administration Records (MAR).
    *   `patient.view`: View patient summaries and care plans.

### 5. Pharmacist
*   **Description**: Manages the pharmacy, dispense medications, and controls inventory.
*   **Permissions**:
    *   `pharmacy.dispense`: Process prescriptions.
    *   `inventory.view`, `inventory.adjust`: Manage drug stock levels.
    *   `billing.invoice.create`: Generate bills for over-the-counter sales.

### 6. Lab Technician
*   **Description**: Responsible for processing diagnostic tests and entering results.
*   **Permissions**:
    *   `lab.order.view`: View pending lab requests.
    *   `lab.sample.collect`: Manage sample collection and barcoding.
    *   `lab.result.enter`, `lab.result.verify`: Input and finalize test results.

### 7. Receptionist / Front Desk
*   **Description**: First point of contact. Manages scheduling, registration, and basic billing.
*   **Permissions**:
    *   `appointment.create`, `appointment.edit`: Manage patient bookings.
    *   `patient.create`, `patient.edit_demographics`: Register new patients.
    *   `billing.invoice.create`: Collect registration fees and initial payments.

### 8. Accountant
*   **Description**: Manages back-office financial operations.
*   **Permissions**:
    *   `accounting.*`: Full access to the general ledger, journals, and COA.
    *   `billing.manage`: Oversee invoicing and insurance claims.
    *   `inventory.valuation.view`: View stock valuation reports.

### 9. Patient
*   **Description**: External user role for the Patient Portal.
*   **Permissions**:
    *   `portal.access`: Log in to the patient portal.
    *   `records.view_self`: View personal health records.
    *   `appointment.create_self`: Request appointments.

## 🛠️ Managing Permissions
Roles and permissions are managed in the `hms_role` and `hms_role_permissions` tables. To update or extend these roles, you can modify `prisma/seed-roles.ts` and re-run the seeding command:

```bash
npx tsx prisma/seed-roles.ts
```
