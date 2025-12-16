import { prisma } from "@/lib/prisma"

export default async function GlobalSettingsPage() {
    const countries = await prisma.countries.findMany({
        take: 10,
        orderBy: { name: 'asc' }
    });

    const currencies = await prisma.currencies.findMany({
        take: 10,
        orderBy: { code: 'asc' }
    });

    return (
        <div className="min-h-screen p-8 bg-gray-50">
            <div className="max-w-6xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Global Settings</h1>
                    <p className="text-gray-600">Manage global configurations like countries and currencies.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Countries (Preview)</h2>
                        {countries.length === 0 ? (
                            <p className="text-gray-500 italic">No countries found.</p>
                        ) : (
                            <ul className="space-y-2">
                                {countries.map(c => (
                                    <li key={c.id} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                                        <span>{c.name}</span>
                                        <span className="text-sm text-gray-400">{c.code}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Currencies (Preview)</h2>
                        {currencies.length === 0 ? (
                            <p className="text-gray-500 italic">No currencies found.</p>
                        ) : (
                            <ul className="space-y-2">
                                {currencies.map(c => (
                                    <li key={c.id} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                                        <div className="flex flex-col">
                                            <span className="font-medium">{c.code}</span>
                                            <span className="text-xs text-gray-500">{c.name}</span>
                                        </div>
                                        <span className="text-lg">{c.symbol}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
