import { Construction } from 'lucide-react';

export default function WardsPage() {
    return (
        <div className="flex flex-col items-center justify-center p-8 text-center min-h-[50vh]">
            <div className="bg-muted/50 p-6 rounded-full mb-4">
                <Construction className="h-12 w-12 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight mb-2">Wards & Clinics Management</h1>
            <p className="text-muted-foreground max-w-md">
                This module is currently under development. Here you will be able to manage hospital wards, clinics, beds, and room availability.
            </p>
        </div>
    );
}
