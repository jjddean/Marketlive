import React from 'react';
import { Button } from '@/components/ui/button';
import LiveRateComparison from './LiveRateComparison';
import { type RateRequest } from '@/services/carriers';

interface QuoteResultsViewProps {
    quote: any;
    onBack: () => void;
}

const QuoteResultsView: React.FC<QuoteResultsViewProps> = ({ quote, onBack }) => {
    if (!quote) return <div className="p-8 text-center text-gray-500">Loading quote results...</div>;

    const rateRequest: RateRequest = {
        origin: {
            street1: '123 Business St',
            city: quote.origin?.split(', ')[0] || 'London',
            state: '',
            zip: 'SW1A 1AA',
            country: 'GB',
        },
        destination: {
            street1: '456 Commerce Ave',
            city: quote.destination?.split(', ')[0] || 'Hamburg',
            state: '',
            zip: '20095',
            country: quote.destination?.includes('DE') ? 'DE' :
                quote.destination?.includes('US') ? 'US' :
                    quote.destination?.includes('CN') ? 'CN' : 'DE',
        },
        parcel: {
            length: parseFloat(quote.dimensions?.length) || 40,
            width: parseFloat(quote.dimensions?.width) || 30,
            height: parseFloat(quote.dimensions?.height) || 20,
            distance_unit: 'cm',
            weight: parseFloat(quote.weight) || 100,
            mass_unit: 'kg',
        },
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-slate-900">New Quote Request</h3>
                <Button variant="ghost" onClick={onBack}>Cancel</Button>
            </div>

            <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Step 5 of 5</span>
                    <span className="text-sm text-gray-500">100% Complete</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full w-full"></div>
                </div>
            </div>

            <LiveRateComparison
                rateRequest={rateRequest}
                className="shadow-xl border-gray-100 rounded-2xl"
            />
        </div>
    );
};

export default QuoteResultsView;
