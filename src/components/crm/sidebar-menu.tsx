'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Circle } from 'lucide-react'
import * as LucideIcons from 'lucide-react'
import { cn } from '@/lib/utils'

export function SidebarMenu({ groups }: { groups: any[] }) {
    const pathname = usePathname();

    return (
        <nav className="flex-1 px-3 space-y-6 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800 pb-10">
            {groups.map((group) => (
                <div key={group.key || group.module?.module_key || Math.random()} className="space-y-1">
                    {/* Group Label */}
                    {/* Only show if multiple groups, but usually 'General' is implicit. 
              If group has a label like 'Sales', we show it. */}
                    {(group.label || (group.module?.name && group.module.name !== 'General')) && (
                        <h3 className="px-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 mt-4">
                            {group.label || group.module?.name}
                        </h3>
                    )}

                    <div className="space-y-0.5">
                        {group.items.map((item: any) => (
                            <MenuItem key={item.key || item.id} item={item} pathname={pathname} />
                        ))}
                    </div>
                </div>
            ))}
        </nav>
    )
}

function MenuItem({ item, pathname, level = 0 }: { item: any, pathname: string, level?: number }) {
    // Dynamic Icon
    const Icon = (LucideIcons as any)[item.icon] || Circle;
    const hasChildren = item.other_menu_items && item.other_menu_items.length > 0;

    // Auto-expand logic: check if current URL starts with this item's children URLs or exact match
    // Simple includes check
    const isChildActive = (children: any[]): boolean => {
        return children.some(child =>
            (child.url && child.url !== '#' && pathname.startsWith(child.url)) ||
            (child.other_menu_items && isChildActive(child.other_menu_items))
        );
    };

    const active = item.url && item.url !== '#' ? pathname === item.url : false;
    const childActive = hasChildren ? isChildActive(item.other_menu_items) : false;

    const [isOpen, setIsOpen] = useState(childActive);

    const toggle = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsOpen(!isOpen);
    };

    // Indentation logic
    // Level 0: px-3
    // Level 1: pl-9 (36px)
    // Level 2: pl-12
    const paddingLeft = level === 0 ? 12 : (level * 12) + 12;

    // Render Leaf Node
    if (!hasChildren) {
        return (
            <Link
                href={item.url || '#'}
                className={cn(
                    "group flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200",
                    active
                        ? "bg-blue-600 text-white shadow-md shadow-blue-900/20"
                        : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50"
                )}
                style={{ paddingLeft: level === 0 ? '12px' : `${(level * 16) + 12}px` }}
            >
                {Icon && <Icon size={18} strokeWidth={active ? 2.5 : 2} className={cn("transition-colors", active ? "text-white" : "text-slate-500 group-hover:text-slate-300")} />}
                <span>{item.label}</span>
            </Link>
        )
    }

    // Render Parent Node (Accordion)
    // Note: Parent itself might have a URL (clickable) OR just be a toggle. 
    // Normally folders are toggles. If it has URL '#', it's a toggle.
    const isToggleOnly = !item.url || item.url === '#';

    return (
        <div className="space-y-0.5">
            <button
                onClick={toggle}
                className={cn(
                    "w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 group text-slate-400 hover:text-slate-100 hover:bg-slate-800/50",
                    isOpen && "text-slate-200"
                )}
                style={{ paddingLeft: level === 0 ? '12px' : `${(level * 16) + 12}px` }}
            >
                <div className="flex items-center gap-3">
                    {Icon && <Icon size={18} strokeWidth={2} className={cn("text-slate-500 group-hover:text-slate-300", isOpen && "text-slate-300")} />}
                    <span>{item.label}</span>
                </div>
                <ChevronRight
                    size={14}
                    className={cn("transition-transform duration-200 opacity-50", isOpen && "rotate-90")}
                />
            </button>

            <div className={cn(
                "overflow-hidden transition-all duration-300 ease-in-out space-y-0.5",
                isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
            )}>
                {item.other_menu_items.map((sub: any) => (
                    <MenuItem key={sub.key || sub.id} item={sub} pathname={pathname} level={level + 1} />
                ))}
            </div>
        </div>
    )
}
