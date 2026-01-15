import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import LiveRateComparison from './LiveRateComparison';
import { type RateRequest, type CarrierRate } from '@/services/carriers';
import { CO2Badge } from '@/components/ui/co2-badge';
import { LandedCostTool } from '@/components/ui/landed-cost-tool';

interface QuoteResultsViewProps {
    quote: any;
    onBack: () => void;
    onBook?: (rate: any) => void;
}

const QuoteResultsView: React.FC<QuoteResultsViewProps> = ({ quote, onBack, onBook }) => {
    const [selectedRate, setSelectedRate] = useState<CarrierRate | null>(null);

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
                onRateSelect={setSelectedRate}
                onBook={(rate) => {
                    if (onBook) {
                        onBook(rate);
                    } else {
                        // Guest mode behavior (Homepage)
                        alert(`Please Sign In to book this rate with ${rate.carrier}.`);
                    }
                }}
            />

            {selectedRate && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 transition-all">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                            <span className="text-green-600 text-lg">✅</span>
                            <div>
                                <h4 className="text-sm font-medium text-green-900">Rate Selected</h4>
                                <p className="text-sm text-green-700">
                                    {selectedRate.carrier} {selectedRate.service}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="font-bold text-green-800">
                                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(selectedRate.cost)}
                                    </span>
                                    <span className="text-xs text-green-600">({selectedRate.transit_time})</span>
                                </div>
                            </div>
                        </div>

                        {/* Premium Features Widget */}
                        <div className="flex flex-col items-end gap-2">
                            <CO2Badge kg={Math.round((parseFloat(quote.weight) || 100) * 0.85)} />
                            <div className="flex items-center gap-2">
                                <LandedCostTool baseFreight={selectedRate.cost} currency="USD" />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuoteResultsView;
