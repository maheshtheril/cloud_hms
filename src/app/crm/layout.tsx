
import Link from 'next/link'
import { Activity, Users, Calendar, LayoutDashboard, Settings, LogOut, Stethoscope, Receipt, Shield, Menu, Kanban, Briefcase } from 'lucide-react'
import { signOut } from '@/auth'
import { getMenuItems } from '../actions/navigation'
import { CompanySwitcher } from '@/components/company-switcher'
import { getCurrentCompany } from '../actions/company'
import { checkCrmLoginStatus } from '@/app/actions/crm/auth'
import { LoginWorkflowWrapper } from '@/components/crm/login-workflow/wrapper'

// Import globals to ensure CSS is present (redundant but safe)
import "@/app/globals.css";

// Map icon strings to components
const IconMap: any = {
    LayoutDashboard, Users, Calendar, Stethoscope, Receipt, Settings, Shield, Kanban, Briefcase
};

export default async function CRMLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const menuItems = await getMenuItems();
    const currentCompany = await getCurrentCompany();
    const loginStatus = await checkCrmLoginStatus();

    // Inline styles to bypass Tailwind build failures
    const sidebarStyle = {
        width: '260px',
        backgroundColor: '#ffffff',
        borderRight: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column' as 'column',
        zIndex: 50,
        height: '100vh',
        position: 'fixed' as 'fixed', // Fixed to ensure it stays
        left: 0,
        top: 0
    };

    const mainStyle = {
        marginLeft: '260px', // Offset for fixed sidebar
        flex: 1,
        backgroundColor: '#f8fafc', // Slate 50
        minHeight: '100vh',
        position: 'relative' as 'relative'
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0f172a' }}>
            {/* Sidebar - INLINE STYLED */}
            <aside style={sidebarStyle} className="crm-sidebar dark-sidebar">
                <style>{`
                    .dark-sidebar { background-color: #0f172a !important; border-right: 1px solid #1e293b !important; }
                    .crm-link { text-decoration: none !important; color: #94a3b8 !important; display: flex !important; align-items: center !important; }
                    .crm-link:hover { background-color: rgba(59, 130, 246, 0.1) !important; color: #60a5fa !important; }
                    .crm-header { color: #64748b !important; font-size: 0.75rem !important; text-transform: uppercase !important; letter-spacing: 0.05em !important; font-weight: 600 !important; margin-bottom: 0.5rem !important; padding-left: 0.75rem !important; }
                `}</style>

                <div style={{ height: '64px', display: 'flex', alignItems: 'center', padding: '0 24px', borderBottom: '1px solid #1e293b' }}>
                    <CompanySwitcher initialActiveCompany={currentCompany} />
                </div>

                <nav style={{ flex: 1, padding: '16px', overflowY: 'auto' }}>
                    {menuItems.map((group: any) => (
                        <div key={group.module.module_key} style={{ marginBottom: '24px' }}>
                            {group.module.module_key !== 'general' && (
                                <h3 className="crm-header">
                                    {group.module.name}
                                </h3>
                            )}

                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                {group.items.map((item: any) => (
                                    <li key={item.key} style={{ listStyle: 'none', margin: 0 }}>
                                        <MenuItem item={item} />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </nav>

                <div style={{ padding: '16px', borderTop: '1px solid #1e293b' }}>
                    <form action={async () => {
                        'use server';
                        await signOut({ redirectTo: '/login' });
                    }}>
                        <button style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '12px',
                            padding: '12px',
                            borderRadius: '12px',
                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                            color: '#f87171',
                            border: '1px solid rgba(239, 68, 68, 0.2)',
                            cursor: 'pointer',
                            fontWeight: 500
                        }}>
                            <LogOut size={20} />
                            <span>Sign Out</span>
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <main style={mainStyle} className="crm-main-content">
                <div className="md:hidden" style={{ background: '#0f172a', padding: '16px', borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Activity color="#60a5fa" />
                    <span style={{ color: 'white', fontWeight: 'bold' }}>CRM Module</span>
                </div>

                <div style={{ padding: '32px' }}>
                    <LoginWorkflowWrapper status={loginStatus}>
                        {children}
                    </LoginWorkflowWrapper>
                </div>
            </main>
        </div>
    )
}

function MenuItem({ item, level = 0 }: { item: any, level?: number }) {
    const Icon = IconMap[item.icon] || (level === 0 ? Activity : null);
    const hasChildren = item.other_menu_items && item.other_menu_items.length > 0;

    // Explicit styles
    const paddingLeft = level === 0 ? "12px" : level === 1 ? "36px" : "56px";
    const linkStyle = {
        paddingTop: '8px',
        paddingBottom: '8px',
        paddingLeft: paddingLeft,
        paddingRight: '12px',
        borderRadius: '6px',
        transition: 'all 0.2s',
        fontSize: level > 0 ? '0.875rem' : '1rem'
    };

    if (hasChildren) {
        return (
            <details className="group/item" open style={{ marginBottom: '4px' }}>
                <summary
                    className="crm-link"
                    style={{ ...linkStyle, cursor: 'pointer', listStyle: 'none', justifyContent: 'space-between' }}
                >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {Icon && <Icon size={20} />}
                        <span>{item.label}</span>
                    </span>
                    <span style={{ opacity: 0.5, transform: 'rotate(90deg)' }}>›</span>
                </summary>
                <div style={{ marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {item.other_menu_items.map((sub: any) => (
                        <MenuItem key={sub.key} item={sub} level={level + 1} />
                    ))}
                </div>
            </details>
        );
    }

    return (
        <Link
            href={item.url || '#'}
            className="crm-link"
            style={linkStyle}
        >
            {Icon && <Icon size={20} />}
            <span>{item.label}</span>
        </Link>
    )
}
