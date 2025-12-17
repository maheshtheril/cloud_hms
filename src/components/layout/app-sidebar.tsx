'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Activity, Users, Calendar, LayoutDashboard, Settings, LogOut, Stethoscope, Receipt, Shield, Menu, ChevronLeft, ChevronRight, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { CompanySwitcher } from '@/components/company-switcher';
import { logout } from '@/app/actions/auth';

// Map icon strings to components
const IconMap: any = {
    LayoutDashboard, Users, Calendar, Stethoscope, Receipt, Settings, Shield
};

export function AppSidebar({ menuItems, currentCompany, children }: { menuItems: any[], currentCompany: any, children: React.ReactNode }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="flex h-screen bg-neutral-950 text-white font-sans overflow-hidden">
            {/* Desktop Sidebar */}
            <aside
                className={`${collapsed ? 'w-16' : 'w-72'} 
                bg-black/40 border-r border-white/5 
                hidden md:flex flex-col transition-all duration-300 ease-in-out relative z-10 backdrop-blur-xl`}
            >
                {/* ... Sidebar Content reused ... */}
                <SidebarContent
                    menuItems={menuItems}
                    currentCompany={currentCompany}
                    collapsed={collapsed}
                    setCollapsed={() => setCollapsed(!collapsed)}
                />
            </aside>

            {/* Mobile Sidebar Drawer */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-50 md:hidden flex">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setMobileMenuOpen(false)}
                    />

                    {/* Drawer */}
                    <aside className="relative w-72 max-w-xs bg-neutral-900 border-r border-white/10 flex flex-col h-full shadow-2xl animate-in slide-in-from-left duration-200">
                        <div className="flex items-center justify-between p-4 border-b border-white/5">
                            <span className="font-bold text-lg">Menu</span>
                            <button
                                onClick={() => setMobileMenuOpen(false)}
                                className="p-2 hover:bg-white/10 rounded-full"
                            >
                                <PanelLeftClose className="h-5 w-5" />
                            </button>
                        </div>
                        <SidebarContent
                            menuItems={menuItems}
                            currentCompany={currentCompany}
                            collapsed={false}
                            isMobile={true}
                            startCollapsed={false}
                            onLinkClick={() => setMobileMenuOpen(false)}
                        />
                    </aside>
                </div>
            )}

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-neutral-950 relative">
                {/* Mobile Header (Hidden on Desktop) */}
                <header className="bg-black/50 backdrop-blur-md border-b border-white/5 p-4 md:hidden flex justify-between items-center z-20">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setMobileMenuOpen(true)}
                            className="mr-2 p-1 hover:bg-white/10 rounded"
                        >
                            <Menu className="h-6 w-6 text-neutral-400" />
                        </button>
                        <Activity className="text-indigo-600 h-6 w-6" />
                        <span className="font-bold text-white">HMS Core</span>
                    </div>
                </header>

                <div className="flex-1 overflow-auto relative">
                    {children}
                </div>
            </main>
        </div>
    );
}

// Extracted Content for reuse
function SidebarContent({ menuItems, currentCompany, collapsed, setCollapsed, isMobile, onLinkClick }: any) {
    return (
        <>
            {/* Header / Company Switcher */}
            <div className={`p-4 border-b border-white/5 flex items-center ${collapsed ? 'justify-center' : 'justify-between'}`}>
                {!collapsed ? (
                    <CompanySwitcher initialActiveCompany={currentCompany} />
                ) : (
                    <div className="h-8 w-8 rounded bg-indigo-600 flex items-center justify-center font-bold text-white">
                        {currentCompany?.name?.substring(0, 2).toUpperCase() || "HM"}
                    </div>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-2 space-y-6 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                {menuItems.map((group: any) => (
                    <div key={group.module.module_key} className={collapsed ? "text-center" : ""}>
                        {/* Module Header */}
                        {!collapsed && group.module.module_key !== 'general' && (
                            <h3 className="px-3 text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-2 font-mono">
                                {group.module.name}
                            </h3>
                        )}
                        {collapsed && group.module.module_key !== 'general' && (
                            <div className="h-px w-8 bg-white/10 mx-auto mb-2 mt-4"></div>
                        )}

                        <div className="space-y-0.5">
                            {group.items.map((item: any) => (
                                <MenuItem
                                    key={item.key}
                                    item={item}
                                    collapsed={collapsed}
                                    onClick={onLinkClick}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </nav>

            {/* Collapse Toggle (Bottom) - Only Desktop */}
            {!isMobile && setCollapsed && (
                <button
                    onClick={setCollapsed}
                    className="absolute -right-3 top-20 bg-neutral-800 text-neutral-400 p-1 rounded-full border border-white/10 hover:text-white hover:bg-indigo-600 transition-colors z-50 shadow-lg"
                >
                    {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
                </button>
            )}

            {/* Footer / SignOut */}
            <div className="p-2 border-t border-white/5">
                <form action={logout}>
                    <button className={`flex items-center justify-center gap-3 w-full px-3 py-2 text-neutral-400 hover:text-red-400 hover:bg-white/5 rounded-lg transition-all group ${collapsed ? 'px-0' : ''}`}>
                        <LogOut className="h-5 w-5 group-hover:scale-110 transition-transform" />
                        {!collapsed && <span className="text-sm font-medium">Sign Out</span>}
                    </button>
                </form>
            </div>
        </>
    )
}

function MenuItem({ item, level = 0, collapsed, onClick }: { item: any, level?: number, collapsed: boolean, onClick?: () => void }) {
    const Icon = IconMap[item.icon] || (level === 0 ? Activity : null);
    const hasChildren = item.other_menu_items && item.other_menu_items.length > 0;
    const [expanded, setExpanded] = useState(false);

    // If collapsed, we don't show children inline usually, needs popover. 
    // For MVP, we might hide children or just show icon.
    // Let's assume if collapsed, clicking opens? OR we just disable nesting visual in collapsed.

    if (collapsed) {
        return (
            <Link
                href={item.url || '#'}
                onClick={onClick}
                className="flex items-center justify-center p-2 rounded-lg text-neutral-400 hover:bg-indigo-600 hover:text-white transition-all group relative"
                title={item.label}
            >
                {Icon && <Icon className="h-5 w-5" />}
                {/* Tooltip-ish */}
                <div className="absolute left-full ml-2 px-2 py-1 bg-neutral-900 border border-white/10 text-xs text-white rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                    {item.label}
                </div>
            </Link>
        )
    }

    if (hasChildren) {
        return (
            <div className="group/item">
                <button
                    onClick={() => setExpanded(!expanded)}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-neutral-400 hover:bg-white/5 hover:text-white rounded-lg transition-colors justify-between text-sm font-medium`}
                >
                    <span className="flex items-center gap-3">
                        {Icon && <Icon className="h-[18px] w-[18px]" />}
                        <span>{item.label}</span>
                    </span>
                    <span className={`transform transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`}>
                        <ChevronRight className="h-3 w-3" />
                    </span>
                </button>
                {expanded && (
                    <div className="space-y-0.5 mt-1 ml-4 border-l border-white/10 pl-2">
                        {item.other_menu_items.map((sub: any) => (
                            <MenuItem key={sub.key} item={sub} level={level + 1} collapsed={collapsed} onClick={onClick} />
                        ))}
                    </div>
                )}
            </div>
        );
    }

    return (
        <Link
            href={item.url || '#'}
            onClick={onClick}
            className={`flex items-center gap-3 px-3 py-2 text-neutral-400 hover:bg-white/5 hover:text-white rounded-lg transition-colors text-sm font-medium`}
        >
            {Icon && <Icon className="h-[18px] w-[18px]" />}
            <span>{item.label}</span>
        </Link>
    )
}
