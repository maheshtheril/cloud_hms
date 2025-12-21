import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendInvitationEmail(email: string, token: string, name: string) {
    // Determine App URL - prioritize Env Var, fallback to likely production URL or localhost
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://cloud-hms.onrender.com';

    const inviteUrl = `${appUrl}/auth/accept-invite?token=${token}`;
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

    try {
        const { data, error } = await resend.emails.send({
            from: `Cloud HMS <${fromEmail}>`,
            to: email,
            subject: 'You have been invited to Cloud HMS',
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
                    <h2 style="color: #111827;">Welcome to Cloud HMS</h2>
                    <p style="color: #4b5563;">Hello <strong>${name}</strong>,</p>
                    <p style="color: #4b5563;">You have been invited to join the Cloud HMS workspace. To get started, please accept this invitation and set up your secure password.</p>
                    
                    <div style="margin: 32px 0;">
                        <a href="${inviteUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; display: inline-block;">Accept Invitation</a>
                    </div>
                    
                    <p style="color: #6b7280; font-size: 14px;">This invitation link will expire in 48 hours.</p>
                    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
                    <p style="color: #9ca3af; font-size: 12px;">If you were not expecting this invitation, you can safely ignore this email.</p>
                </div>
            `
        });

        if (error) {
            console.error('Resend API Error:', error);
            return { success: false, error };
        }

        return { success: true, data };
    } catch (error) {
        console.error('Error sending invitation email:', error);
        return { success: false, error };
    }
}
