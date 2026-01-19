
'use client'

import { useState, useMemo } from 'react'
import * as Icons from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { upsertMenu, deleteMenu } from "@/app/actions/developer/menu-actions"
import { toast } from "sonner"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

// Icon Renderer
const DynamicIcon = ({ name, className }: { name: string, className?: string }) => {
    const IconComponent = (Icons as any)[name] || Icons.HelpCircle;
    return <IconComponent className={className} />;
};

export default function MenuManagerClient({ initialMenus, modules }: { initialMenus: any[], modules: any[] }) {
    const [menus, setMenus] = useState(initialMenus);
    const [selectedModule, setSelectedModule] = useState<string>('all');
    const [editingItem, setEditingItem] = useState<any | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // Build Tree
    const tree = useMemo(() => {
        const map = new Map();
        const roots: any[] = [];
        // Clone to avoid mutation issues
        const items = menus.map(m => ({ ...m, children: [] }));

        items.forEach(item => map.set(item.id, item));

        items.forEach(item => {
            if (item.parent_id && map.has(item.parent_id)) {
                map.get(item.parent_id).children.push(item);
            } else {
                roots.push(item);
            }
        });

        // Sort
        const sortFn = (a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0);
        roots.sort(sortFn);
        map.forEach(item => item.children.sort(sortFn));

        return roots;
    }, [menus]);

    // Handle Save
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const res = await upsertMenu(editingItem);
            if (res.error) {
                toast.error(res.error);
            } else {
                toast.success("Menu Saved!");
                window.location.reload(); // Simple refresh for now to sync perfectly
            }
        } catch (e) {
            toast.error("Failed to save");
        } finally {
            setIsSaving(false);
        }
    };

    // Handle Delete
    const handleDelete = async () => {
        if (!confirm("Are you sure? Only delete if it has no children!")) return;
        await deleteMenu(editingItem.id);
        window.location.reload();
    };

    const handleNew = () => {
        setEditingItem({
            id: undefined,
            label: 'New Menu',
            key: '',
            url: '#',
            module_key: 'system',
            icon: 'Circle',
            sort_order: 100,
            is_global: true,
            parent_id: 'root'
        });
    }

    // Recursive Renderer
    const renderNode = (node: any, depth = 0) => {
        // Filter: Hide if top-level doesn't match selected module (if filtering enabled)
        // Note: We only filter ROOTS for now to keep tree context
        if (depth === 0 && selectedModule !== 'all' && node.module_key !== selectedModule) return null;

        const isSelected = editingItem?.id === node.id;

        return (
            <div key={node.id} className="select-none">
                <div
                    onClick={() => setEditingItem(node)}
                    className={cn(
                        "flex items-center gap-3 p-2 hover:bg-slate-100 cursor-pointer border-b border-slate-50 transition-colors",
                        isSelected && "bg-blue-50 border-l-4 border-l-blue-600 border-b-blue-100"
                    )}
                    style={{ paddingLeft: `${depth * 24 + 12}px` }}
                >
                    <div className="w-8 h-8 flex items-center justify-center rounded bg-white border text-slate-500 shadow-sm">
                        <DynamicIcon name={node.icon} className="w-4 h-4" />
                    </div>

                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <span className={cn("font-medium", isSelected ? "text-blue-700" : "text-slate-700")}>
                                {node.label}
                            </span>
                            <Badge variant="outline" className="text-[10px] uppercase font-mono text-slate-400">
                                {node.module_key}
                            </Badge>
                            {node.permission_code && (
                                <Badge variant="secondary" className="text-[10px] bg-amber-50 text-amber-600 border-amber-100">
                                    {node.permission_code}
                                </Badge>
                            )}
                        </div>
                        <div className="text-xs text-slate-400 font-mono mt-0.5">{node.key} • {node.url}</div>
                    </div>

                    <div className="text-xs font-mono text-slate-300 w-8 text-right">
                        {node.sort_order}
                    </div>
                </div>

                {/* Children */}
                {node.children && node.children.length > 0 && (
                    <div className="border-l border-dashed border-slate-200 ml-6">
                        {node.children.map((child: any) => renderNode(child, depth + 1))}
                    </div>
                )}
            </div>
        )
    };

    return (
        <div className="flex h-full">
            {/* Sidebar / Tree */}
            <div className="w-[450px] border-r bg-white flex flex-col h-full overflow-hidden">
                <div className="p-4 border-b space-y-4 bg-slate-50/50">
                    <div className="flex gap-2">
                        <Select value={selectedModule} onValueChange={setSelectedModule}>
                            <SelectTrigger>
                                <SelectValue placeholder="Filter Module" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Modules</SelectItem>
                                {modules.map(m => (
                                    <SelectItem key={m.module_key} value={m.module_key}>{m.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button onClick={handleNew} size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                            <Icons.Plus className="w-4 h-4 mr-1" /> New
                        </Button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto pb-20">
                    {tree.map(node => renderNode(node))}
                    {tree.length === 0 && <div className="p-8 text-center text-slate-400">No menus found.</div>}
                </div>
            </div>

            {/* Editor Panel */}
            <div className="flex-1 bg-slate-50 p-8 overflow-y-auto">
                {editingItem ? (
                    <Card className="max-w-2xl mx-auto shadow-sm border-slate-200">
                        <form onSubmit={handleSave}>
                            <div className="p-6 border-b bg-white rounded-t-lg">
                                <h2 className="text-lg font-bold flex items-center gap-2">
                                    <DynamicIcon name={editingItem.icon} className="w-5 h-5 text-blue-600" />
                                    {editingItem.id ? 'Edit Menu Item' : 'Create Menu Item'}
                                </h2>
                            </div>

                            <div className="p-6 space-y-6 bg-white">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Label</Label>
                                        <Input
                                            value={editingItem.label}
                                            onChange={e => setEditingItem({ ...editingItem, label: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Sort Order</Label>
                                        <Input
                                            type="number"
                                            value={editingItem.sort_order}
                                            onChange={e => setEditingItem({ ...editingItem, sort_order: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Key (Unique ID)</Label>
                                        <Input
                                            value={editingItem.key}
                                            onChange={e => setEditingItem({ ...editingItem, key: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Lucide Icon Name</Label>
                                        <div className="flex gap-2">
                                            <div className="w-10 h-10 flex items-center justify-center border rounded bg-slate-50">
                                                <DynamicIcon name={editingItem.icon} className="w-5 h-5" />
                                            </div>
                                            <Input
                                                value={editingItem.icon}
                                                onChange={e => setEditingItem({ ...editingItem, icon: e.target.value })}
                                            />
                                        </div>
                                        <div className="text-xs text-slate-400">e.g. LayoutDashboard, Users, Settings</div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>URL</Label>
                                    <Input
                                        value={editingItem.url}
                                        onChange={e => setEditingItem({ ...editingItem, url: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Module</Label>
                                        <Select
                                            value={editingItem.module_key}
                                            onValueChange={(val) => setEditingItem({ ...editingItem, module_key: val })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {modules.map(m => (
                                                    <SelectItem key={m.module_key} value={m.module_key}>{m.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Parent</Label>
                                        <Select
                                            value={editingItem.parent_id || 'root'}
                                            onValueChange={(val) => setEditingItem({ ...editingItem, parent_id: val })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="No Parent (Root)" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="root">-- Root Level --</SelectItem>
                                                {/* Only show potential parents (roots) to avoid deep circles for now */}
                                                {menus.filter(m => !m.parent_id && m.id !== editingItem.id).map(m => (
                                                    <SelectItem key={m.id} value={m.id}>{m.label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Permission Code</Label>
                                    <Input
                                        value={editingItem.permission_code || ''}
                                        onChange={e => setEditingItem({ ...editingItem, permission_code: e.target.value })}
                                        placeholder="e.g. system:admin"
                                    />
                                </div>
                            </div>

                            <div className="p-6 bg-slate-50 border-t rounded-b-lg flex justify-between items-center">
                                {editingItem.id && (
                                    <Button type="button" variant="destructive" onClick={handleDelete} disabled={isSaving}>
                                        Delete
                                    </Button>
                                )}
                                <div className="flex gap-3 ml-auto">
                                    <Button type="button" variant="ghost" onClick={() => setEditingItem(null)}>Cancel</Button>
                                    <Button type="submit" disabled={isSaving}>
                                        {isSaving ? 'Saving...' : 'Save Changes'}
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </Card>
                ) : (
                    <div className="h-full flex items-center justify-center text-slate-400">
                        <div className="text-center">
                            <Icons.MousePointer2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>Select a menu item to edit</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
