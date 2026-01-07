
"use client";

import { useState, useEffect } from "react";
import {
    Banknote,
    History,
    Lock,
    Unlock,
    Calculator,
    ArrowRight,
    Loader2,
    AlertCircle,
    CheckCircle2,
    FileText
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { getCurrentShift, startShift, getShiftSummary, closeShift, getShiftHistory } from "@/app/actions/shift";
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const DENOMINATIONS = [
    { value: 2000, label: "2000" }, // Mostly phased out but some might have it
    { value: 500, label: "500" },
    { value: 200, label: "200" },
    { value: 100, label: "100" },
    { value: 50, label: "50" },
    { value: 20, label: "20" },
    { value: 10, label: "10" },
    { value: 5, label: "5" },
    { value: 2, label: "2" },
    { value: 1, label: "1" },
];

export function ShiftManager() {
    const [shift, setShift] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isStartOpen, setIsStartOpen] = useState(false);
    const [isEndOpen, setIsEndOpen] = useState(false);
    const [openingBalance, setOpeningBalance] = useState("0");
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [history, setHistory] = useState<any[]>([]);

    // End shift state
    const [quantities, setQuantities] = useState<Record<number, string>>({});
    const [summary, setSummary] = useState<any>(null);
    const [summaryLoading, setSummaryLoading] = useState(false);
    const [notes, setNotes] = useState("");

    const refreshShift = async () => {
        setLoading(true);
        const data = await getCurrentShift();
        setShift(data);
        setLoading(false);
    };

    useEffect(() => {
        refreshShift();
    }, []);

    const handleStartShift = async () => {
        const amount = parseFloat(openingBalance);
        if (isNaN(amount)) {
            toast.error("Invalid opening balance");
            return;
        }

        const res = await startShift(amount);
        if (res.success) {
            toast.success("Shift started successfully");
            setIsStartOpen(false);
            refreshShift();
        } else {
            toast.error(res.error || "Failed to start shift");
        }
    };

    const loadSummary = async () => {
        if (!shift) return;
        setSummaryLoading(true);
        const res = await getShiftSummary(shift.id);
        if (res.success) {
            setSummary(res.summary);
        } else {
            toast.error("Failed to load shift summary");
        }
        setSummaryLoading(false);
    };

    const loadHistory = async () => {
        const res = await getShiftHistory();
        if (res.success) {
            setHistory(res.shifts);
            setIsHistoryOpen(true);
        }
    };

    const totalCashPhysical = DENOMINATIONS.reduce((sum, d) => {
        const qty = parseInt(quantities[d.value] || "0");
        return sum + (qty * d.value);
    }, 0);

    const handleCloseShift = async () => {
        if (!shift) return;

        setLoading(true);
        const res = await closeShift(shift.id, totalCashPhysical, quantities);
        if (res.success) {
            toast.success("Shift closed and reconciled successfully");
            setIsEndOpen(false);
            setShift(null);
            setQuantities({});
            setSummary(null);
            refreshShift();
        } else {
            toast.error(res.error || "Failed to close shift");
            setLoading(false);
        }
    };

    if (loading && !shift) {
        return (
            <Card className="w-full h-32 flex items-center justify-center">
                <Loader2 className="animate-spin text-muted-foreground" />
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            <Card className="overflow-hidden border-2 border-primary/20 shadow-lg">
                <div className={`h-1 w-full ${shift ? 'bg-green-500' : 'bg-slate-300'}`} />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="space-y-1">
                        <CardTitle className="text-xl font-bold flex items-center gap-2">
                            {shift ? <Unlock className="h-5 w-5 text-green-500" /> : <Lock className="h-5 w-5 text-slate-400" />}
                            Reception Cash Counter
                        </CardTitle>
                        <CardDescription>
                            {shift
                                ? `Active Session since ${format(new Date(shift.start_time), 'hh:mm aa')}`
                                : "No active shift. Start a session to collect payments."}
                        </CardDescription>
                    </div>
                    <Badge variant={shift ? "default" : "secondary"} className={shift ? "bg-green-100 text-green-700 hover:bg-green-100" : ""}>
                        {shift ? "SHIFT OPEN" : "SHIFT CLOSED"}
                    </Badge>
                </CardHeader>
                <CardContent>
                    {!shift ? (
                        <div className="py-6 flex flex-col items-center justify-center space-y-4">
                            <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center">
                                <Banknote className="h-8 w-8 text-slate-400" />
                            </div>
                            <div className="text-center">
                                <p className="text-sm text-muted-foreground">Proper shift tracking ensures financial accountability</p>
                            </div>
                            <Button onClick={() => setIsStartOpen(true)} className="w-full sm:w-auto px-8">
                                Start New Shift
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
                            <div className="p-4 bg-slate-50 rounded-lg border">
                                <Label className="text-xs uppercase text-muted-foreground font-bold">Opening Float</Label>
                                <div className="text-2xl font-bold">₹{Number(shift.opening_balance).toLocaleString()}</div>
                            </div>
                            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                                <Label className="text-xs uppercase text-blue-600 font-bold">User</Label>
                                <div className="text-lg font-semibold truncate capitalize">Current Desk</div>
                            </div>
                            <div className="flex items-center justify-end">
                                <Button variant="outline" onClick={() => { setIsEndOpen(true); loadSummary(); }} className="gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700">
                                    <Lock className="h-4 w-4" />
                                    Close Shift & Cash-Up
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
                <CardFooter className="bg-slate-50 border-t py-2 flex justify-between items-center bg-slate-50/50">
                    <Button variant="ghost" size="sm" onClick={loadHistory} className="text-xs text-muted-foreground gap-2">
                        <History className="h-3 w-3" /> View Shift History
                    </Button>
                    {shift && (
                        <span className="text-[10px] text-muted-foreground">Session ID: {shift.id.slice(0, 8)}</span>
                    )}
                </CardFooter>
            </Card>

            {/* History Dialog */}
            <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <History className="h-5 w-5" />
                            Recent Shift Closures
                        </DialogTitle>
                    </DialogHeader>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date & Time</TableHead>
                                <TableHead>System</TableHead>
                                <TableHead>Actual</TableHead>
                                <TableHead>Variance</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {history.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">No recent shifts found</TableCell>
                                </TableRow>
                            ) : (
                                history.map((s) => (
                                    <TableRow key={s.id}>
                                        <TableCell className="text-sm">
                                            <div className="font-semibold">{format(new Date(s.end_time), 'MMM dd, yyyy')}</div>
                                            <div className="text-[10px] text-muted-foreground">{format(new Date(s.start_time), 'hh:mm')} - {format(new Date(s.end_time), 'hh:mm')}</div>
                                        </TableCell>
                                        <TableCell>₹{Number(s.system_balance).toLocaleString()}</TableCell>
                                        <TableCell>₹{Number(s.closing_balance).toLocaleString()}</TableCell>
                                        <TableCell className={Number(s.difference) === 0 ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                                            ₹{Number(s.difference).toLocaleString()}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="text-[10px] bg-slate-50 capitalize">{s.status}</Badge>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </DialogContent>
            </Dialog>

            {/* Start Shift Dialog */}
            <Dialog open={isStartOpen} onOpenChange={setIsStartOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Start New Shift</DialogTitle>
                        <DialogDescription>
                            Enter the opening cash balance in your drawer (Float).
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="opening">Opening Cash (Float)</Label>
                            <div className="relative">
                                <span className="absolute left-3 top-2.5 text-muted-foreground font-bold">₹</span>
                                <Input
                                    id="opening"
                                    className="pl-8 text-lg font-bold"
                                    value={openingBalance}
                                    onChange={(e) => setOpeningBalance(e.target.value)}
                                    type="number"
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsStartOpen(false)}>Cancel</Button>
                        <Button onClick={handleStartShift}>Open Counter</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* End Shift Dialog (World Class Cash Counter) */}
            <Dialog open={isEndOpen} onOpenChange={setIsEndOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Calculator className="h-5 w-5" />
                            Shift Closure & Cash Reconciliation
                        </DialogTitle>
                        <DialogDescription>
                            Physically count your cash denominations to reconcile with the system.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-4">
                        {/* Left Column: Denominations */}
                        <div className="space-y-4">
                            <h3 className="font-bold text-lg border-b pb-2 flex items-center gap-2">
                                <Banknote className="h-4 w-4" />
                                Physical Cash Count
                            </h3>
                            <div className="grid gap-3">
                                {DENOMINATIONS.map((d) => (
                                    <div key={d.value} className="flex items-center gap-4 p-2 rounded-md hover:bg-slate-50 group">
                                        <div className="w-20 font-bold text-slate-500">₹{d.label}</div>
                                        <div className="text-slate-400">×</div>
                                        <Input
                                            type="number"
                                            className="w-24 text-center font-bold"
                                            placeholder="0"
                                            value={quantities[d.value] || ""}
                                            onChange={(e) => setQuantities({ ...quantities, [d.value]: e.target.value })}
                                            onFocus={(e) => e.target.select()}
                                        />
                                        <div className="flex-1 text-right font-mono font-bold text-slate-700">
                                            = ₹{(parseInt(quantities[d.value] || "0") * d.value).toLocaleString()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="pt-4 border-t flex justify-between items-center px-4">
                                <span className="text-lg font-bold">Actual Cash Total:</span>
                                <span className="text-2xl font-black text-primary">₹{totalCashPhysical.toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Right Column: System Summary & Variance */}
                        <div className="space-y-6 bg-slate-50 p-6 rounded-xl border border-slate-200">
                            <div>
                                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                    <FileText className="h-4 w-4" />
                                    System Summary
                                </h3>
                                {summaryLoading ? (
                                    <div className="flex items-center gap-2 text-muted-foreground py-4">
                                        <Loader2 className="h-4 w-4 animate-spin" /> Calculating session totals...
                                    </div>
                                ) : summary ? (
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-sm">
                                            <span>Opening Float</span>
                                            <span className="font-bold">₹{Number(shift?.opening_balance || 0).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span>Cash Collected</span>
                                            <span className="font-bold text-green-600">+ ₹{summary.cash.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-lg border-t-2 pt-2 font-black">
                                            <span>Expected Cash</span>
                                            <span>₹{(Number(shift?.opening_balance || 0) + summary.cash).toLocaleString()}</span>
                                        </div>

                                        <div className="pt-6">
                                            <h4 className="text-xs uppercase font-bold text-muted-foreground mb-2">Non-Cash Collections</h4>
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span>Card Payments</span>
                                                    <span className="font-semibold text-blue-600">₹{summary.card.toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span>UPI / Online</span>
                                                    <span className="font-semibold text-purple-600">₹{summary.upi.toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span>Other / Insurance</span>
                                                    <span className="font-semibold text-slate-600">₹{summary.other.toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : null}
                            </div>

                            {/* Variance Section */}
                            {!summaryLoading && summary && (
                                <div className={`p-4 rounded-lg border-2 flex flex-col items-center justify-center space-y-2 ${totalCashPhysical - (Number(shift?.opening_balance || 0) + summary.cash) === 0
                                    ? "bg-green-50 border-green-200 text-green-700"
                                    : Math.abs(totalCashPhysical - (Number(shift?.opening_balance || 0) + summary.cash)) < 0.1
                                        ? "bg-green-50 border-green-200 text-green-700"
                                        : "bg-red-50 border-red-200 text-red-700"
                                    }`}>
                                    <div className="text-sm font-bold uppercase tracking-wider">Cash Variance</div>
                                    <div className="text-3xl font-black">
                                        {totalCashPhysical - (Number(shift?.opening_balance || 0) + summary.cash) > 0 ? "+" : ""}
                                        ₹{(totalCashPhysical - (Number(shift?.opening_balance || 0) + summary.cash)).toLocaleString()}
                                    </div>
                                    <div className="flex items-center gap-1 text-xs">
                                        {totalCashPhysical - (Number(shift?.opening_balance || 0) + summary.cash) === 0 ? (
                                            <><CheckCircle2 className="h-3 w-3" /> Balanced Shift</>
                                        ) : (
                                            <><AlertCircle className="h-3 w-3" /> Discrepancy Found</>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label>Shift Notes</Label>
                                <Input
                                    placeholder="Reason for discrepancy or general notes..."
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                />
                            </div>

                            <div className="pt-4">
                                <Button
                                    className="w-full h-12 text-lg font-bold"
                                    disabled={loading || summaryLoading}
                                    onClick={handleCloseShift}
                                >
                                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lock className="mr-2 h-4 w-4" />}
                                    FINALIZE & CLOSE SHIFT
                                </Button>
                                <p className="text-[10px] text-center mt-2 text-muted-foreground">
                                    By closing, you acknowledge the physical cash count matches your declaration.
                                </p>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
