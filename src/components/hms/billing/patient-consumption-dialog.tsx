'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Package, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { recordPatientConsumption } from '@/app/actions/billing';
import { SearchableSelect, Option } from "@/components/ui/searchable-select";
import { getBillableItems } from '@/app/actions/billing';

interface PatientConsumptionDialogProps {
    patientId: string;
    patientName: string;
}

export function PatientConsumptionDialog({ patientId, patientName }: PatientConsumptionDialogProps) {
    const { toast } = useToast();
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Simple state for one item at a time (MVP)
    const [selectedItem, setSelectedItem] = useState<Option | null>(null);
    const [quantity, setQuantity] = useState<number>(1);
    const [notes, setNotes] = useState('');

    // Fetch items function for SearchableSelect
    const fetchItems = async (query: string): Promise<Option[]> => {
        const res = await getBillableItems();
        if (res.success && res.data) {
            return res.data
                .filter((i: any) => i.label.toLowerCase().includes(query.toLowerCase()))
                .map((i: any) => ({
                    id: i.id,
                    label: i.label,
                    subLabel: i.description ? `₹${i.price} • ${i.description}` : `₹${i.price}`,
                    price: i.price,
                    original: i
                }));
        }
        return [];
    };

    const handleSubmit = async () => {
        if (!selectedItem) {
            toast({ title: "Select Item", description: "Please search and select an item.", variant: "destructive" });
            return;
        }

        setIsSubmitting(true);
        try {
            const itemPayload = {
                productId: selectedItem.id,
                name: selectedItem.label,
                price: selectedItem.price,
                quantity: quantity
            };

            const res = await recordPatientConsumption(patientId, [itemPayload], notes);

            if (res.error) {
                toast({ title: "Error", description: res.error, variant: "destructive" });
            } else {
                toast({
                    title: "Added to Bill",
                    description: `Successfully added ${quantity}x ${selectedItem.label}.`,
                    className: "bg-blue-50 border-blue-200 text-blue-900"
                });
                setIsOpen(false);
                setSelectedItem(null);
                setQuantity(1);
                setNotes('');
            }
        } catch (err) {
            toast({ title: "Error", description: "Failed to record consumption", variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="border-dashed border-gray-400 text-gray-700 hover:text-blue-600 hover:border-blue-400 hover:bg-blue-50">
                    <Plus className="h-4 w-4 mr-2" />
                    Record Usage
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md bg-white">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5 text-blue-600" />
                        Record Consumption
                    </DialogTitle>
                    <p className="text-sm text-gray-500">Add medicines or services to {patientName}'s running bill.</p>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Search Item</Label>
                        <SearchableSelect
                            onSearch={fetchItems}
                            onChange={(val, opt) => setSelectedItem(opt || null)}
                            value={selectedItem?.id}
                            valueLabel={selectedItem?.label}
                            placeholder="Search medicine, service..."
                            className="w-full"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Quantity</Label>
                            <Input
                                type="number"
                                min={1}
                                value={quantity}
                                onChange={e => setQuantity(Number(e.target.value))}
                                className="font-bold h-10"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Unit Price (₹)</Label>
                            <div className="h-10 px-3 py-2 bg-gray-100 rounded-md text-gray-500 flex items-center font-mono text-sm">
                                {selectedItem?.price || 0}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Notes (Optional)</Label>
                        <Input
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                            placeholder="e.g. Bedside administration"
                            className="h-10"
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white">
                        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add to Bill"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
