
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { getMenuItems } from '@/app/actions/navigation';

export default async function DebugMenusPage() {
    const session = await auth();
    const dbItems = await prisma.menu_items.findMany({
        where: {
            OR: [
                { module_key: 'hms' },
                { key: { contains: 'accounting' } }
            ]
        },
        orderBy: { sort_order: 'asc' }
    });

    const navItems = await getMenuItems();

    return (
        <div className="p-10 bg-white text-black dark:bg-black dark:text-white">
            <h1 className="text-2xl font-bold mb-5">Menu Debugger</h1>

            <div className="grid grid-cols-2 gap-10">
                <div>
                    <h2 className="text-xl font-semibold mb-3">Database Raw Items (HMS/Accounting)</h2>
                    <pre className="text-xs bg-gray-100 dark:bg-gray-900 p-4 rounded overflow-auto h-[600px]">
                        {JSON.stringify(dbItems, null, 2)}
                    </pre>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-3">Resolved Navigation Tree</h2>
                    <pre className="text-xs bg-gray-100 dark:bg-gray-900 p-4 rounded overflow-auto h-[600px]">
                        {JSON.stringify(navItems, null, 2)}
                    </pre>
                </div>
            </div>
        </div>
    );
}
