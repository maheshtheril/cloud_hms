
import Link from "next/link"
import { Building2, Phone, Mail } from "lucide-react"
import { getSuppliers } from "@/app/actions/purchase"
import { SearchInput } from "@/components/ui/search-input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { SupplierActions } from "@/components/hms/purchasing/supplier-actions"
import { CreateSupplierButton } from "@/components/hms/purchasing/create-supplier-button"

export default async function SuppliersPage(props: { searchParams: Promise<{ q?: string, page?: string }> }) {
    const searchParams = await props.searchParams;
    const query = searchParams?.q || "";
    const currentPage = Number(searchParams?.page) || 1;
    const limit = 10;

    const { data: suppliers, total, totalPages } = await getSuppliers({ query, page: currentPage, limit });

    return (
        <div className="space-y-6 h-full flex flex-col">
            <div className="flex justify-between items-center shrink-0">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight dark:text-white">Suppliers</h1>
                    <p className="text-gray-500 text-sm mt-1 dark:text-neutral-400">Manage vendor relationships.</p>
                </div>
                <CreateSupplierButton />
            </div>

            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-sm flex flex-col flex-1 min-h-0 overflow-hidden">
                <div className="p-4 border-b border-neutral-100 dark:border-neutral-800 flex gap-4 items-center bg-neutral-50/50 dark:bg-neutral-900/50">
                    <SearchInput placeholder="Search suppliers by name, email, phone..." />
                </div>

                <div className="flex-1 overflow-auto p-0">
                    {!suppliers || suppliers.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center p-8">
                            <div className="bg-neutral-50 dark:bg-neutral-800 p-4 rounded-full mb-4">
                                <Building2 className="h-8 w-8 text-neutral-400" />
                            </div>
                            <h3 className="text-lg font-medium text-neutral-900 dark:text-white">No suppliers found</h3>
                            <p className="text-neutral-500 text-sm mt-1">Try adjusting your search or create a new one.</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent border-neutral-100 dark:border-neutral-800">
                                    <TableHead className="w-[300px]">Vendor</TableHead>
                                    <TableHead>Contact</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {suppliers.map((supplier: any) => (
                                    <TableRow key={supplier.id} className="border-neutral-100 dark:border-neutral-800 group hover:bg-neutral-50/50 dark:hover:bg-neutral-800/50">
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-3">
                                                <div className="h-9 w-9 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs ring-1 ring-inset ring-indigo-500/10">
                                                    {supplier.name.substring(0, 2).toUpperCase()}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-neutral-900 dark:text-white font-medium">{supplier.name}</span>
                                                    {supplier.metadata?.gstin && (
                                                        <span className="text-[10px] text-neutral-500 font-mono">GST: {supplier.metadata.gstin}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-1 text-xs text-neutral-600 dark:text-neutral-400">
                                                {supplier.metadata?.email && (
                                                    <div className="flex items-center gap-2">
                                                        <Mail className="h-3 w-3 opacity-70" /> {supplier.metadata.email}
                                                    </div>
                                                )}
                                                {supplier.metadata?.phone && (
                                                    <div className="flex items-center gap-2">
                                                        <Phone className="h-3 w-3 opacity-70" /> {supplier.metadata.phone}
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ring-1 ring-inset ${supplier.is_active
                                                ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-900/20 dark:text-emerald-400'
                                                : 'bg-red-50 text-red-700 ring-red-600/20'
                                                }`}>
                                                {supplier.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <SupplierActions supplier={supplier} />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </div>

                {/* Pagination Footer */}
                <div className="p-4 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 flex items-center justify-between">
                    <span className="text-xs text-neutral-500">
                        Page {currentPage} of {totalPages || 1} ({total} suppliers)
                    </span>
                    <div className="flex gap-2">
                        <Link
                            href={{ query: { q: query, page: currentPage - 1 } }}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md border bg-white dark:bg-neutral-800 dark:border-neutral-700 transition-colors ${currentPage <= 1
                                ? 'opacity-50 pointer-events-none text-neutral-400'
                                : 'hover:bg-neutral-50 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300'
                                }`}
                        >
                            Previous
                        </Link>
                        <Link
                            href={{ query: { q: query, page: currentPage + 1 } }}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md border bg-white dark:bg-neutral-800 dark:border-neutral-700 transition-colors ${currentPage >= (totalPages || 1)
                                ? 'opacity-50 pointer-events-none text-neutral-400'
                                : 'hover:bg-neutral-50 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300'
                                }`}
                        >
                            Next
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
