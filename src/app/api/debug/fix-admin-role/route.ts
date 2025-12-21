import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

/**
 * Fix for existing users who signed up before the RBAC role auto-creation was added
 * This creates an admin role and assigns it to the current user
 */
export async function GET() {
    const session = await auth();

    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const userId = session.user.id;
        const tenantId = session.user.tenantId;

        if (!tenantId) {
            return NextResponse.json({
                error: "No tenant ID found in session. Please log out and log in again."
            }, { status: 400 });
        }

        // Check if user already has an admin role
        // First find the admin role for this tenant
        const adminRoleCheck = await prisma.role.findFirst({
            where: {
                tenant_id: tenantId,
                key: 'admin'
            }
        });

        if (adminRoleCheck) {
            // Then check if user has this role assigned
            const existingAssignment = await prisma.$queryRaw<any[]>`
                SELECT * FROM user_role 
                WHERE user_id = ${userId}::uuid 
                AND role_id = ${adminRoleCheck.id}::uuid
                LIMIT 1
            `;

            if (existingAssignment && existingAssignment.length > 0) {
                return NextResponse.json({
                    success: true,
                    message: "You already have an admin role assigned!",
                    role: adminRoleCheck
                });
            }
        }

        // Check if admin role exists for this tenant
        let adminRole = await prisma.role.findFirst({
            where: {
                tenant_id: tenantId,
                key: 'admin'
            }
        });

        // Create admin role if it doesn't exist
        if (!adminRole) {
            adminRole = await prisma.role.create({
                data: {
                    tenant_id: tenantId,
                    key: 'admin',
                    name: 'Administrator',
                    permissions: [
                        'users:view', 'users:create', 'users:edit', 'users:delete',
                        'roles:view', 'roles:manage',
                        'settings:view', 'settings:edit',
                        'hms:admin', 'crm:admin', 'inventory:admin',
                        '*' // Full access
                    ]
                }
            });
        }

        // Assign role to current user using raw SQL
        await prisma.$executeRaw`
            INSERT INTO user_role (user_id, role_id, tenant_id)
            VALUES (${userId}::uuid, ${adminRole.id}::uuid, ${tenantId}::uuid)
            ON CONFLICT DO NOTHING
        `;

        return NextResponse.json({
            success: true,
            message: "Admin role created and assigned successfully! You can now manage roles.",
            role: adminRole
        });

    } catch (error: any) {
        console.error("Error creating admin role:", error);
        return NextResponse.json({
            error: error.message,
            details: "Failed to create admin role assignment"
        }, { status: 500 });
    }
}
