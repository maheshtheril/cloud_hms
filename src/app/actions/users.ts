/**
 * User Management Server Actions
 * 
 * Handles user invitation, role assignment, and user management operations
 */

'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'
import { sendInvitationEmail } from '@/lib/email'
import crypto from 'crypto'

export interface InviteUserData {
    email: string
    roleId?: string
    systemRole: 'admin' | 'user'
    fullName?: string
}

/**
 * Get all users for the current tenant with roles
 */
export async function getUsers(filters?: {
    search?: string
    role?: string
    status?: 'active' | 'inactive' | 'all'
    page?: number
    limit?: number
}) {
    const session = await auth()
    if (!session?.user?.tenantId) return []

    try {
        const page = filters?.page || 1
        const limit = filters?.limit || 20
        const skip = (page - 1) * limit

        const where: any = {
            tenant_id: session.user.tenantId,
        }

        // Search filter
        if (filters?.search) {
            where.OR = [
                { email: { contains: filters.search, mode: 'insensitive' } },
                { full_name: { contains: filters.search, mode: 'insensitive' } },
                { name: { contains: filters.search, mode: 'insensitive' } },
            ]
        }

        // Role filter
        if (filters?.role && filters.role !== 'all') {
            where.role = filters.role
        }

        // Status filter
        if (filters?.status && filters?.status !== 'all') {
            where.is_active = filters.status === 'active'
        }

        const [users, total] = await Promise.all([
            prisma.app_user.findMany({
                where,
                include: {
                    hms_user_roles: {
                        include: {
                            hms_role: {
                                select: {
                                    id: true,
                                    name: true,
                                }
                            }
                        }
                    }
                },
                orderBy: { created_at: 'desc' },
                take: limit,
                skip,
            }),
            prisma.app_user.count({ where })
        ])

        return {
            users,
            total,
            pages: Math.ceil(total / limit),
            currentPage: page
        }

    } catch (error) {
        console.error('Error fetching users:', error)
        return { users: [], total: 0, pages: 0, currentPage: 1 }
    }
}

/**
 * Invite a new user to the system
 */
export async function inviteUser(data: InviteUserData) {
    const session = await auth()
    if (!session?.user?.tenantId) {
        return { error: 'Unauthorized' }
    }

    try {
        // Check if user already exists
        const existingUser = await prisma.app_user.findFirst({
            where: {
                email: data.email,
                tenant_id: session.user.tenantId,
            }
        })

        if (existingUser) {
            return { error: 'User with this email already exists' }
        }

        // Create user
        const user = await prisma.app_user.create({
            data: {
                tenant_id: session.user.tenantId,
                email: data.email,
                full_name: data.fullName || data.email.split('@')[0],
                name: data.email.split('@')[0],
                role: data.systemRole,
                is_active: true,
                is_tenant_admin: data.systemRole === 'admin',
                is_admin: data.systemRole === 'admin',
            }
        })

        let inviteLink: string | undefined;

        // Generate invitation token and send email
        try {
            const token = crypto.randomBytes(32).toString('hex')
            const expiresAt = new Date()
            expiresAt.setHours(expiresAt.getHours() + 48)

            await prisma.email_verification_tokens.create({
                data: {
                    user_id: user.id,
                    email: user.email,
                    token: token,
                    expires_at: expiresAt
                }
            })

            const emailResult = await sendInvitationEmail(user.email, token, user.full_name || user.name || 'User')
            if (!emailResult.success) {
                console.error("Failed to send email via Resend:", emailResult.error)
            }

            // Generate link for manual copying
            const appUrl = process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://cloud-hms.onrender.com');
            inviteLink = `${appUrl}/auth/accept-invite?token=${token}`;

        } catch (e) {
            console.error("Error in invitation flow:", e)
        }

        // Assign role if provided
        if (data.roleId) {
            try {
                await prisma.hms_user_roles.create({
                    data: {
                        user_id: user.id,
                        role_id: data.roleId,
                    }
                })
            } catch (roleError) {
                console.error("Error assigning role:", roleError);
                // Continue, as user is created. Or delete user and fail? 
                // Better to succeed with warning, or fail hard. 
                // For now, let's log it. User creation is primary.
            }
        }

        revalidatePath('/settings/users')

        return {
            success: true,
            message: 'User invited successfully.',
            user,
            inviteLink
        }

    } catch (error: any) {
        console.error('Error inviting user:', error)
        return { error: error.message || 'Failed to invite user' }
    }
}

/**
 * Update user status (activate/deactivate)
 */
export async function updateUserStatus(userId: string, isActive: boolean) {
    const session = await auth()
    if (!session?.user?.tenantId) {
        return { error: 'Unauthorized' }
    }

    try {
        await prisma.app_user.update({
            where: {
                id: userId,
                tenant_id: session.user.tenantId,
            },
            data: {
                is_active: isActive,
            }
        })

        revalidatePath('/settings/users')
        return { success: true }

    } catch (error) {
        console.error('Error updating user status:', error)
        return { error: 'Failed to update user status' }
    }
}

/**
 * Update user role
 */
export async function updateUserRole(userId: string, systemRole: 'admin' | 'user') {
    const session = await auth()
    if (!session?.user?.tenantId) {
        return { error: 'Unauthorized' }
    }

    try {
        await prisma.app_user.update({
            where: {
                id: userId,
                tenant_id: session.user.tenantId,
            },
            data: {
                role: systemRole,
            }
        })

        revalidatePath('/settings/users')
        return { success: true }

    } catch (error) {
        console.error('Error updating user role:', error)
        return { error: 'Failed to update user role' }
    }
}

/**
 * Get all available roles for assignment
 */
export async function getAvailableRoles() {
    const session = await auth()
    if (!session?.user?.tenantId) return []

    try {
        const roles = await prisma.hms_role.findMany({
            where: {
                tenant_id: session.user.tenantId,
            },
            select: {
                id: true,
                name: true,
                description: true,
            },
            orderBy: { name: 'asc' }
        })

        return roles

    } catch (error) {
        console.error('Error fetching roles:', error)
        return []
    }
}

/**
 * Delete user (soft delete)
 */
export async function deleteUser(userId: string) {
    const session = await auth()
    if (!session?.user?.tenantId) {
        return { error: 'Unauthorized' }
    }

    try {
        // Prevent self-deletion
        if (userId === session.user.id) {
            return { error: 'Cannot delete your own account' }
        }

        await prisma.app_user.update({
            where: {
                id: userId,
                tenant_id: session.user.tenantId,
            },
            data: {
                is_active: false,
                // Optionally add deleted_at timestamp if column exists
            }
        })

        revalidatePath('/settings/users')
        return { success: true, message: 'User deactivated successfully' }

    } catch (error) {
        console.error('Error deleting user:', error)
        return { error: 'Failed to delete user' }
    }
}

/**
 * Accept invitation and set password
 */
export async function acceptInvitation(token: string, password: string) {
    try {
        // 1. Validate token
        const tokenRecord = await prisma.email_verification_tokens.findFirst({
            where: { token: token }
        })

        if (!tokenRecord) {
            return { error: 'Invalid token' }
        }

        if (new Date() > tokenRecord.expires_at) {
            return { error: 'Token expired' }
        }

        // 2. Update user password securely using pgcrypto
        const userId = tokenRecord.user_id

        await prisma.$executeRaw`
            UPDATE app_user 
            SET password = crypt(${password}, gen_salt('bf')),
                is_active = true
            WHERE id = ${userId}::uuid
        `

        // 3. Delete token
        await prisma.email_verification_tokens.delete({
            where: { id: tokenRecord.id }
        })

        return { success: true }
    } catch (error) {
        console.error("Accept invite error:", error)
        return { error: 'Failed to process invitation. Please try again.' }
    }
}

/**
 * Permanently delete user if no transactions exist
 */
export async function deleteUserPermanently(userId: string) {
    const session = await auth()
    if (!session?.user?.id || !session.user.isAdmin) {
        return { error: "Unauthorized" }
    }

    try {
        // 1. Transaction Check
        const [
            encounters,
            appointments,
            deals,
            contacts
        ] = await Promise.all([
            prisma.hms_encounter.count({ where: { clinician_id: userId } }),
            prisma.hms_appointments.count({ where: { clinician_id: userId } }),
            prisma.crm_deals.count({ where: { owner_id: userId } }),
            prisma.crm_contacts.count({ where: { owner_id: userId } }),
        ])

        const totalTransactions = encounters + appointments + deals + contacts

        if (totalTransactions > 0) {
            const details = [
                encounters ? `${encounters} Encounters` : '',
                appointments ? `${appointments} Appointments` : '',
                deals ? `${deals} Deals` : '',
                contacts ? `${contacts} Contacts` : ''
            ].filter(Boolean).join(', ')

            return {
                error: `Cannot delete user. They have associated transactions: ${details}.`
            }
        }

        // 2. Clean up dependencies
        await prisma.hms_user_roles.deleteMany({ where: { user_id: userId } })
        await prisma.user_permission.deleteMany({ where: { user_id: userId } })
        await prisma.email_verification_tokens.deleteMany({ where: { user_id: userId } })

        // 3. Delete the User
        await prisma.app_user.delete({ where: { id: userId } })

        revalidatePath('/settings/users')
        return { success: true }

    } catch (error: any) {
        console.error("Delete user error:", error)
        if (error.code === 'P2003') {
            return { error: `Cannot delete user due to foreign key constraint: ${error.meta?.field_name || 'Unknown Table'}` }
        }
        return { error: error.message || "Failed to delete user" }
    }
}
