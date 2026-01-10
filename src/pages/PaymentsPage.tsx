import React, { useState, useMemo } from 'react';
import MediaCardHeader from '@/components/ui/media-card-header';
import DataTable from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import Footer from '@/components/layout/Footer';
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

const PaymentsPage = () => {
  const [activeTab, setActiveTab] = useState('invoices');

  // Live payment data from Convex
  const livePayments = useQuery(api.paymentAttempts.listMyPayments) || [];

  // Hardcoded fallback invoices
  const HARDCODED_INVOICES = [
    {
      id: 'INV-2024-105',
      date: '2024-07-25',
      amount: 2450.00,
      status: 'Pending',
      shipment: 'SH-2024-001',
      dueDate: '2024-08-25',
      description: 'Ocean Freight - London to Hamburg'
    },
    {
      id: 'INV-2024-098',
      date: '2024-07-18',
      amount: 1875.50,
      status: 'Overdue',
      shipment: 'SH-2024-002',
      dueDate: '2024-08-18',
      description: 'Air Freight - Shanghai to Felixstowe'
    },
    {
      id: 'INV-2024-087',
      date: '2024-07-05',
      amount: 3200.75,
      status: 'Paid',
      shipment: 'SH-2024-003',
      dueDate: '2024-08-05',
      description: 'Container Shipping - Rotterdam to New York'
    },
    {
      id: 'INV-2024-076',
      date: '2024-06-20',
      amount: 1950.25,
      status: 'Paid',
      shipment: 'SH-2024-006',
      dueDate: '2024-07-20',
      description: 'Express Delivery - Tokyo to Long Beach'
    },
  ];

  const paymentMethods = [
    { id: 1, type: 'Credit Card', last4: '4242', expiry: '05/25', default: true, brand: 'Visa' },
    { id: 2, type: 'Bank Account', last4: '9876', name: 'Business Checking', default: false, bank: 'HSBC' },
  ];

  // Merge live payments with hardcoded fallback
  const invoices = useMemo(() => {
    if (livePayments.length > 0) {
      // Format live payments to match invoice structure
      return livePayments.map((p: any) => ({
        id: p.payment_id || p.invoice_id || `PAY-${p._id}`,
        date: p.created_at ? new Date(p.created_at).toLocaleDateString() : '-',
        amount: p.totals?.grand_total?.amount || 0,
        status: p.status === 'completed' ? 'Paid' : p.status === 'pending' ? 'Pending' : p.status || 'Unknown',
        shipment: p.invoice_id || '-',
        dueDate: '-',
        description: `Payment ${p.payment_id || ''}`
      }));
    }
    return HARDCODED_INVOICES;
  }, [livePayments]);

  const invoiceColumns = [
    { key: 'id' as keyof typeof invoices[0], header: 'Invoice ID', sortable: true },
    { key: 'date' as keyof typeof invoices[0], header: 'Date', sortable: true },
    { key: 'description' as keyof typeof invoices[0], header: 'Description', sortable: false },
    {
      key: 'amount' as keyof typeof invoices[0],
      header: 'Amount',
      sortable: true,
      render: (value: number) => `£${value.toLocaleString()}`
    },
    {
      key: 'status' as keyof typeof invoices[0],
      header: 'Status',
      sortable: true,
      render: (value: string) => (
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${value === 'Paid' ? 'bg-green-100 text-green-800' :
          value === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
            value === 'Overdue' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
          }`}>
          {value}
        </span>
      )
    },
    { key: 'dueDate' as keyof typeof invoices[0], header: 'Due Date', sortable: true },
    {
      key: 'id' as keyof typeof invoices[0],
      header: 'Actions',
      render: (value: string, row: typeof invoices[0]) => (
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">View</Button>
          {row.status === 'Pending' && (
            <Button size="sm">Pay Now</Button>
          )}
        </div>
      )
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Payments Header */}
      <MediaCardHeader
        title="Payment Management"
        subtitle="Financial Operations"
        description="Manage invoices, process payments, and maintain financial records for your freight operations."
        backgroundImage="https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
        overlayOpacity={0.6}
        className="h-20"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Financial Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <span className="text-red-600 text-sm">⚠️</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Outstanding Balance</p>
                <p className="text-2xl font-semibold text-red-600">£4,325.50</p>
              </div>
            </div>
            <div className="mt-4">
              <Button className="w-full">Pay Outstanding</Button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 text-sm">✅</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Paid This Month</p>
                <p className="text-2xl font-semibold text-green-600">£5,151.00</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 text-sm">📊</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Average Invoice</p>
                <p className="text-2xl font-semibold text-blue-600">£2,369</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('invoices')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'invoices'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                Invoices & Payments
              </button>
              <button
                onClick={() => setActiveTab('methods')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'methods'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                Payment Methods
              </button>
            </nav>
          </div>
        </div>

        {activeTab === 'invoices' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Invoices & Payments</h2>
              <Button variant="outline">Export Invoices</Button>
            </div>

            <DataTable
              data={invoices}
              columns={invoiceColumns}
              searchPlaceholder="Search invoices by ID, shipment, or description..."
              rowsPerPage={10}
            />
          </div>
        )}

        {activeTab === 'methods' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Payment Methods</h2>
              <Button>Add Payment Method</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {paymentMethods.map((method, index) => (
                <div key={index} className={`bg-white p-6 rounded-lg shadow-sm border-2 ${method.default ? 'border-primary' : 'border-gray-200'
                  }`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <span className="text-lg">{method.type === 'Credit Card' ? '💳' : '🏦'}</span>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">{method.type}</h3>
                        <p className="text-xs text-gray-500">
                          {method.type === 'Credit Card'
                            ? `${method.brand} •••• ${method.last4}`
                            : `${method.bank} •••• ${method.last4}`}
                        </p>
                      </div>
                    </div>
                    {method.default && (
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-primary text-white">
                        Default
                      </span>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    {!method.default && (
                      <Button variant="outline" size="sm">Make Default</Button>
                    )}
                    <Button variant="outline" size="sm">Edit</Button>
                    <Button variant="outline" size="sm">Remove</Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Billing Address */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Billing Address</h3>
                <Button variant="outline" size="sm">Edit Address</Button>
              </div>
              <div className="text-sm text-gray-600">
                <p>MarketLive Freight Services Ltd.</p>
                <p>123 Commerce Street, Suite 400</p>
                <p>London, EC1A 1BB</p>
                <p>United Kingdom</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default PaymentsPage;