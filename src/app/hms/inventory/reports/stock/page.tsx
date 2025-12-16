"use client";

import { useEffect, useState } from "react";
import { getStockReport } from "@/app/actions/inventory";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, ArrowLeft, ArrowRight, RefreshCw, FileDown } from "lucide-react";
import { useRouter } from "next/navigation";
// import { useDebounce } from "@/hooks/use-debounce"; // Removed missing import
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

// Simple local debounce if hook missing, but usually typical in this codebase
function useDebounceValue<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
}

export default function StockReportPage() {
    const router = useRouter();
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounceValue(search, 500);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any[]>([]);
    const [meta, setMeta] = useState({ total: 0, page: 1, totalPages: 1 });

    const loadData = async () => {
        setLoading(true);
        const result = await getStockReport(debouncedSearch, page);
        if (result.success && result.data) {
            setData(result.data);
            setMeta(result.meta!);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, [debouncedSearch, page]);

    const handleExport = () => {
        // Simple CSV export
        const headers = ["SKU", "Product Name", "Category", "UOM", "Stock On Hand", "Value", "Status"];
        const rows = data.map(item => [
            item.sku,
            item.name,
            item.category,
            item.uom,
            item.stockOnHand,
            item.stockValue,
            item.status
        ]);

        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `stock_report_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
    };

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-8">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div className="flex flex-col">
                    <h1 className="font-semibold text-lg md:text-2xl">Stock Report</h1>
                    <p className="text-sm text-muted-foreground">Real-time inventory valuation and stock levels</p>
                </div>
                <div className="ml-auto flex items-center gap-2">
                    <Button variant="outline" onClick={handleExport} disabled={loading || data.length === 0}>
                        <FileDown className="mr-2 h-4 w-4" />
                        Export
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => loadData()}>
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                </div>
            </div>

            <Card className="flex-1">
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by SKU or Name..."
                                className="pl-8"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="text-sm text-muted-foreground">
                            Total Items: {meta.total}
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>SKU</TableHead>
                                    <TableHead>Product Name</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>UOM</TableHead>
                                    <TableHead className="text-right">Stock On Hand</TableHead>
                                    <TableHead className="text-right">Est. Value (Cost)</TableHead>
                                    <TableHead className="text-center">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading && data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-24 text-center">
                                            <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
                                        </TableCell>
                                    </TableRow>
                                ) : data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                                            No products found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    data.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell className="font-medium">{item.sku}</TableCell>
                                            <TableCell>{item.name}</TableCell>
                                            <TableCell>{item.category}</TableCell>
                                            <TableCell className="uppercase text-xs text-muted-foreground">{item.uom}</TableCell>
                                            <TableCell className="text-right font-bold">
                                                {item.stockOnHand}
                                            </TableCell>
                                            <TableCell className="text-right text-muted-foreground">
                                                ₹{item.stockValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge
                                                    variant={item.status === 'In Stock' ? 'default' : (item.status === 'Low Stock' ? 'secondary' : 'destructive')}
                                                    className={item.status === 'In Stock' ? 'bg-green-600 hover:bg-green-700' : ''}
                                                >
                                                    {item.status}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    {meta.totalPages > 1 && (
                        <div className="flex items-center justify-end gap-2 py-4">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1 || loading}
                            >
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                            <span className="text-sm text-muted-foreground">
                                Page {meta.page} of {meta.totalPages}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}
                                disabled={page === meta.totalPages || loading}
                            >
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
