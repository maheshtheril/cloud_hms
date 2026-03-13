import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET() {
    const session = await auth();
    try {
        const allSettings = await prisma.hms_settings.findMany({
            where: { key: 'whatsapp_config' }
        });
        
        const data = allSettings.map(s => ({
            id: s.id,
            company_id: s.company_id,
            tenant_id: s.tenant_id,
            has_token: !!((s.value as any)?.token),
            token_length: (s.value as any)?.token?.length || 0,
            scope: s.scope,
            is_active: s.is_active
        }));

        return NextResponse.json({ 
            success: true, 
            session: {
                tenantId: session?.user?.tenantId,
                companyId: session?.user?.companyId,
                userId: session?.user?.id
            },
            count: allSettings.length, 
            data 
        });
    } catch (e: any) {
        return NextResponse.json({ success: false, error: e.message });
    }
}
