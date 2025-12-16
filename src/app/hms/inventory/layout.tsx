import { InventorySidebar } from "@/components/inventory/inventory-sidebar"

export default function InventoryLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-full">
            <InventorySidebar />
            <div className="flex-1 overflow-auto bg-muted/10 p-6">
                {children}
            </div>
        </div>
    )
}
