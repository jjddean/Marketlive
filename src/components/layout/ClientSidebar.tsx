import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Truck,
    FileText,
    CreditCard,
    ClipboardList,
    FileCheck,
    BarChart3,
    ChevronLeft,
    ChevronRight,
    Package,
    Bell
} from 'lucide-react';
import { UserButton, OrganizationSwitcher } from '@clerk/clerk-react';
import NotificationCenter from '@/components/ui/notification-center';

interface ClientSidebarProps {
    children: React.ReactNode;
}

const ClientSidebar = ({ children }: ClientSidebarProps) => {
    const location = useLocation();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    // Close mobile sidebar on route change
    useEffect(() => {
        setIsMobileOpen(false);
    }, [location.pathname]);

    const navigation = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Shipments', href: '/shipments', icon: Truck },
        { name: 'Bookings', href: '/bookings', icon: Package },
        { name: 'Quotes', href: '/quotes', icon: ClipboardList },
        { name: 'Payments', href: '/payments', icon: CreditCard },
        { name: 'Documents', href: '/documents', icon: FileText },
        { name: 'Compliance', href: '/compliance', icon: FileCheck },
        { name: 'Reports', href: '/reports', icon: BarChart3 },
    ];

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Mobile overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed top-0 left-0 z-50 h-full bg-white border-r border-gray-200 
                transition-all duration-300 ease-in-out
                ${isCollapsed ? 'w-16' : 'w-64'}
                ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                {/* Logo / Brand */}
                <div className={`h-16 flex items-center border-b border-gray-200 ${isCollapsed ? 'justify-center px-2' : 'px-4'}`}>
                    {!isCollapsed && (
                        <span className="text-xl font-bold text-blue-600">MarketLive</span>
                    )}
                    {isCollapsed && (
                        <span className="text-xl font-bold text-blue-600">M</span>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-4 px-2">
                    {navigation.map((item) => {
                        const isActive = location.pathname === item.href;
                        return (
                            <NavLink
                                key={item.name}
                                to={item.href}
                                className={`
                                    flex items-center px-2.5 py-2 mb-0.5 rounded-md transition-colors text-sm
                                    ${isActive
                                        ? 'bg-blue-50 text-blue-600'
                                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}
                                    ${isCollapsed ? 'justify-center' : ''}
                                `}
                                title={isCollapsed ? item.name : undefined}
                            >
                                <item.icon className={`h-4 w-4 ${isCollapsed ? '' : 'mr-2'}`} />
                                {!isCollapsed && (
                                    <span className="text-sm">{item.name}</span>
                                )}
                            </NavLink>
                        );
                    })}
                </nav>

                {/* Collapse Toggle */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute -right-3 top-20 bg-white border border-gray-200 rounded-full p-1 shadow-sm hover:bg-gray-50 hidden md:flex"
                >
                    {isCollapsed ? (
                        <ChevronRight className="h-4 w-4 text-gray-600" />
                    ) : (
                        <ChevronLeft className="h-4 w-4 text-gray-600" />
                    )}
                </button>

                {/* Organization Switcher at Bottom */}
                {!isCollapsed && (
                    <div className="border-t border-gray-200 p-3">
                        <OrganizationSwitcher
                            hidePersonal={false}
                            afterSelectOrganizationUrl="/dashboard"
                            appearance={{
                                elements: {
                                    rootBox: "w-full",
                                    organizationSwitcherTrigger: "w-full justify-between text-xs"
                                }
                            }}
                        />
                    </div>
                )}
            </aside>

            {/* Main Content Area */}
            <div className={`flex-1 transition-all duration-300 ${isCollapsed ? 'md:ml-16' : 'md:ml-64'}`}>
                {/* Page Content - No extra top bar needed, navbar handles it */}
                <main className="p-6 pt-4">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default ClientSidebar;
