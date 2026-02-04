
import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        version: 'v4-emergency-fix',
        commit: process.env.VERCEL_GIT_COMMIT_SHA || 'unknown',
        timestamp: new Date().toISOString()
    });
}
