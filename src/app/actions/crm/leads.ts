'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { processCustomFields } from './custom-fields'

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
    const currency = formData.get('currency') as string || 'INR';
    const is_hot = formData.get('is_hot') === 'true';

    // Numbers
    const estimated_value = parseFloat(formData.get('estimated_value') as string) || 0;
    const probability = parseFloat(formData.get('probability') as string) || 0;

    // IDs
    const pipeline_id = formData.get('pipeline_id') as string || null;
    const stage_id = formData.get('stage_id') as string || null;
    const source_id = formData.get('source_id') as string || null;
    const target_type_id = formData.get('target_type_id') as string || null;


    // Dates
    const next_followup_date_raw = formData.get('next_followup_date') as string;
    const next_followup_date = next_followup_date_raw ? new Date(next_followup_date_raw) : null;

    // Meta
    const ai_summary = formData.get('ai_summary') as string;
    const owner_id = formData.get('owner_id') as string || session.user.id;
    const lob_id = formData.get('lob_id') as string || null;
    const priority = formData.get('priority') as string || 'warm';
    const alt_phone = formData.get('alt_phone') as string || null;

    // AI Scoring Implementation
    const lead_score = calculateAILeadScore({
        estimated_value,
        probability,
        hasEmail: !!email,
        hasPhone: !!phone,
        hasCompany: !!company_name,
        isHot: is_hot
    });


    // Basic validation
    if (!name || name.length < 2) {
        return { errors: { name: ["Name must be at least 2 characters"] } };
    }

    try {
        const newLead = await prisma.crm_leads.create({
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
                target_type_id,


                next_followup_date,
                ai_summary,
                owner_id: owner_id || null,
                currency: currency,
                is_hot: is_hot,
                lead_score: lead_score,
                status: 'new',
                lob_id,
                priority,
                alt_phone
            } as any
        });

        // Process Custom Fields
        await processCustomFields(formData, session.user.tenantId, newLead.id, 'lead')

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
    const currency = formData.get('currency') as string || 'INR';
    const is_hot = formData.get('is_hot') === 'true';

    // Numbers
    const estimated_value = parseFloat(formData.get('estimated_value') as string) || 0;
    const probability = parseFloat(formData.get('probability') as string) || 0;

    // IDs
    const pipeline_id = formData.get('pipeline_id') as string || null;
    const stage_id = formData.get('stage_id') as string || null;
    const source_id = formData.get('source_id') as string || null;
    const target_type_id = formData.get('target_type_id') as string || null;


    // Dates
    const next_followup_date_raw = formData.get('next_followup_date') as string;
    const next_followup_date = next_followup_date_raw ? new Date(next_followup_date_raw) : null;

    // Meta
    const ai_summary = formData.get('ai_summary') as string;
    const owner_id = formData.get('owner_id') as string;

    // AI Scoring Implementation (Re-calculation)
    const lead_score = calculateAILeadScore({
        estimated_value,
        probability,
        hasEmail: !!email,
        hasPhone: !!phone,
        hasCompany: !!company_name,
        isHot: is_hot
    });


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
                target_type_id,


                next_followup_date,
                ai_summary,
                owner_id: owner_id || undefined,
                currency: currency,
                is_hot: is_hot,
                lead_score: lead_score
            } as any
        });

        // Process Custom Fields
        await processCustomFields(formData, session.user.tenantId, id, 'lead')

        revalidatePath('/crm/leads');
        revalidatePath(`/crm/leads/${id}`);
        revalidatePath(`/crm/leads/${id}/edit`);
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

export async function getLead(id: string) {
    const session = await auth()
    if (!session?.user?.tenantId) return null

    return prisma.crm_leads.findUnique({
        where: {
            id,
            tenant_id: session.user.tenantId,
            deleted_at: null
        },
        include: {
            stage: true,
            pipeline: true,
            source: true,
            target_type: true,

            owner: {
                select: { id: true, name: true, email: true }
            }
        } as any
    })
}

/**
 * AI Scoring Algorithm for Leads
 * Higher data completeness and priority flags boost the score.
 */
function calculateAILeadScore(data: {
    estimated_value: number;
    probability: number;
    hasEmail: boolean;
    hasPhone: boolean;
    hasCompany: boolean;
    isHot: boolean;
}) {
    let score = 0;

    // 1. Probability component (Max 40 points)
    score += (data.probability / 100) * 40;

    // 2. Data Completeness component (Max 20 points)
    if (data.hasEmail) score += 7;
    if (data.hasPhone) score += 7;
    if (data.hasCompany) score += 6;

    // 3. Potential Value component (Max 20 points)
    // Logarithmic scale: 10k = ~5pts, 100k = ~10pts, 1M = ~15pts, 10M+ = 20pts
    if (data.estimated_value > 0) {
        const valScore = Math.min(20, Math.log10(data.estimated_value) * 3);
        score += valScore;
    }

    // 4. Intensity Modifier (Hot Lead) (Max 20 points)
    if (data.isHot) {
        score += 20;
    }

    return Math.min(100, Math.round(score));
}
export async function getLobs() {
    const session = await auth();
    if (!session?.user?.tenantId) return [];

    return prisma.crm_lob.findMany({
        where: { tenant_id: session.user.tenantId, is_active: true },
        orderBy: { name: 'asc' }
    });
}

/**
 * World-Class Lead Intelligence: Duplicate Detection
 * Checks for existing leads or contacts with same email or phone
 */
export async function checkLeadDuplicates(params: { email?: string, phone?: string }) {
    const session = await auth();
    if (!session?.user?.tenantId) return { success: false, error: 'Unauthorized' };

    const { email, phone } = params;
    if (!email && !phone) return { success: true, duplicates: [] };

    try {
        const duplicates = await prisma.crm_leads.findMany({
            where: {
                tenant_id: session.user.tenantId,
                deleted_at: null,
                OR: [
                    email ? { email: { equals: email, mode: 'insensitive' } } : undefined,
                    phone ? { phone: { contains: phone } } : undefined
                ].filter(Boolean) as any
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                company_name: true,
                status: true,
                created_at: true
            },
            take: 3
        });

        return { success: true, duplicates };
    } catch (error) {
        console.error("Duplicate check error:", error);
        return { success: false, error: 'Database check failed' };
    }
}

/**
 * World-Class Lead Intelligence: Company Domain Discovery
 * Suggests company names based on email domain or searches existing accounts
 */
export async function searchCompaniesByDomain(email: string) {
    const session = await auth();
    if (!session?.user?.tenantId) return { success: false, error: 'Unauthorized' };

    if (!email || !email.includes('@')) return { success: true, recommendations: [] };

    const domain = email.split('@')[1].toLowerCase();

    // Skip public domains
    const publicDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com', 'me.com'];
    if (publicDomains.includes(domain)) return { success: true, recommendations: [] };

    try {
        // Search in existing leads/accounts for this tenant
        const existingCompanies = await prisma.crm_leads.findMany({
            where: {
                tenant_id: session.user.tenantId,
                email: { contains: `@${domain}` },
                company_name: { not: null }
            },
            select: { company_name: true },
            distinct: ['company_name'],
            take: 5
        });

        const recommendations = existingCompanies
            .map(c => c.company_name)
            .filter((name): name is string => !!name);

        // Also suggest derived name from domain
        const derivedName = domain.split('.')[0]
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

        if (!recommendations.includes(derivedName)) {
            recommendations.unshift(derivedName);
        }

        return { success: true, recommendations };
    } catch (error) {
        return { success: false, error: 'Search failed' };
    }
}
