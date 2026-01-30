
import { getDesignation } from "@/app/actions/settings"
import { EditDesignationForm } from "./edit-form"
import { notFound } from "next/navigation"

export const dynamic = 'force-dynamic'

export default async function EditDesignationPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const designation = await getDesignation(params.id)

    if (!designation) {
        notFound()
    }

    return <EditDesignationForm designation={designation} />
}
