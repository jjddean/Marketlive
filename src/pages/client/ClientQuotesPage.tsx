import React, { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import MediaCardHeader from '@/components/ui/media-card-header';
import DataTable from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import Footer from '@/components/layout/Footer';
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import QuoteRequestForm from '@/components/forms/QuoteRequestForm';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger
} from '@/components/ui/drawer';
import { toast } from 'sonner';

type Quote = any;

function formatCurrency(amount: number, currency: string = 'USD') {
    try {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
    } catch {
        return `$${amount.toFixed(2)}`;
    }
}

// GPS coordinates for common shipping cities
function getCityCoordinates(cityOrOrigin?: string): { lat: number; lng: number } {
    const city = (cityOrOrigin || '').toLowerCase();
    const cityCoords: Record<string, { lat: number; lng: number }> = {
        'london': { lat: 51.5074, lng: -0.1278 },
        'hamburg': { lat: 53.5511, lng: 9.9937 },
        'rotterdam': { lat: 51.9225, lng: 4.4792 },
        'new york': { lat: 40.7128, lng: -74.0060 },
        'shanghai': { lat: 31.2304, lng: 121.4737 },
        'singapore': { lat: 1.3521, lng: 103.8198 },
        'tokyo': { lat: 35.6762, lng: 139.6503 },
        'los angeles': { lat: 34.0522, lng: -118.2437 },
        'dubai': { lat: 25.2048, lng: 55.2708 },
        'paris': { lat: 48.8566, lng: 2.3522 },
        'frankfurt': { lat: 50.1109, lng: 8.6821 },
        'hong kong': { lat: 22.3193, lng: 114.1694 },
    };
    // Check if city matches any key
    for (const [key, coords] of Object.entries(cityCoords)) {
        if (city.includes(key)) return coords;
    }
    // Default to London if no match
    return { lat: 51.5074, lng: -0.1278 };
}

const ClientQuotesPage = () => {
    const quotes = useQuery(api.quotes.listMyQuotes) || [];
    const location = useLocation();

    // View mode only controls "Create New" vs "List". Details are handled by Drawers in the list.
    const [viewMode, setViewMode] = useState<'list' | 'create'>(
        (location.state as any)?.mode === 'create' || new URLSearchParams(location.search).get('mode') === 'create'
            ? 'create'
            : 'list'
    );

    const [isSubmitting, setIsSubmitting] = useState(false);
    const createQuote = useMutation(api.quotes.createInstantQuoteAndBooking);

    const handleCreateQuote = async (formData: any) => {
        setIsSubmitting(true);
        try {
            const requestData = {
                origin: formData.origin,
                destination: formData.destination,
                serviceType: formData.serviceType,
                cargoType: formData.cargoType,
                weight: formData.weight,
                dimensions: formData.dimensions,
                value: formData.value,
                incoterms: formData.incoterms,
                urgency: formData.urgency,
                additionalServices: formData.additionalServices,
                contactInfo: formData.contactInfo
            };

            await createQuote({ request: requestData });
            toast.success("Quote created successfully");
            setViewMode('list');
        } catch (error) {
            console.error('Error creating quote:', error);
            alert('Failed to create quote. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const StatusBadge = ({ status }: { status: string }) => {
        const styles = {
            success: 'bg-green-100 text-green-800',
            pending: 'bg-yellow-100 text-yellow-800',
            default: 'bg-gray-100 text-gray-800'
        };
        const label = status === 'success' ? 'Ready' : status;
        const style = styles[status as keyof typeof styles] || styles.default;

        return (
            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${style}`}>
                {label}
            </span>
        );
    };

    // Helper for booking button inside drawer
    const ConvertToBookingButton = ({ quote }: { quote: any }) => {
        const createBooking = useMutation(api.bookings.createBooking);
        const upsertShipment = useMutation(api.shipments.upsertShipment);
        const [loading, setLoading] = useState(false);

        const handleConvert = async () => {
            setLoading(true);
            try {
                const bestRate = quote.quotes?.[0]; // Simplification for MVP
                if (!bestRate) {
                    alert("No rates available to book");
                    return;
                }

                const contact = quote.contactInfo || {
                    name: 'Guest User',
                    email: 'guest@example.com',
                    phone: 'N/A',
                    company: 'N/A'
                };

                // 1. Create Booking
                const bookingRes = await createBooking({
                    quoteId: quote.quoteId,
                    carrierQuoteId: bestRate.carrierId,
                    customerDetails: {
                        name: contact.name || 'Guest',
                        email: contact.email || 'guest@example.com',
                        phone: contact.phone || 'N/A',
                        company: contact.company || 'N/A',
                    },
                    pickupDetails: {
                        address: quote.origin || 'Origin',
                        date: new Date().toISOString(),
                        timeWindow: '09:00-17:00',
                        contactPerson: contact.name || 'Guest',
                        contactPhone: contact.phone || 'N/A',
                    },
                    deliveryDetails: {
                        address: quote.destination || 'Destination',
                        date: new Date(Date.now() + 5 * 86400000).toISOString(),
                        timeWindow: '09:00-17:00',
                        contactPerson: contact.name || 'Guest',
                        contactPhone: contact.phone || 'N/A',
                    },
                    specialInstructions: "Standard handling"
                });

                // 2. Upsert Shipment immediately (Twin App Behavior)
                const shipmentId = bookingRes?.bookingId || `SHP-${Date.now()}`;

                await upsertShipment({
                    shipmentId,
                    tracking: {
                        status: 'pending',
                        currentLocation: {
                            city: quote.origin || 'London',
                            state: '',
                            country: 'UK',
                            // City coordinates lookup for map display
                            coordinates: getCityCoordinates(quote.origin),
                        },
                        estimatedDelivery: new Date(Date.now() + 5 * 86400000).toISOString(),
                        carrier: bestRate.carrierName || bestRate.carrierId,
                        trackingNumber: `TBA-${shipmentId}`,
                        service: bestRate.serviceType || quote.serviceType,
                        shipmentDetails: {
                            weight: quote.weight || '',
                            dimensions: `${quote.dimensions?.length || ''}x${quote.dimensions?.width || ''}x${quote.dimensions?.height || ''}`,
                            origin: quote.origin || '',
                            destination: quote.destination || '',
                            value: quote.value || '',
                        },
                        events: [
                            {
                                timestamp: new Date().toISOString(),
                                status: 'Shipment created',
                                location: quote.origin || 'Origin',
                                description: `Booking ${shipmentId} confirmed with ${bestRate.carrierName}`,
                            },
                        ],
                    },
                });

                toast.success(`Booking confirmed! Redirecting to bookings...`);

                // 3. Redirect to Bookings Page
                setTimeout(() => {
                    window.location.href = '/bookings';
                }, 1000);

            } catch (e) {
                console.error(e);
                toast.error("Failed to create booking");
            } finally {
                setLoading(false);
            }
        };

        return (
            <Button onClick={handleConvert} disabled={loading} className="w-full sm:w-auto">
                {loading ? 'Converting...' : 'Convert to Booking'}
            </Button>
        );
    };

    // Columns definition including the Drawer
    const columns = [
        {
            key: 'quoteId',
            header: 'Quote ID',
            sortable: true,
            render: (value: string, row: any) => (
                <Drawer direction="right">
                    <DrawerTrigger asChild>
                        <Button variant="link" className="p-0 h-auto font-medium text-blue-600 hover:underline">
                            {value}
                        </Button>
                    </DrawerTrigger>
                    <DrawerContent className="max-w-md ml-auto h-full rounded-none border-l">
                        <div className="h-full overflow-y-auto">
                            <DrawerHeader>
                                <DrawerTitle>Quote {row.quoteId}</DrawerTitle>
                                <DrawerDescription>
                                    {row.origin} → {row.destination}
                                </DrawerDescription>
                            </DrawerHeader>

                            <div className="p-4 space-y-6">
                                {/* Shipment Details Section */}
                                <section className="space-y-3">
                                    <h3 className="text-sm font-semibold text-gray-900 border-b pb-2">Shipment Details</h3>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="block text-gray-500 text-xs">Service</span>
                                            {row.serviceType}
                                        </div>
                                        <div>
                                            <span className="block text-gray-500 text-xs">Cargo</span>
                                            {row.cargoType}
                                        </div>
                                        <div>
                                            <span className="block text-gray-500 text-xs">Weight</span>
                                            {row.weight} kg
                                        </div>
                                        <div>
                                            <span className="block text-gray-500 text-xs">Incoterms</span>
                                            {row.incoterms}
                                        </div>
                                    </div>
                                </section>

                                {/* Carrier Quotes Section */}
                                <section className="space-y-3">
                                    <h3 className="text-sm font-semibold text-gray-900 border-b pb-2">Carrier Rates</h3>
                                    <div className="space-y-3">
                                        {(row.quotes || []).map((q: any, idx: number) => (
                                            <div key={idx} className="bg-gray-50 p-3 rounded-lg border border-gray-100 flex justify-between items-center">
                                                <div>
                                                    <div className="font-medium text-gray-900">{q.carrierName}</div>
                                                    <div className="text-xs text-gray-500">{q.serviceType} • {q.transitTime}</div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-bold text-lg text-gray-900">
                                                        {formatCurrency(q.price?.amount || 0, q.price?.currency)}
                                                    </div>
                                                    <div className="text-[10px] text-gray-400">Valid until {new Date(q.validUntil).toLocaleDateString()}</div>
                                                </div>
                                            </div>
                                        ))}
                                        {(!row.quotes || row.quotes.length === 0) && (
                                            <div className="text-sm text-gray-500 italic">No rates available.</div>
                                        )}
                                    </div>
                                </section>
                            </div>

                            <DrawerFooter className="border-t">
                                <ConvertToBookingButton quote={row} />
                                <DrawerClose asChild>
                                    <Button variant="outline">Close</Button>
                                </DrawerClose>
                            </DrawerFooter>
                        </div>
                    </DrawerContent>
                </Drawer>
            )
        },
        {
            key: 'origin',
            header: 'Route',
            sortable: true,
            render: (_: any, row: any) => (
                <span className="text-sm">
                    <div className="font-medium">{row.origin}</div>
                    <div className="text-gray-500">→ {row.destination}</div>
                </span>
            )
        },
        { key: 'serviceType', header: 'Service', sortable: true },
        {
            key: 'status',
            header: 'Status',
            sortable: true,
            render: (value: string) => <StatusBadge status={value} />
        },
        {
            key: 'createdAt',
            header: 'Date',
            sortable: true,
            render: (value: number) => new Date(value).toLocaleDateString()
        },
        // We can keep a robust "actions" column or simpler "View" button that triggers the same drawer
        {
            key: 'actions',
            header: 'Actions',
            render: (_: any, row: any) => (
                <Drawer direction="right">
                    <DrawerTrigger asChild>
                        <Button variant="outline" size="sm">View Prices</Button>
                    </DrawerTrigger>
                    <DrawerContent className="max-w-md ml-auto h-full rounded-none border-l">
                        <div className="h-full overflow-y-auto">
                            <DrawerHeader>
                                <DrawerTitle>Quote {row.quoteId}</DrawerTitle>
                                <DrawerDescription>
                                    {row.origin} → {row.destination}
                                </DrawerDescription>
                            </DrawerHeader>

                            <div className="p-4 space-y-6">
                                <section className="space-y-3">
                                    <h3 className="text-sm font-semibold text-gray-900 border-b pb-2">Carrier Rates</h3>
                                    <div className="space-y-3">
                                        {(row.quotes || []).map((q: any, idx: number) => (
                                            <div key={idx} className="bg-gray-50 p-3 rounded-lg border border-gray-100 flex justify-between items-center">
                                                <div>
                                                    <div className="font-medium text-gray-900">{q.carrierName}</div>
                                                    <div className="text-xs text-gray-500">{q.serviceType} • {q.transitTime}</div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-bold text-lg text-gray-900">
                                                        {formatCurrency(q.price?.amount || 0, q.price?.currency)}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </div>
                            <DrawerFooter className="border-t">
                                <ConvertToBookingButton quote={row} />
                                <DrawerClose asChild>
                                    <Button variant="outline">Close</Button>
                                </DrawerClose>
                            </DrawerFooter>
                        </div>
                    </DrawerContent>
                </Drawer>
            )
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <MediaCardHeader
                title="My Quotes"
                subtitle="Pricing History"
                description="View and manage your shipping quotes. converting them to bookings instantly."
                backgroundImage="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                overlayOpacity={0.6}
                className="mb-6"
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {viewMode === 'create' ? (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-900">New Quote Request</h2>
                            <Button variant="ghost" onClick={() => setViewMode('list')} disabled={isSubmitting}>Cancel</Button>
                        </div>
                        <QuoteRequestForm
                            onSubmit={handleCreateQuote}
                            onCancel={() => setViewMode('list')}
                        />
                    </div>
                ) : (
                    <>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-900">
                                Recent Quotes
                                <span className="text-sm text-gray-500 ml-2">
                                    ({quotes.length})
                                </span>
                            </h2>
                            <Button onClick={() => setViewMode('create')}>
                                New Quote
                            </Button>
                        </div>

                        <DataTable
                            data={quotes}
                            columns={columns as any}
                            searchPlaceholder="Search quotes..."
                            rowsPerPage={10}
                        />
                    </>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default ClientQuotesPage;
