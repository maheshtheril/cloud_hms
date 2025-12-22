'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function importLeads(formData: FormData) {
    try {
        console.log("Importing leads...")
        const session = await auth();

        if (!session?.user?.id || !session?.user.tenantId) {
            console.error("No session found")
            return { error: 'Unauthorized' }
        }

        const file = formData.get('file');

        // Check if file is a File object (standard upload) or a Data URI string (base64)
        // If it's just a string data uri from the client component, we need to extract the base64 part
        let content = '';

        if (typeof file === 'string' && file.startsWith('data:')) {
            // It's a Data URI
            const base64Data = file.split(',')[1];
            const buffer = Buffer.from(base64Data, 'base64');
            content = buffer.toString('utf-8');
        } else if (file instanceof File) {
            const buffer = Buffer.from(await file.arrayBuffer());
            content = buffer.toString('utf-8');
        } else {
            return { error: 'Invalid file format' };
        }

        if (!content) {
            return { error: 'Empty file content' };
        }

        // Simple CSV Parser
        // Handle split by new lines
        const lines = content.split(/\r?\n/).filter(line => line.trim() !== '');

        if (lines.length < 2) {
            console.log("Only found " + lines.length + " lines.");
            // If ONLY header exists, it returns 0 count success.
            if (lines.length === 1) {
                return { error: 'CSV file contains only a header row. Please add data.' };
            }
            return { error: 'CSV file must have a header and at least one data row.' };
        }

        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        const dataRows = lines.slice(1);

        console.log("Headers found:", headers);

        let successCount = 0;
        let diffCount = 0; // if existing lead found

        for (const row of dataRows) {
            const columns = row.split(',').map(c => c.trim());

            // Map columns based on index if header matches known fields
            // Mapping: ['first name', 'last name', 'email', 'phone', 'company', 'title', 'lead source', 'status']

            const leadData: any = {};

            // Helper to safely get value by header name
            const getVal = (headerName: string) => {
                const index = headers.indexOf(headerName.toLowerCase());
                return index !== -1 ? columns[index] : null;
            }

            const firstName = getVal('first name') || '';
            const lastName = getVal('last name') || '';

            leadData.name = `${firstName} ${lastName}`.trim();
            if (!leadData.name) leadData.name = 'Unknown Lead';

            leadData.primary_email = getVal('email');
            leadData.primary_phone = getVal('phone');
            leadData.stage = 'new'; // default
            leadData.status = getVal('status')?.toLowerCase() || 'new';

            // Extract company from current session if not specified, 
            // but usually we rely on tenant_id for scoping.
            // company_id is optional in schema?

            const companyName = getVal('company');
            if (companyName) {
                leadData.custom_data = { company_name: companyName, title: getVal('title') };
            }

            // Basic Upsert by Email to prevent duplicates
            if (leadData.primary_email) {
                console.log("Processing lead:", leadData.primary_email);

                // Check if exists
                const existing = await prisma.crm_leads.findFirst({
                    where: {
                        tenant_id: session.user.tenantId,
                        email: leadData.primary_email
                    }
                });

                if (existing) {
                    // update? skip for now or maybe update status
                    diffCount++;
                } else {
                    await prisma.crm_leads.create({
                        data: {
                            tenant_id: session.user.tenantId,
                            company_id: session.user.companyId || null,
                            owner_id: session.user.id || null,

                            // Map CSV data to crm_leads fields
                            name: leadData.name, // The lead title or person name? 
                            // Usually 'name' in crm_leads is the Lead Title. 
                            // 'contact_name' is the person.
                            // For this import, let's use the Name as both for now, or split if we had Title.
                            contact_name: leadData.name,

                            email: leadData.primary_email,
                            phone: leadData.primary_phone,

                            company_name: leadData.custom_data?.company_name || null,

                            status: leadData.status,

                            metadata: {
                                source: 'import_csv',
                                import_date: new Date().toISOString(),
                                original_data: leadData.custom_data
                            }
                        }
                    });
                    successCount++;
                }
            } else {
                console.log("Skipping row without email");
            }
        }

        revalidatePath('/crm/leads');

        return {
            success: true,
            count: successCount,
            duplicates: diffCount
        };

    } catch (error: any) {
        console.error("Import error:", error);
        return { error: error.message };
    }
}

// -- Missing Exports for Lead Form (Restoring) --

export type LeadFormState = {
    errors?: {
        name?: string[];
        email?: string[];
        phone?: string[];
        company?: string[];
    };
    message?: string;
    success?: boolean;
}

export async function createLead(prevState: LeadFormState, formData: FormData): Promise<LeadFormState> {
    const session = await auth();
    if (!session?.user?.tenantId) {
        return { message: "Unauthorized" };
    }

    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const company_name = formData.get('company_name') as string; // Client Company
    const company_id = formData.get('company_id') as string; // Branch/Location
    const contact_name = formData.get('contact_name') as string;

    // Numbers
    const estimated_value = parseFloat(formData.get('estimated_value') as string) || 0;
    const probability = parseFloat(formData.get('probability') as string) || 0;

    // IDs
    const pipeline_id = formData.get('pipeline_id') as string || null;
    const stage_id = formData.get('stage_id') as string || null;
    const source_id = formData.get('source_id') as string || null;

    // Dates
    const next_followup_date_raw = formData.get('next_followup_date') as string;
    const next_followup_date = next_followup_date_raw ? new Date(next_followup_date_raw) : null;

    // Meta
    const ai_summary = formData.get('ai_summary') as string;


    // Basic validation
    if (!name || name.length < 2) {
        return { errors: { name: ["Name must be at least 2 characters"] } };
    }

    try {
        await prisma.crm_leads.create({
            data: {
                tenant_id: session.user.tenantId,
                company_id: company_id || session.user.companyId, // Use selected branch or user's default
                name: name,
                contact_name: contact_name || name,
                email: email,
                phone: phone,
                company_name: company_name,

                estimated_value,
                probability,

                pipeline_id,
                stage_id,
                source_id,

                next_followup_date,
                ai_summary,

                status: 'new'
            }
        });

        revalidatePath('/crm/leads');
        return { success: true, message: "Lead created successfully" };
    } catch (error) {
        console.error(error);
        return { message: "Database Error: Failed to create lead." };
    }
}


export async function updateLead(prevState: LeadFormState, formData: FormData): Promise<LeadFormState> {
    const session = await auth();
    if (!session?.user?.tenantId) {
        return { message: "Unauthorized" };
    }

    const id = formData.get('id') as string;

    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const company_name = formData.get('company_name') as string;
    const contact_name = formData.get('contact_name') as string;

    // Numbers
    const estimated_value = parseFloat(formData.get('estimated_value') as string) || 0;
    const probability = parseFloat(formData.get('probability') as string) || 0;

    // IDs
    const pipeline_id = formData.get('pipeline_id') as string || null;
    const stage_id = formData.get('stage_id') as string || null;
    const source_id = formData.get('source_id') as string || null;

    // Dates
    const next_followup_date_raw = formData.get('next_followup_date') as string;
    const next_followup_date = next_followup_date_raw ? new Date(next_followup_date_raw) : null;

    // Meta
    const ai_summary = formData.get('ai_summary') as string;


    if (!id) return { message: "Missing Lead ID" };
    if (!name || name.length < 2) {
        return { errors: { name: ["Name must be at least 2 characters"] } };
    }

    try {
        await prisma.crm_leads.update({
            where: { id },
            data: {
                name: name,
                contact_name: contact_name || name,
                email: email,
                phone: phone,
                company_name: company_name,

                estimated_value,
                probability,

                pipeline_id,
                stage_id,
                source_id,

                next_followup_date,
                ai_summary
            }
        });

        revalidatePath('/crm/leads');
        revalidatePath(`/crm/leads/${id}`); // also revalidate detail page if any
        return { success: true, message: "Lead updated successfully" };
    } catch (error) {
        console.error(error);
        return { message: "Database Error: Failed to update lead." };
    }
}

export async function deleteLead(id: string) {
    const session = await auth();
    if (!session?.user?.tenantId) {
        return { message: "Unauthorized" };
    }

    try {
        await prisma.crm_leads.update({
            where: { id },
            data: { deleted_at: new Date() }
        });

        revalidatePath('/crm/leads');
        return { success: true, message: "Lead deleted successfully" };
    } catch (error) {
        console.error(error);
        return { message: "Database Error: Failed to delete lead." };
    }
}

