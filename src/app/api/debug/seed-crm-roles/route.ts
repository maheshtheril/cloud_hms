
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET() {
    const session = await auth();
    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const tenantId = session.user.tenantId;

        // Define standard CRM roles
        const roles = [
            {
                key: 'crm_supervisor',
                name: 'CRM Supervisor',
                permissions: ['crm:admin', 'crm:view_all', 'crm:reports']
            },
            {
                key: 'crm_manager',
                name: 'CRM Manager',
                permissions: ['crm:view_team', 'crm:manage_deals', 'crm:assign_leads']
            },
            {
                key: 'crm_salesman',
                name: 'Sales Executive',
                permissions: ['crm:view_own', 'crm:create_leads', 'crm:manage_own_deals']
            }
        ];

        const results = [];

        for (const r of roles) {
            // Check if role exists
            const existing = await prisma.role.findFirst({
                where: {
                    tenant_id: tenantId,
                    key: r.key
                }
            });

            if (!existing) {
                // Create role
                const newRole = await prisma.role.create({
                    data: {
                        tenant_id: tenantId,
                        key: r.key,
                        name: r.name,
                        permissions: r.permissions
                    }
                });
                results.push({ action: 'created', role: newRole.name });
            } else {
                results.push({ action: 'skipped', role: existing.name });
            }
        }

        return NextResponse.json({ success: true, results });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
