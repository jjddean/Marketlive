import React from 'react';
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import DataTable from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Check, X, Truck, FileText } from 'lucide-react';

const AdminBookingsPage = () => {
    const bookings = useQuery(api.bookings.listBookings) || []; // Using listMyBookings for now as admin check logic isn't strictly enforced on backend query level yet for listAll

    // In a real app, we'd use api.bookings.listAllBookings protected by admin auth
    // For now, we simulate admin view using the existing list query 
    // (assuming the user is an admin they can see everything or we mock it)

    const updateStatus = useMutation(api.bookings.updateBookingStatus);

    const [processingId, setProcessingId] = React.useState<string | null>(null);

    const handleApprove = async (id: string) => {
        setProcessingId(id);
        try {
            await updateStatus({ bookingId: id, status: 'confirmed' });
            toast.success(`Booking ${id} approved`);
        } catch (e) {
            toast.error("Failed to approve booking");
        } finally {
            setProcessingId(null);
        }
    };

    const handleReject = async (id: string) => {
        setProcessingId(id);
        try {
            await updateStatus({ bookingId: id, status: 'cancelled' });
            toast.error(`Booking ${id} rejected`);
        } catch (e) {
            toast.error("Failed to reject booking");
        } finally {
            setProcessingId(null);
        }
    };

    const columns: any[] = [
        {
            key: 'bookingId',
            header: 'Booking Ref',
            render: (value: string) => <span className="font-mono text-xs">{value}</span>
        },
        {
            key: 'customerDetails',
            header: 'Customer',
            render: (val: any) => (
                <div>
                    <div className="font-medium text-gray-900">{val.name}</div>
                    <div className="text-xs text-gray-500">{val.company}</div>
                </div>
            )
        },
        {
            key: 'pickupDetails',
            header: 'Route',
            render: (_: any, row: any) => (
                <div className="text-sm">
                    <div className="flex items-center text-gray-900">
                        <span className="w-16 text-xs text-gray-500">Origin:</span>
                        {row.pickupDetails?.address?.split(',')[0]}
                    </div>
                    <div className="flex items-center text-gray-900 mt-1">
                        <span className="w-16 text-xs text-gray-500">Dest:</span>
                        {row.deliveryDetails?.address?.split(',')[0]}
                    </div>
                </div>
            )
        },
        {
            key: 'status',
            header: 'Status',
            render: (value: string) => (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
          ${value === 'confirmed' ? 'bg-green-100 text-green-800' :
                        value === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                    {value}
                </span>
            )
        },
        {
            key: 'createdAt',
            header: 'Submitted',
            render: (value: number) => new Date(value).toLocaleDateString()
        },
        {
            key: 'bookingId',
            header: 'Actions',
            render: (id: string, row: any) => {
                const isProcessing = processingId === id;
                return (
                    <div className="flex space-x-2">
                        {row.status === 'pending' && (
                            <>
                                <Button
                                    size="sm"
                                    className="bg-emerald-600 hover:bg-emerald-700 h-8 px-2"
                                    onClick={() => handleApprove(id)}
                                    disabled={processingId !== null}
                                >
                                    {isProcessing ? <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" /> : <Check className="h-4 w-4" />}
                                </Button>
                                <Button
                                    size="sm"
                                    variant="destructive"
                                    className="h-8 px-2"
                                    onClick={() => handleReject(id)}
                                    disabled={processingId !== null}
                                >
                                    {isProcessing ? <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" /> : <X className="h-4 w-4" />}
                                </Button>
                            </>
                        )}
                        <Button size="sm" variant="outline" className="h-8 px-2">
                            <FileText className="h-4 w-4" />
                        </Button>
                    </div>
                );
            }
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Booking Requests</h1>
                    <p className="text-gray-500">Manage incoming quote approvals and shipment requests.</p>
                </div>
                <Button>
                    <div className="mr-2">📥</div> Export CSV
                </Button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <DataTable
                    data={bookings}
                    columns={columns}
                    searchPlaceholder="Search bookings..."
                    rowsPerPage={10}
                />
            </div>
        </div>
    );
};

export default AdminBookingsPage;
