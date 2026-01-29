
'use server'

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

export async function createEmployee(data: {
    first_name: string;
    last_name?: string;
    email?: string;
    phone?: string;
    designation_id?: string;
    branch_id?: string;
    status?: string;
}) {
    const session = await auth();
    if (!session?.user?.id || !session.user.tenantId) {
        return { error: "Unauthorized" };
    }

    try {
        const employeeId = crypto.randomUUID();

        const employee = await prisma.crm_employee.create({
            data: {
                id: employeeId,
                tenant_id: session.user.tenantId,
                company_id: session.user.companyId,
                first_name: data.first_name,
                last_name: data.last_name,
                email: data.email,
                phone: data.phone,
                designation_id: data.designation_id || undefined,
                branch_id: data.branch_id || undefined,
                status: data.status || 'active'
            }
        });

        revalidatePath('/crm/employees');
        return { success: true, employeeId: employee.id };
    } catch (error: any) {
        console.error("Failed to create employee:", error);
        if (error.code === 'P2002') {
            return { error: "An employee with this email already exists." };
        }
        return { error: "Failed to create employee record." };
    }
}

export async function getEmployeeMasters() {
    const session = await auth();
    if (!session?.user?.id || !session.user.tenantId) return { error: "Unauthorized" };

    try {
        const companyId = session.user.companyId;
        if (!companyId) return { success: true, designations: [], branches: [] };

        const [designations, branches] = await Promise.all([
            prisma.crm_designation.findMany({
                where: { tenant_id: session.user.tenantId, is_active: true },
                orderBy: { name: 'asc' }
            }),
            prisma.hms_branch.findMany({
                where: { company_id: companyId, is_active: true },
                orderBy: { name: 'asc' }
            })
        ]);

        return { success: true, designations, branches };
    } catch (error) {
        return { error: "Failed to fetch master data" };
    }
}
