import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import MediaCardHeader from '@/components/ui/media-card-header';
import Modal from '@/components/ui/modal';
import QuoteRequestForm from '@/components/forms/QuoteRequestForm';

import { toast } from 'sonner';

const HomePage = () => {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  const handleQuoteSubmit = (data: any) => {
    // Check if the user is authenticated? Ideally.
    // But for now, just close the modal as requested.
    setIsQuoteModalOpen(false);
    toast.success("Quote request submitted successfully!");

    // Redirect logic could go here if we wanted to be fancy, but simple is best for now.
    // If we have a selected rate, we might want to inform them.
    if (data.selectedRate) {
      toast.success(`Booking confirmed with ${data.selectedRate.carrier}!`);
    }
  };

  const handleCloseModal = () => {
    setIsQuoteModalOpen(false);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section with Media Card */}
      <MediaCardHeader
        title="Professional Freight Forwarding"
        description="Streamlined global logistics with instant quotes, digital documentation, and real-time tracking for complex shipping lanes."
        backgroundImage="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
        overlayOpacity={0.4}
        className="h-[500px] lg:h-[600px]"
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            size="lg"
            className="bg-secondary hover:bg-secondary/90"
            onClick={() => setIsQuoteModalOpen(true)}
          >
            Get Instant Quote
          </Button>
          <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary-800 bg-white/10 backdrop-blur-sm">
            <Link to="/platform">View Platform</Link>
          </Button>
        </div>
      </MediaCardHeader>

      {/* Core Services Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary-800 mb-4">Core Services</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive freight forwarding solutions designed for modern global trade
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-secondary text-xl">📋</span>
              </div>
              <h3 className="text-lg font-semibold text-primary-800 mb-2">Quote & Booking</h3>
              <p className="text-sm text-gray-600">Instant quotes for UK-EU, UK-US, UK-Asia shipping lanes with direct booking capability.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-secondary text-xl">📄</span>
              </div>
              <h3 className="text-lg font-semibold text-primary-800 mb-2">Digital Documentation</h3>
              <p className="text-sm text-gray-600">Streamlined creation and exchange of Bills of Lading, Air Waybills, and commercial invoices.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-secondary text-xl">📍</span>
              </div>
              <h3 className="text-lg font-semibold text-primary-800 mb-2">Real-Time Tracking</h3>
              <p className="text-sm text-gray-600">Live shipment updates integrated with carrier APIs for complete visibility.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-secondary text-xl">💳</span>
              </div>
              <h3 className="text-lg font-semibold text-primary-800 mb-2">Secure Payments</h3>
              <p className="text-sm text-gray-600">Integrated payment processing with transparent invoicing and billing management.</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-primary-800 mb-4">
            Ready to Streamline Your Global Logistics?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join businesses worldwide who trust MarketLive for their freight forwarding needs.
          </p>
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90"
            onClick={() => setIsQuoteModalOpen(true)}
          >
            Start Your Quote
          </Button>
        </div>
      </div>

      {/* Quote Request Modal */}
      <Modal
        isOpen={isQuoteModalOpen}
        onClose={handleCloseModal}
        title="Request Freight Quote"
        size="xl"
      >
        <QuoteRequestForm
          onSubmit={handleQuoteSubmit}
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  );
};

export default HomePage;