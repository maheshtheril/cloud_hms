
import { GET } from '@/app/api/debug/seed-menus/route';

export default async function SeedPage() {
    console.log("Triggering seed from page...");
    const res = await GET();
    const data = await res.json();

    return (
        <div className="p-10 bg-black text-green-400 font-mono">
            <h1 className="text-xl font-bold mb-4">Manual Seed Trigger</h1>
            <pre>{JSON.stringify(data, null, 2)}</pre>
            <p className="mt-4 text-white">
                If success is true, please refresh your main navigation.
            </p>
        </div>
    );
}
