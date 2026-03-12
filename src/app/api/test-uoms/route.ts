// A temporary route to inspect UOMs
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
    const uoms = await prisma.hms_uom.findMany({ select: { id: true, name: true, uom_type: true, category_id: true } });
    const cats = await prisma.hms_uom_category.findMany({ select: { id: true, name: true } });
    return NextResponse.json({ uoms, cats });
}
