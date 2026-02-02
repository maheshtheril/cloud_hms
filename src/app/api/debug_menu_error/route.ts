
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    const results = {
        prismaAttempt: null as any,
        rawSqlAttempt: null as any,
        schemaInfo: "Attempting to probe database structure"
    };

    const debugKey = `debug-${Date.now()}`;

    // 1. Prisma Attempt
    try {
        const item = await prisma.menu_items.create({
            data: {
                label: 'Debug Item',
                url: '/debug',
                key: debugKey,
                module_key: 'general',
                icon: 'Bug',
                sort_order: 9999,
                permission_code: 'debug:view',
                is_global: true,
                parent_id: null,
                created_at: new Date(),
                updated_at: new Date()
            }
        });
        results.prismaAttempt = { success: true, item };
        // Cleanup
        await prisma.menu_items.delete({ where: { id: item.id } });
    } catch (e: any) {
        results.prismaAttempt = {
            success: false,
            error: e.message,
            code: e.code,
            meta: e.meta,
            stack: e.stack
        };
    }

    // 2. Raw SQL Attempt (If Prisma failed, or just to compare)
    try {
        const rawId = crypto.randomUUID();
        await prisma.$executeRaw`
            INSERT INTO "menu_items" 
            ("id", "label", "url", "key", "module_key", "icon", "sort_order", "permission_code", "is_global", "parent_id", "created_at", "updated_at")
            VALUES 
            (${rawId}::uuid, 'Debug Raw', '/debug-raw', ${debugKey + '-raw'}, 'general', 'Bug', 9999, 'debug:view', true, NULL, NOW(), NOW())
        `;
        results.rawSqlAttempt = { success: true, id: rawId };

        // Cleanup
        await prisma.$executeRaw`DELETE FROM "menu_items" WHERE "id" = ${rawId}::uuid`;

    } catch (e: any) {
        results.rawSqlAttempt = {
            success: false,
            error: e.message, // PostgreSQL error message is usually very descriptive
            detail: (e as any).detail,
            hint: (e as any).hint,
            keyValue: (e as any).keyValue
        };
    }

    return NextResponse.json(results, { status: 200 });
}
