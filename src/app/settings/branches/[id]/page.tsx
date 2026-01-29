
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { notFound, redirect } from "next/navigation"
import EditBranchForm from "./edit-branch-form"

export default async function EditBranchPage({ params }: { params: { id: string } }) {
    const session = await auth()
    if (!session?.user?.id) redirect('/login')

    const branch = await prisma.hms_branch.findUnique({
        where: {
            id: params.id,
            company_id: session.user.companyId
        }
    })

    if (!branch) notFound()

    return (
        <EditBranchForm branch={branch} />
    )
}
