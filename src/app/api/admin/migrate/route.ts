
import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import { auth } from '@/auth';

const execAsync = promisify(exec);

export async function GET() {
    const session = await auth();
    // Basic protection: Ensure user is logged in. 
    // Ideally this should check for ADMIN role, but for emergency fixing we allow authenticated users (or restrict via ENV if needed)
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        console.log("Starting manual migration...");
        const { stdout, stderr } = await execAsync('npx prisma migrate deploy');
        console.log("Migration output:", stdout);
        if (stderr) console.error("Migration stderr:", stderr);

        return NextResponse.json({
            success: true,
            message: "Migration completed successfully",
            output: stdout,
            errorOutput: stderr
        });
    } catch (error: any) {
        console.error("Migration failed:", error);
        return NextResponse.json({
            success: false,
            error: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}
