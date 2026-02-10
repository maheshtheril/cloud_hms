
import { getEmployee, getEmployeeMasters } from "@/app/actions/crm/employees"
import { EditEmployeeForm } from "./edit-form"
import { notFound } from "next/navigation"

export const dynamic = 'force-dynamic'

export default async function EditEmployeePage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const [employee, masters] = await Promise.all([
        getEmployee(params.id),
        getEmployeeMasters()
    ])

    if (!employee) {
        notFound()
    }

    return (
        <EditEmployeeForm
            employee={employee}
            designations={masters.designations || []}
            branches={masters.branches || []}
            departments={masters.departments || []}
            supervisors={masters.supervisors || []}
        />
    )
}
