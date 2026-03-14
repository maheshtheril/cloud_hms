import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getWhatsAppSettings } from "@/app/actions/settings";

export const dynamic = 'force-dynamic';

export async function GET() {
    console.log("[DEBUG-API] Triggered");
    const session = await auth();
    const result: any = {
        success: true,
        timestamp: new Date().toISOString(),
        session: {
            tenantId: session?.user?.tenantId,
            companyId: session?.user?.companyId,
            userId: session?.user?.id
        }
    };

    try {
        const tenantId = session?.user?.tenantId;
        const companyId = session?.user?.companyId;

        // 1. Raw DB Dump
        const allRecords = await prisma.hms_settings.findMany({
            where: { key: 'whatsapp_config' }
        });
        
        result.db_records = allRecords.map(s => ({
            id: s.id,
            company_id: s.company_id,
            tenant_id: s.tenant_id,
            has_token: !!((s.value as any)?.token),
            token_length: (s.value as any)?.token?.length || 0,
            scope: s.scope,
            is_active: s.is_active
        }));

        // 2. Fetcher Test
        result.fetcher_test = {
            ids_used: { companyId, tenantId },
            result: null,
            error: null
        };

        if (tenantId && companyId) {
            try {
                result.fetcher_test.result = await getWhatsAppSettings(companyId, tenantId);
            } catch (err: any) {
                result.fetcher_test.error = err.message;
            }
        } else {
            result.fetcher_test.error = "Missing IDs in session";
        }

        return NextResponse.json(result);
    } catch (e: any) {
        return NextResponse.json({ success: false, error: e.message, stack: e.stack });
    }
}
