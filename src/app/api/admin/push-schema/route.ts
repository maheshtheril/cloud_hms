import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');

    // Security: require a secret key
    if (secret !== 'push-schema-now-2024') {
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        console.log('[Schema Push] Starting...');
        const { stdout, stderr } = await execAsync('npx prisma db push --accept-data-loss --skip-generate', {
            env: { ...process.env },
            timeout: 120000 // 2 minutes
        });

        console.log('[Schema Push] Success:', stdout);
        return Response.json({
            success: true,
            output: stdout,
            stderr: stderr
        });
    } catch (error: any) {
        console.error('[Schema Push] Failed:', error);
        return Response.json({
            success: false,
            error: error.message,
            stdout: error.stdout,
            stderr: error.stderr
        }, { status: 500 });
    }
}
