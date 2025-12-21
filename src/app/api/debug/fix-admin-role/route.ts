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
        const existingRole = await prisma.user_role.findFirst({
            where: {
                user_id: userId,
                role: {
                    tenant_id: tenantId,
                    key: 'admin'
                }
            },
            include: {
                role: true
            }
        });

        if (existingRole) {
            return NextResponse.json({
                success: true,
                message: "You already have an admin role assigned!",
                role: existingRole.role
            });
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

        // Assign role to current user
        const assignment = await prisma.user_role.create({
            data: {
                user_id: userId,
                role_id: adminRole.id,
                tenant_id: tenantId
            }
        });

        return NextResponse.json({
            success: true,
            message: "Admin role created and assigned successfully! You can now manage roles.",
            role: adminRole,
            assignment: assignment
        });

    } catch (error: any) {
        console.error("Error creating admin role:", error);
        return NextResponse.json({
            error: error.message,
            details: "Failed to create admin role assignment"
        }, { status: 500 });
    }
}
