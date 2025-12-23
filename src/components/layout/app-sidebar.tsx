'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Activity, Users, Calendar, LayoutDashboard, Settings, LogOut, Stethoscope, Receipt, Shield,
    Briefcase, Target, Database, FileText, UploadCloud, Menu, ChevronLeft, ChevronRight, PanelLeftClose, PanelLeftOpen,
    Zap, PieChart, MessageSquare, Phone, Mail, Home
} from 'lucide-react';

import { CompanySwitcher } from '@/components/company-switcher';
import { logout } from '@/app/actions/auth';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Map icon strings to components - Expanded for all modules
const IconMap: any = {
    // Shared / Core
    LayoutDashboard, Users, Calendar, Settings, Shield, Activity,

    // CRM
    Briefcase, Target, Database, FileText, UploadCloud,
    Zap, PieChart, MessageSquare, Phone, Mail, Home,

    // HMS
    Stethoscope, Receipt,
};

export function AppSidebar({ menuItems, currentCompany, user, children }: { menuItems: any[], currentCompany: any, user?: any, children: React.ReactNode }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Persist sidebar state
    useEffect(() => {
        const savedState = localStorage.getItem('sidebar-collapsed');
        if (savedState) {
            setCollapsed(JSON.parse(savedState));
        }

        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth < 768) {
                setCollapsed(false); // Always expanded in drawer mode
            }
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const toggleCollapse = () => {
        const newState = !collapsed;
        setCollapsed(newState);
        localStorage.setItem('sidebar-collapsed', JSON.stringify(newState));
    };

    return (
        <div className="flex h-screen bg-neutral-950 text-white font-sans overflow-hidden">
            {/* Desktop Sidebar */}
            <aside
                className={`${collapsed ? 'w-20' : 'w-72'} 
                bg-black/40 border-r border-white/5 
                hidden md:flex flex-col transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] relative z-30 backdrop-blur-xl shadow-2xl`}
            >
                <SidebarContent
                    menuItems={menuItems}
                    currentCompany={currentCompany}
                    user={user}
                    collapsed={collapsed}
                    setCollapsed={toggleCollapse}
                    isMobile={false}
                />
            </aside>

            {/* Mobile Sidebar System */}
            {/* Backdrop */}
            <div
                className={`fixed inset-0 z-40 bg-black/80 backdrop-blur-sm transition-opacity duration-300 md:hidden
                ${mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setMobileMenuOpen(false)}
            />

            {/* Drawer */}
            <div className={`fixed top-0 left-0 bottom-0 w-[85vw] max-w-sm z-50 bg-neutral-900 border-r border-white/10 shadow-2xl transform transition-transform duration-300 ease-out md:hidden ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <SidebarContent
                    menuItems={menuItems}
                    currentCompany={currentCompany}
                    user={user}
                    collapsed={false}
                    isMobile={true}
                    onLinkClick={() => setMobileMenuOpen(false)}
                    onClose={() => setMobileMenuOpen(false)}
                />
            </div>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-neutral-950 relative w-full">
                {/* Mobile Header */}
                <header className="bg-black/40 backdrop-blur-md border-b border-white/5 p-4 md:hidden flex justify-between items-center z-20 sticky top-0">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setMobileMenuOpen(true)}
                            className="p-2 -ml-2 text-neutral-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors active:scale-95"
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg">
                                <Activity className="text-white h-5 w-5" />
                            </div>
                            <span className="font-bold text-white text-lg tracking-tight">HMS Core</span>
                        </div>
                    </div>
                    {/* Tiny User Avatar for Mobile Header */}
                    <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs shadow-inner overflow-hidden">
                        {user?.image ? (
                            <img src={user.image} alt={user.name || 'User'} className="w-full h-full object-cover" />
                        ) : (
                            user?.name?.substring(0, 2).toUpperCase() || 'U'
                        )}
                    </div>
                </header>

                <div className="flex-1 overflow-auto relative scroll-smooth">
                    {children}
                </div>
            </main>
        </div>
    );
}

// Extracted Content for reuse
function SidebarContent({ menuItems, currentCompany, user, collapsed, setCollapsed, isMobile, onLinkClick, onClose }: any) {
    return (
        <>
            {/* Header / Company Logo */}
            <div className={`p-4 border-b border-white/5 flex items-center ${collapsed ? 'justify-center' : 'justify-between'} h-16`}>
                {!collapsed ? (
                    <div className="w-full flex items-center justify-between">
                        <div className="flex-1">
                            {currentCompany?.logo_url ? (
                                <div className="flex items-center gap-3">
                                    <img src={currentCompany.logo_url} alt={currentCompany.name} className="h-8 object-contain max-w-[120px]" />
                                    <CompanySwitcher initialActiveCompany={currentCompany} />
                                </div>
                            ) : (
                                <CompanySwitcher initialActiveCompany={currentCompany} />
                            )}
                        </div>
                        {isMobile && onClose && (
                            <button
                                onClick={onClose}
                                className="p-2 -mr-2 text-neutral-400 hover:text-white hover:bg-white/10 rounded-xl transition-all active:scale-95"
                            >
                                <PanelLeftClose className="h-5 w-5" />
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-700 flex items-center justify-center font-bold text-white overflow-hidden shadow-lg transform transition-transform hover:scale-105 cursor-pointer" title="Expand">
                        {currentCompany?.logo_url ? (
                            <img src={currentCompany.logo_url} alt="Logo" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-xs tracking-tighter">
                                {currentCompany?.name?.substring(0, 2).toUpperCase() || "HM"}
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-3 space-y-6 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                {menuItems.map((group: any) => (
                    <div key={group.module.module_key} className={collapsed ? "text-center" : ""}>
                        {/* Module Header */}
                        {!collapsed && group.module.module_key !== 'general' && (
                            <h3 className="px-3 text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-2 font-mono ml-1">
                                {group.module.name}
                            </h3>
                        )}
                        {collapsed && group.module.module_key !== 'general' && (
                            <div className="h-px w-8 bg-white/5 mx-auto mb-3 mt-4"></div>
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
                                <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-inner ring-2 ring-white/10 group-hover:ring-white/20 transition-all overflow-hidden">
                                    {user?.image ? (
                                        <img src={user.image} alt={user.name || 'User'} className="w-full h-full object-cover" />
                                    ) : (
                                        user?.name?.substring(0, 2).toUpperCase() || 'U'
                                    )}
                                </div>
                                {!collapsed && (
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-sm font-semibold text-white truncate group-hover:text-indigo-400 transition-colors">
                                            {user?.name || user?.email?.split('@')[0] || 'User'}
                                        </span>
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
                        <DropdownMenuItem asChild className="focus:bg-white/10 focus:text-white cursor-pointer rounded-lg text-neutral-300">
                            <Link href="/settings/profile" className="flex items-center gap-2 px-2 py-1.5 w-full outline-none">
                                <Users className="h-4 w-4" />
                                <span>Profile</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="focus:bg-white/10 focus:text-white cursor-pointer rounded-lg text-neutral-300 mb-1">
                            <Link href="/settings/profile" className="flex items-center gap-2 px-2 py-1.5 w-full outline-none">
                                <Settings className="h-4 w-4" />
                                <span>Settings</span>
                            </Link>
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
