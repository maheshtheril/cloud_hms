import { Resend } from 'resend';

export async function sendInvitationEmail(email: string, token: string, name: string) {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
        console.warn("RESEND_API_KEY is not set. Email will not be sent.");
        return { success: false, error: "RESEND_API_KEY missing" };
    }

    const resend = new Resend(apiKey);

    // Determine App URL - prioritize Env Var, fallback to likely production URL or localhost
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://cloud-hms.onrender.com');

    const inviteUrl = `${appUrl}/auth/accept-invite?token=${token}`;
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

    try {
        const { data, error } = await resend.emails.send({
            from: `HMS Operations <${fromEmail}>`,
            to: email,
            subject: 'Invitation to join the ecosystem',
            html: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.05); border: 1px solid #f1f5f9;">
                    <div style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 48px 40px; text-align: center;">
                        <div style="display: inline-block; background-color: rgba(255,255,255,0.2); backdrop-filter: blur(10px); padding: 12px; border-radius: 16px; margin-bottom: 24px;">
                            <img src="${appUrl}/logo.png" alt="Logo" style="width: 48px; height: 48px;" />
                        </div>
                        <h1 style="color: #ffffff; font-size: 28px; font-weight: 800; margin: 0; letter-spacing: -0.02em;">Welcome to the Mission</h1>
                        <p style="color: rgba(255,255,255,0.8); font-size: 16px; margin-top: 8px; font-weight: 500;">Secure Enterprise Portal</p>
                    </div>
                    
                    <div style="padding: 40px;">
                        <p style="color: #1e293b; font-size: 18px; font-weight: 600; margin-bottom: 16px;">Hello ${name},</p>
                        <p style="color: #64748b; font-size: 16px; line-height: 1.6; margin-bottom: 32px;">
                            You have been invited to join the professional ecosystem. Your profile has been initialized and is awaiting activation.
                        </p>
                        
                        <div style="background-color: #f8fafc; border-radius: 20px; padding: 32px; text-align: center; border: 1px dashed #e2e8f0; margin-bottom: 40px;">
                            <p style="color: #475569; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 24px;">Action Required</p>
                            <a href="${inviteUrl}" style="background-color: #4f46e5; color: #ffffff; padding: 18px 36px; text-decoration: none; border-radius: 14px; font-weight: 700; font-size: 16px; display: inline-block; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);">
                                Initialize Profile Access
                            </a>
                            <p style="color: #94a3b8; font-size: 12px; margin-top: 24px;">This secure invitation link is valid for 48 hours.</p>
                        </div>
                        
                        <div style="border-top: 1px solid #f1f5f9; padding-top: 32px;">
                            <h4 style="color: #1e293b; font-size: 14px; font-weight: 700; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.05em;">Security Protocol</h4>
                            <p style="color: #94a3b8; font-size: 13px; line-height: 1.5;">
                                If you did not expect this invitation, please ignore this communication. Your account will remain dormant until activated via the secure token provided.
                            </p>
                        </div>
                    </div>
                    
                    <div style="background-color: #f1f5f9; padding: 24px 40px; text-align: center;">
                        <p style="color: #94a3b8; font-size: 12px; margin: 0;">© 2035 • Hospital Management Intelligence</p>
                    </div>
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
