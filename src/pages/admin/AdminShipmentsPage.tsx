import React from 'react';
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import DataTable from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation, Package } from 'lucide-react';

const AdminShipmentsPage = () => {
    const shipments = useQuery(api.shipments.listShipments, {}) || [];

    const columns = [
        {
            key: 'trackingNumber',
            header: 'Tracking #',
            render: (value: string) => <span className="font-mono font-medium text-blue-600">{value}</span>
        },
        {
            key: 'carrier',
            header: 'Carrier',
            render: (value: string) => (
                <div className="flex items-center space-x-2">
                    <span className="text-lg">{
                        value?.toLowerCase().includes('fedex') ? '🟣' :
                            value?.toLowerCase().includes('dhl') ? '🟡' : '📦'
                    }</span>
                    <span>{value}</span>
                </div>
            )
        },
        {
            key: 'tracking',
            header: 'Current Location',
            render: (tracking: any) => (
                <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                    {tracking?.currentLocation?.city || 'In Transit'}, {tracking?.currentLocation?.country || ''}
                </div>
            )
        },
        {
            key: 'status',
            header: 'Status',
            render: (value: string) => (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
          ${value === 'delivered' ? 'bg-green-100 text-green-800' :
                        value === 'transit' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'}`}>
                    {value}
                </span>
            )
        },
        {
            key: 'shipmentId',
            header: 'Actions',
            render: (id: string) => (
                <Button variant="outline" size="sm" className="h-8">
                    Details
                </Button>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Fleet Oversight</h1>
                    <p className="text-gray-500">Real-time tracking of active shipments.</p>
                </div>
                <div className="space-x-2">
                    <Button variant="outline">
                        <Navigation className="h-4 w-4 mr-2" /> Live Map
                    </Button>
                    <Button>
                        <Package className="h-4 w-4 mr-2" /> Add Shipment
                    </Button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <DataTable
                    data={shipments}
                    columns={columns}
                    searchPlaceholder="Search tracking number or carrier..."
                    rowsPerPage={10}
                />
            </div>
        </div>
    );
};

export default AdminShipmentsPage;
