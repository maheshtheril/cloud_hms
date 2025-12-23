'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as LucideIcons from 'lucide-react';
import {
    Menu, ChevronLeft, ChevronRight, PanelLeftClose,
    Building2, Activity, LogOut, User, Settings, Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { CompanySwitcher } from '@/components/company-switcher';
import { logout } from '@/app/actions/auth';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Dynamically retrieve icons
const getIcon = (iconName: string) => {
    // @ts-ignore - Dynamic access to Lucide icons
    const Icon = LucideIcons[iconName];
    return Icon || Activity; // Default to Activity if not found
};

export function AppSidebar({ menuItems, currentCompany, user, children }: { menuItems: any[], currentCompany: any, user?: any, children: React.ReactNode }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Prevent hydration mismatch for collision detection/rendering
    useEffect(() => {
        setMounted(true);
        const savedState = localStorage.getItem('sidebar-collapsed');
        if (savedState) {
            setCollapsed(JSON.parse(savedState));
        }

        const handleResize = () => {
            if (window.innerWidth < 1024) {
                setCollapsed(false); // Reset on mobile to allow drawer
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleCollapse = () => {
        const newState = !collapsed;
        setCollapsed(newState);
        localStorage.setItem('sidebar-collapsed', JSON.stringify(newState));
    };

    if (!mounted) return null; // or a skeleton

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-black font-sans overflow-hidden">
            {/* Desktop Sidebar */}
            <motion.aside
                initial={false}
                animate={{ width: collapsed ? 80 : 280 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                    "hidden md:flex flex-col z-30 relative",
                    "bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl",
                    "border-r border-slate-200 dark:border-zinc-800",
                    "shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)]"
                )}
            >
                <SidebarContent
                    menuItems={menuItems}
                    currentCompany={currentCompany}
                    user={user}
                    collapsed={collapsed}
                    setCollapsed={toggleCollapse}
                    isMobile={false}
                />
            </motion.aside>

            {/* Mobile Sidebar System */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
                            onClick={() => setMobileMenuOpen(false)}
                        />
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="fixed top-0 left-0 bottom-0 w-[85vw] max-w-sm z-50 bg-white dark:bg-zinc-900 border-r border-slate-200 dark:border-zinc-800 shadow-2xl md:hidden"
                        >
                            <SidebarContent
                                menuItems={menuItems}
                                currentCompany={currentCompany}
                                user={user}
                                collapsed={false}
                                isMobile={true}
                                onLinkClick={() => setMobileMenuOpen(false)}
                                onClose={() => setMobileMenuOpen(false)}
                            />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-50 dark:bg-black relative w-full">
                {/* Mobile Header */}
                <header className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-zinc-800 p-4 md:hidden flex justify-between items-center z-20 sticky top-0">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setMobileMenuOpen(true)}
                            className="p-2 -ml-2 text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl transition-colors active:scale-95"
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                                <Activity className="text-white h-5 w-5" />
                            </div>
                            <span className="font-bold text-slate-900 dark:text-white text-lg tracking-tight">HMS Core</span>
                        </div>
                    </div>
                    <Avatar className="h-9 w-9 border-2 border-white dark:border-zinc-800 shadow-sm">
                        <AvatarImage src={user?.image} />
                        <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white font-bold text-xs">
                            {user?.name?.substring(0, 2).toUpperCase() || 'U'}
                        </AvatarFallback>
                    </Avatar>
                </header>

                <div className="flex-1 overflow-auto relative scroll-smooth scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                    {children}
                </div>
            </main>
        </div>
    );
}

function SidebarContent({ menuItems, currentCompany, user, collapsed, setCollapsed, isMobile, onLinkClick, onClose }: any) {
    const canSwitchCompany = user?.isAdmin || user?.isTenantAdmin;
    const [searchText, setSearchText] = useState('');

    const filteredMenuItems = menuItems.map((group: any) => ({
        ...group,
        items: group.items.filter((item: any) =>
            item.label.toLowerCase().includes(searchText.toLowerCase()) ||
            (item.other_menu_items && item.other_menu_items.some((sub: any) => sub.label.toLowerCase().includes(searchText.toLowerCase())))
        )
    })).filter((group: any) => group.items.length > 0);

    return (
        <div className="flex flex-col h-full">
            {/* Header / Company Logo */}
            <div className={cn(
                "flex items-center h-20 px-6 shrink-0 transition-all duration-300",
                collapsed ? "justify-center px-2" : "justify-between"
            )}>
                {!collapsed ? (
                    <div className="flex items-center justify-between w-full">
                        <div className="flex-1 min-w-0 mr-4">
                            {canSwitchCompany ? (
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        {currentCompany?.logo_url ? (
                                            <img src={currentCompany.logo_url} alt={currentCompany.name} className="h-9 w-9 object-contain rounded-lg bg-white p-1 shadow-sm ring-1 ring-slate-200 dark:ring-zinc-800" />
                                        ) : (
                                            <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20">
                                                <Building2 size={16} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <CompanySwitcher initialActiveCompany={currentCompany} />
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <div className="h-9 w-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                                        <Building2 size={18} />
                                    </div>
                                    <div className="font-bold text-lg tracking-tight text-slate-900 dark:text-white truncate">
                                        {currentCompany?.name}
                                    </div>
                                </div>
                            )}
                        </div>
                        {isMobile && (
                            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                                <PanelLeftClose className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 shadow-lg shadow-indigo-500/30 text-white font-bold text-sm">
                        {currentCompany?.name?.substring(0, 1).toUpperCase() || "H"}
                    </div>
                )}
            </div>

            {/* Search (Only Expanded) */}
            {!collapsed && !isMobile && (
                <div className="px-4 mb-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                            placeholder="Search modules..."
                            className="pl-9 bg-slate-100/50 dark:bg-zinc-800/50 border-slate-200 dark:border-zinc-800 h-9 text-sm focus:bg-white dark:focus:bg-zinc-900 transition-all"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                    </div>
                </div>
            )}

            {/* Scrollable Navigation */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-8 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                {filteredMenuItems.map((group: any) => (
                    <div key={group.module.module_key} className={collapsed ? "text-center" : ""}>
                        {!collapsed && (
                            <h3 className="px-3 text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-2 font-mono">
                                {group.module.name}
                            </h3>
                        )}
                        {collapsed && (
                            <div className="h-px w-8 bg-slate-200 dark:bg-zinc-800 mx-auto mb-4 mt-2"></div>
                        )}

                        <div className="space-y-1">
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

                {filteredMenuItems.length === 0 && searchText && (
                    <div className="text-center p-4 text-slate-400 text-sm">
                        No modules found for "{searchText}"
                    </div>
                )}
            </div>

            {/* Desktop Collapse Toggle */}
            {!isMobile && setCollapsed && (
                <button
                    onClick={setCollapsed}
                    className="absolute -right-3 top-24 bg-white dark:bg-zinc-900 text-slate-400 dark:text-zinc-500 p-1.5 rounded-full border border-slate-200 dark:border-zinc-800 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-600 dark:hover:border-indigo-500 transition-all shadow-md z-50 hover:scale-110 active:scale-95"
                >
                    {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
                </button>
            )}

            {/* User Profile Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50 backdrop-blur-sm">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className={cn(
                            "flex items-center gap-3 w-full p-2 rounded-xl transition-all group outline-none",
                            collapsed ? "justify-center" : "justify-between hover:bg-white dark:hover:bg-zinc-800 hover:shadow-sm"
                        )}>
                            <div className="flex items-center gap-3 overflow-hidden text-left">
                                <Avatar className="h-10 w-10 border-2 border-white dark:border-zinc-700 shadow-sm ring-2 ring-transparent group-hover:ring-indigo-100 dark:group-hover:ring-indigo-900 transition-all">
                                    <AvatarImage src={user?.image} />
                                    <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-xs">
                                        {user?.name?.substring(0, 2).toUpperCase() || 'U'}
                                    </AvatarFallback>
                                </Avatar>

                                {!collapsed && (
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                            {user?.name || user?.email?.split('@')[0] || 'User'}
                                        </span>
                                        <span className="text-xs text-slate-500 dark:text-zinc-500 truncate">{user?.email || ''}</span>
                                    </div>
                                )}
                            </div>
                            {!collapsed && (
                                <Settings className="h-4 w-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors animate-spin-slow" />
                            )}
                        </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent side="right" align="end" className="w-64 bg-white/95 dark:bg-zinc-900/95 border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-slate-100 p-2 backdrop-blur-xl shadow-2xl rounded-2xl mb-2 ml-2">
                        <div className="px-3 py-2.5 bg-slate-50 dark:bg-zinc-800/50 rounded-lg mb-2">
                            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{user?.name}</p>
                            <p className="text-xs text-slate-500 font-mono mt-0.5">{user?.email}</p>
                        </div>

                        <DropdownMenuLabel className="text-xs text-slate-400 font-normal uppercase tracking-wider ml-1">Account</DropdownMenuLabel>

                        <DropdownMenuItem asChild className="focus:bg-indigo-50 dark:focus:bg-indigo-900/20 focus:text-indigo-700 dark:focus:text-indigo-400 cursor-pointer rounded-lg mb-1 h-10">
                            <Link href="/settings/profile" className="flex items-center gap-3 px-2 w-full">
                                <User className="h-4 w-4" />
                                <span>My Profile</span>
                            </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem asChild className="focus:bg-indigo-50 dark:focus:bg-indigo-900/20 focus:text-indigo-700 dark:focus:text-indigo-400 cursor-pointer rounded-lg mb-1 h-10">
                            <Link href="/settings" className="flex items-center gap-3 px-2 w-full">
                                <Settings className="h-4 w-4" />
                                <span>Settings</span>
                            </Link>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator className="bg-slate-200 dark:bg-zinc-800 my-2" />

                        <DropdownMenuItem
                            onClick={async () => {
                                await logout();
                            }}
                            className="focus:bg-red-50 dark:focus:bg-red-900/20 focus:text-red-600 dark:focus:text-red-400 cursor-pointer rounded-lg text-red-600 dark:text-red-500 flex items-center gap-3 px-2 h-10 font-medium"
                        >
                            <LogOut className="h-4 w-4" />
                            <span>Sign Out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}

function MenuItem({ item, level = 0, collapsed, onClick }: { item: any, level?: number, collapsed: boolean, onClick?: () => void }) {
    const pathname = usePathname();
    const isActive = pathname === item.url;
    const hasChildren = item.other_menu_items && item.other_menu_items.length > 0;
    const [expanded, setExpanded] = useState(false);

    // Auto-expand if child is active
    useEffect(() => {
        if (hasChildren && item.other_menu_items.some((child: any) => pathname === child.url)) {
            setExpanded(true);
        }
    }, [pathname, hasChildren, item.other_menu_items]);

    const Icon = getIcon(item.icon);

    if (collapsed) {
        return (
            <Link
                href={item.url || '#'}
                onClick={onClick}
                className={cn(
                    "flex items-center justify-center w-10 h-10 mx-auto rounded-xl transition-all duration-300 group relative",
                    isActive
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/40"
                        : "text-slate-400 dark:text-zinc-500 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-indigo-600 dark:hover:text-indigo-400"
                )}
            >
                <div className="relative z-10">
                    <Icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />
                </div>

                {/* Tooltip */}
                <div className="absolute left-full ml-4 px-3 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-black text-sm font-medium rounded-lg opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all pointer-events-none whitespace-nowrap z-50 shadow-xl border border-white/10 dark:border-black/5">
                    {item.label}
                    {/* Arrow */}
                    <div className="absolute -left-1 top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900 dark:border-r-white"></div>
                </div>
            </Link>
        )
    }

    if (hasChildren) {
        return (
            <div className="group/item pb-1">
                <button
                    onClick={() => setExpanded(!expanded)}
                    className={cn(
                        "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                        expanded
                            ? "bg-slate-100 dark:bg-zinc-800/50 text-indigo-700 dark:text-indigo-300"
                            : "text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800/50 hover:text-slate-900 dark:hover:text-slate-200"
                    )}
                >
                    <span className="flex items-center gap-3">
                        <Icon className={cn("h-5 w-5 opacity-70", expanded && "opacity-100 text-indigo-500")} />
                        <span>{item.label}</span>
                    </span>
                    <ChevronRight className={cn(
                        "h-4 w-4 text-slate-400 transition-transform duration-200",
                        expanded && "rotate-90 text-indigo-500"
                    )} />
                </button>

                <AnimatePresence>
                    {expanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                        >
                            <div className="pt-1 pl-4 space-y-1 border-l-2 border-slate-100 dark:border-zinc-800 ml-5 my-1">
                                {item.other_menu_items.map((sub: any) => (
                                    <MenuItem key={sub.key} item={sub} level={level + 1} collapsed={collapsed} onClick={onClick} />
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    }

    return (
        <Link
            href={item.url || '#'}
            onClick={onClick}
            className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative overflow-hidden",
                isActive
                    ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300"
                    : "text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800/50 hover:text-slate-900 dark:hover:text-slate-200"
            )}
        >
            {isActive && (
                <motion.div
                    layoutId="activeLink"
                    className="absolute inset-0 bg-indigo-100/50 dark:bg-indigo-500/10 rounded-xl"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
            )}
            <Icon className={cn(
                "h-5 w-5 relative z-10 transition-colors",
                isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 group-hover:text-indigo-500"
            )} strokeWidth={isActive ? 2.5 : 2} />
            <span className="relative z-10">{item.label}</span>
        </Link>
    )
}
