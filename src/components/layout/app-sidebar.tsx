'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Activity, Users, Calendar, LayoutDashboard, Settings, LogOut, Stethoscope, Receipt, Shield, Menu, ChevronLeft, ChevronRight, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { CompanySwitcher } from '@/components/company-switcher';
import { logout } from '@/app/actions/auth';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Map icon strings to components
const IconMap: any = {
    LayoutDashboard, Users, Calendar, Stethoscope, Receipt, Settings, Shield
};

export function AppSidebar({ menuItems, currentCompany, user, children }: { menuItems: any[], currentCompany: any, user?: any, children: React.ReactNode }) {
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
                    user={user}
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
                            user={user}
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
function SidebarContent({ menuItems, currentCompany, user, collapsed, setCollapsed, isMobile, onLinkClick }: any) {
    return (
        <>
            {/* Header / Company Logo */}
            <div className={`p-4 border-b border-white/5 flex items-center ${collapsed ? 'justify-center' : 'justify-between'}`}>
                {!collapsed ? (
                    <div className="w-full">
                        {currentCompany?.logo_url ? (
                            <div className="flex items-center gap-3">
                                <img src={currentCompany.logo_url} alt={currentCompany.name} className="h-8 object-contain max-w-[120px]" />
                                {/* Optional: Show switcher or name if logo is icon-only? Assuming logo includes name or is brand. 
                                    Let's keep CompanySwitcher logic but use logo if present inside it or replace it?
                                    User asked "where to save compony logo. i want to show this logo in sidebar".
                                    Strict replacement or enhancement? Enhancing CompanySwitcher might be best, but CompanySwitcher source is separate.
                                    Let's just show the logo ABOVE or INSTEAD of switcher default text.
                                    Actually, CompanySwitcher handles company switching logic. I should probably pass logoUrl TO CompanySwitcher if I can, 
                                    or just render a header here.
                                    Let's render a custom header area.
                                */}
                                <CompanySwitcher initialActiveCompany={currentCompany} />
                            </div>
                        ) : (
                            <CompanySwitcher initialActiveCompany={currentCompany} />
                        )}
                    </div>
                ) : (
                    <div className="h-8 w-8 rounded bg-indigo-600 flex items-center justify-center font-bold text-white overflow-hidden">
                        {currentCompany?.logo_url ? (
                            <img src={currentCompany.logo_url} alt="Logo" className="w-full h-full object-cover" />
                        ) : (
                            currentCompany?.name?.substring(0, 2).toUpperCase() || "HM"
                        )}
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

            {/* Footer / User Profile */}
            <div className="p-3 border-t border-white/5 bg-black/20">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'} gap-3 w-full p-2 rounded-xl hover:bg-white/5 transition-all group outline-none`}>
                            <div className="flex items-center gap-3 overflow-hidden text-left">
                                <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-inner ring-2 ring-white/10 group-hover:ring-white/20 transition-all">
                                    {user?.name?.substring(0, 2).toUpperCase() || 'U'}
                                </div>
                                {!collapsed && (
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-sm font-semibold text-white truncate group-hover:text-indigo-400 transition-colors">{user?.name || 'User'}</span>
                                        <span className="text-xs text-neutral-500 truncate">{user?.email || ''}</span>
                                    </div>
                                )}
                            </div>
                            {!collapsed && (
                                <ChevronRight className="h-4 w-4 text-neutral-600 group-hover:text-white transition-colors" />
                            )}
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="right" align="end" className="w-56 bg-neutral-900 border-white/10 text-white p-2 backdrop-blur-xl shadow-2xl rounded-xl">
                        <div className="px-2 py-1.5 border-b border-white/10 mb-1">
                            <p className="text-sm font-semibold text-white">{user?.name}</p>
                            <p className="text-xs text-neutral-400">{user?.email}</p>
                        </div>
                        <DropdownMenuItem className="focus:bg-white/10 focus:text-white cursor-pointer rounded-lg text-neutral-300">
                            <div className="flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                <span>Profile</span>
                            </div>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="focus:bg-white/10 focus:text-white cursor-pointer rounded-lg text-neutral-300 mb-1">
                            <div className="flex items-center gap-2">
                                <Settings className="h-4 w-4" />
                                <span>Settings</span>
                            </div>
                        </DropdownMenuItem>

                        <DropdownMenuItem asChild className="focus:bg-red-500/20 focus:text-red-400 cursor-pointer rounded-lg text-red-500 mt-1">
                            <form action={logout} className="w-full">
                                <button className="w-full flex items-center gap-2 px-2 py-1.5">
                                    <LogOut className="h-4 w-4" />
                                    <span>Sign Out</span>
                                </button>
                            </form>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
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
