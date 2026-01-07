
import { auth } from "@/auth";
import { getTaxRates, getSuppliers } from "@/app/actions/inventory";
import { prisma } from "@/lib/prisma";

export default async function InventoryDebugPage() {
    const session = await auth();
    const taxes = await getTaxRates();
    const suppliers = await getSuppliers();

    // Raw DB Check (if user is admin)
    let rawCompanyTaxes: any[] = [];
    let rawTaxMaps: any[] = [];
    if (session?.user?.companyId) {
        rawCompanyTaxes = await prisma.company_taxes.findMany({
            where: { company_id: session.user.companyId }
        });
        rawTaxMaps = await prisma.company_tax_maps.findMany({
            where: { company_id: session.user.companyId },
            include: { tax_rates: true }
        });
    }

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-8">
            <h1 className="text-2xl font-bold">Inventory Debug Info</h1>

            <section className="space-y-2">
                <h2 className="text-xl font-semibold border-b">Session</h2>
                <pre className="bg-gray-100 p-4 rounded overflow-auto text-xs">
                    {JSON.stringify(session, null, 2)}
                </pre>
            </section>

            <section className="space-y-2">
                <h2 className="text-xl font-semibold border-b">getTaxRates() Result</h2>
                <pre className="bg-gray-100 p-4 rounded overflow-auto text-xs">
                    {JSON.stringify(taxes, null, 2)}
                </pre>
            </section>

            <section className="space-y-2">
                <h2 className="text-xl font-semibold border-b">getSuppliers() Result</h2>
                <pre className="bg-gray-100 p-4 rounded overflow-auto text-xs">
                    {JSON.stringify(suppliers, null, 2)}
                </pre>
            </section>

            <section className="space-y-2">
                <h2 className="text-xl font-semibold border-b">Raw DB: company_taxes</h2>
                <pre className="bg-gray-100 p-4 rounded overflow-auto text-xs">
                    {JSON.stringify(rawCompanyTaxes, null, 2)}
                </pre>
            </section>

            <section className="space-y-2">
                <h2 className="text-xl font-semibold border-b">Raw DB: company_tax_maps</h2>
                <pre className="bg-gray-100 p-4 rounded overflow-auto text-xs">
                    {JSON.stringify(rawTaxMaps, null, 2)}
                </pre>
            </section>
        </div>
    );
}
