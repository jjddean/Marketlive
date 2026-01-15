import React from 'react';
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import DataTable from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Mail, Phone, Shield } from 'lucide-react';

const AdminCustomersPage = () => {
    const users = useQuery(api.users.listUsers) || [];

    const columns: any[] = [
        {
            key: 'name',
            header: 'Customer',
            render: (val: string, row: any) => (
                <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-3">
                        {val?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <div className="font-medium text-gray-900">{val || 'Unknown'}</div>
                        <div className="text-xs text-gray-500">{row.externalId}</div>
                    </div>
                </div>
            )
        },
        {
            key: 'email',
            header: 'Contact',
            render: (val: string) => (
                <div className="flex flex-col space-y-1">
                    <div className="flex items-center text-sm text-gray-600">
                        <Mail className="h-3 w-3 mr-2" /> {val}
                    </div>
                </div>
            )
        },
        {
            key: 'role',
            header: 'Role',
            render: (_: any) => (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    Client
                </span>
            )
        },
        {
            key: '_creationTime',
            header: 'Joined',
            render: (val: number) => new Date(val).toLocaleDateString()
        },
        {
            key: '_id',
            header: 'Actions',
            render: (_: string) => (
                <Button size="sm" variant="outline">View Profile</Button>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
                    <p className="text-gray-500">Directory of all registered clients.</p>
                </div>
                <Button>Export List</Button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <DataTable
                    data={users}
                    columns={columns}
                    searchPlaceholder="Search customers..."
                    rowsPerPage={10}
                />
            </div>
        </div>
    );
};

export default AdminCustomersPage;
