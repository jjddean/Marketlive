import React from 'react';
import {
    Users,
    ShoppingBag,
    TrendingUp,
    AlertTriangle
} from 'lucide-react';

const StatCard = ({ title, value, change, icon: Icon, trend }: any) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg ${trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                <Icon className="h-6 w-6" />
            </div>
            <span className={`text-sm font-medium ${trend === 'up' ? 'text-emerald-600' : 'text-red-600'}`}>
                {change}
            </span>
        </div>
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
);

const AdminDashboardPage = () => {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
                <p className="text-gray-500">Welcome back, Administrator.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Bookings"
                    value="1,284"
                    change="+12.5%"
                    icon={ShoppingBag}
                    trend="up"
                />
                <StatCard
                    title="Active Shipments"
                    value="45"
                    change="+4"
                    icon={TrendingUp}
                    trend="up"
                />
                <StatCard
                    title="Total Customers"
                    value="892"
                    change="+8.2%"
                    icon={Users}
                    trend="up"
                />
                <StatCard
                    title="Pending Approvals"
                    value="7"
                    change="-2"
                    icon={AlertTriangle}
                    trend="down"
                />
            </div>

            {/* Recent Activity Section Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-[300px]">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Bookings</h2>
                    <div className="flex items-center justify-center h-full text-gray-400">
                        Chart data would go here
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-[300px]">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Revenue Overview</h2>
                    <div className="flex items-center justify-center h-full text-gray-400">
                        Chart data would go here
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardPage;
