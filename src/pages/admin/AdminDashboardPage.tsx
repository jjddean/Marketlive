import React from 'react';
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import {
    Users,
    ShoppingBag,
    TrendingUp,
    AlertTriangle
} from 'lucide-react';

const StatCard = ({ title, value, change, icon: Icon, trend }: any) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg ${trend === 'up' ? 'bg-emerald-50 text-emerald-600' :
                trend === 'down' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                <Icon className="h-6 w-6" />
            </div>
            <span className={`text-sm font-medium ${trend === 'up' ? 'text-emerald-600' :
                trend === 'down' ? 'text-red-600' : 'text-gray-600'}`}>
                {change}
            </span>
        </div>
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
);

const AdminDashboardPage = () => {
    const stats = useQuery(api.admin.getDashboardStats);

    if (!stats) {
        return <div className="p-8 text-center text-gray-500">Loading dashboard stats...</div>;
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
                <p className="text-gray-500">Welcome back, Administrator. Here is your platform summary.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Bookings"
                    value={stats.totalBookings.toLocaleString()}
                    change={stats.trends.bookings}
                    icon={ShoppingBag}
                    trend="up"
                />
                <StatCard
                    title="Active Shipments"
                    value={stats.activeShipments.toString()}
                    change={stats.trends.shipments}
                    icon={TrendingUp}
                    trend="up"
                />
                <StatCard
                    title="Total Customers"
                    value={stats.totalCustomers.toLocaleString()}
                    change={stats.trends.customers}
                    icon={Users}
                    trend="up"
                />
                <StatCard
                    title="Pending Approvals"
                    value={stats.pendingApprovals.toString()}
                    change={stats.trends.approvals}
                    icon={AlertTriangle}
                    trend={stats.pendingApprovals > 5 ? 'down' : 'up'}
                />
            </div>

            {/* Recent Activity Section Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-[300px]">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Bookings</h2>
                    <div className="flex items-center justify-center h-full text-gray-400 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                        Select 'Bookings' in sidebar to view details
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-[300px]">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Revenue Overview</h2>
                    <div className="flex items-center justify-center h-full text-gray-400 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                        Financial analytics module coming soon
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardPage;
