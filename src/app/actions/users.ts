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

        // Create user with PENDING state (is_active: false)
        const user = await prisma.app_user.create({
            data: {
                tenant_id: session.user.tenantId,
                email: data.email.toLowerCase(),
                full_name: data.fullName || data.email.split('@')[0],
                name: data.email.split('@')[0],
                role: data.systemRole,
                is_active: false, // Must set password to activate
                is_tenant_admin: data.systemRole === 'admin',
                is_admin: data.systemRole === 'admin',
            }
        })

        let inviteLink: string | undefined;
        let emailError = null;

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
                console.error("Resend Error:", emailResult.error)
                emailError = typeof emailResult.error === 'string' ? emailResult.error : 'API Key missing or Sandbox restriction';
            }

            // Generate link for manual copying
            const appUrl = process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://cloud-hms.onrender.com');
            inviteLink = `${appUrl}/auth/accept-invite?token=${token}`;

        } catch (e) {
            console.error("Error in invitation flow:", e)
            emailError = "Internal system error during mail generation";
        }

        if (data.roleId && data.roleId !== 'no-role') {
            try {
                await prisma.hms_user_roles.create({
                    data: { user_id: user.id, role_id: data.roleId }
                })
            } catch (roleError) {
                console.error("Error assigning role:", roleError);
            }
        }

        revalidatePath('/settings/users')

        return {
            success: true,
            message: emailError ? `User created but EMAIL FAILED: ${emailError}` : 'User invited successfully.',
            user,
            inviteLink,
            emailStatus: emailError ? 'failed' : 'sent'
        }

    } catch (error: any) {
        console.error('Error inviting user:', error)
        return { error: error.message || 'Failed to invite user' }
    }
}

/**
 * Resend invitation to an existing user
 */
export async function resendInvitation(userId: string) {
    const session = await auth()
    if (!session?.user?.tenantId) return { error: 'Unauthorized' }

    const user = await prisma.app_user.findUnique({
        where: { id: userId, tenant_id: session.user.tenantId }
    })

    if (!user) return { error: 'User not found' }

    if (user.password && user.is_active) {
        return { error: 'User has already activated their account' }
    }

    let emailError = null;
    let inviteLink: string | undefined;

    try {
        const token = crypto.randomBytes(32).toString('hex')
        const expiresAt = new Date()
        expiresAt.setHours(expiresAt.getHours() + 48)

        await prisma.email_verification_tokens.deleteMany({
            where: { user_id: userId }
        })

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
            emailError = typeof emailResult.error === 'string' ? emailResult.error : 'Mail delivery failed (Check API Key/Sandbox)';
        }

        const appUrl = process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://cloud-hms.onrender.com');
        inviteLink = `${appUrl}/auth/accept-invite?token=${token}`;

    } catch (e) {
        console.error("Resend error:", e)
        emailError = "Internal system failure";
    }

    return {
        success: true,
        message: emailError ? `Email failed: ${emailError}` : 'Invitation resent successfully.',
        inviteLink,
        emailStatus: emailError ? 'failed' : 'sent'
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
        const tokenRecord = await prisma.email_verification_tokens.findFirst({
            where: { token: token }
        })

        if (!tokenRecord) {
            return { error: 'Invalid token' }
        }

        if (new Date() > tokenRecord.expires_at) {
            return { error: 'Token expired' }
        }

        const userId = tokenRecord.user_id

        await prisma.$executeRaw`
            UPDATE app_user 
            SET password = crypt(${password}, gen_salt('bf')),
                is_active = true
            WHERE id = ${userId}::uuid
        `

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

        await prisma.hms_user_roles.deleteMany({ where: { user_id: userId } })
        await prisma.user_permission.deleteMany({ where: { user_id: userId } })
        await prisma.email_verification_tokens.deleteMany({ where: { user_id: userId } })

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
