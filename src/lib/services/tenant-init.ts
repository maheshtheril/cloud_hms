import { prisma } from "@/lib/prisma";
import { internalSeedUOMs } from "@/app/actions/uom";

export async function initializeTenantMasters(tenantId: string, companyId: string) {
    console.log(`[TenantInit] Initializing masters for Tenant: ${tenantId}, Company: ${companyId}`);

    try {
        // 0. Seed Standard Departments (World-Class Comprehensive List)
        const deptCount = await prisma.hms_departments.count({
            where: { company_id: companyId }
        });

        if (deptCount === 0) {
            const standardDepartments = [
                { name: 'Emergency & Trauma', code: 'ER', description: '24/7 emergency care' },
                { name: 'Outpatient (OPD)', code: 'OPD', description: 'Outpatient consultations' },
                { name: 'Inpatient (IPD)', code: 'IPD', description: 'In-patient wards' },
                { name: 'Critical Care (ICU)', code: 'ICU', description: 'Critical care' },
                { name: 'Operation Theatre', code: 'OT', description: 'Surgical procedures' },
                { name: 'Radiological Imaging', code: 'RAD', description: 'Medical imaging' },
                { name: 'Pathology Lab', code: 'PATH', description: 'Laboratory diagnostics' },
                { name: 'Central Pharmacy', code: 'PHAR', description: 'Medication dispensing' },
                { name: 'General Medicine', code: 'GENMED', description: 'Internal Medicine' },
                { name: 'Pediatrics', code: 'PED', description: 'Child care' },
                { name: 'Obstetrics & Gynae', code: 'OBGYN', description: 'Women care' },
                { name: 'Cardiology', code: 'CARD', description: 'Heart care' }
            ];

            await prisma.hms_departments.createMany({
                data: standardDepartments.map(dept => ({
                    id: crypto.randomUUID(),
                    tenant_id: tenantId,
                    company_id: companyId,
                    name: dept.name,
                    code: dept.code,
                    description: dept.description,
                    is_active: true
                }))
            });
            console.log('[TenantInit] Seeded 12 Standard Departments');
        }

        // 1. Seed UOMs (Crucial for inventory/billing)
        await internalSeedUOMs(tenantId, companyId);
        console.log('[TenantInit] Seeded UOMs');

        // 2. Seed Default Stock Location (Professional Standard)
        const locationCount = await prisma.hms_stock_location.count({
            where: { company_id: companyId }
        });

        if (locationCount === 0) {
            await prisma.hms_stock_location.create({
                data: {
                    id: crypto.randomUUID(),
                    tenant_id: tenantId,
                    company_id: companyId,
                    code: 'MAIN',
                    name: 'Main Store',
                    location_type: 'warehouse',
                    metadata: { is_default: true }
                }
            });
            console.log('[TenantInit] Seeded Default Stock Location');
        }

        // 3. Seed Standard HMS Roles (Physician, Nurse, etc. - in addition to RBAC roles)
        const roleCount = await prisma.hms_roles.count({
            where: { tenant_id: tenantId }
        });

        if (roleCount === 0) {
            const standardRoles = [
                "Physician", "Surgeon", "Nurse", "Radiologist",
                "Pathologist", "Anesthesiologist", "Physiotherapist",
                "Pharmacist", "Lab Technician", "Administrative Specialist"
            ];

            await prisma.hms_roles.createMany({
                data: standardRoles.map(name => ({
                    id: crypto.randomUUID(),
                    tenant_id: tenantId,
                    company_id: companyId,
                    name,
                    is_clinical: true,
                    is_active: true
                }))
            });
            console.log('[TenantInit] Seeded Standard HMS Roles');
        }

        // 4. Seed Standard Specializations
        const specCount = await prisma.hms_specializations.count({
            where: { tenant_id: tenantId }
        });

        if (specCount === 0) {
            const standardSpecs = [
                "Cardiology", "Neurology", "Pediatrics", "Orthopedics",
                "Gastroenterology", "Dermatology", "Psychiatry",
                "Ophthalmology", "ENT", "Oncology", "Urology", "Nephrology"
            ];

            await prisma.hms_specializations.createMany({
                data: standardSpecs.map(name => ({
                    id: crypto.randomUUID(),
                    tenant_id: tenantId,
                    company_id: companyId,
                    name,
                    is_active: true
                }))
            });
            console.log('[TenantInit] Seeded Standard Specializations');
        }

        // 5. Seed Placeholder Manufacturers
        const mfgCount = await prisma.hms_manufacturer.count({
            where: { company_id: companyId }
        });

        if (mfgCount === 0) {
            const commonMfgs = ["Pfizer", "Novartis", "Roche", "Merck", "GSK", "Sanofi", "AstraZeneca"];
            await prisma.hms_manufacturer.createMany({
                data: commonMfgs.map(name => ({
                    id: crypto.randomUUID(),
                    tenant_id: tenantId,
                    company_id: companyId,
                    name: name,
                    is_active: true
                }))
            });
            console.log('[TenantInit] Seeded Placeholder Manufacturers');
        }

        return { success: true };
    } catch (error) {
        console.error('[TenantInit] Critical failure during master seeding:', error);
        // We don't throw here to avoid blocking signup, 
        // but in a world-class system we might want to log this for manual intervention
        return { success: false, error };
    }
}
