import React from 'react';
import MediaCardHeader from '@/components/ui/media-card-header';
import { Button } from '@/components/ui/button';
import Footer from '@/components/layout/Footer';
import { FileText, FileBadge, FileWarning } from 'lucide-react';

const CompliancePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <MediaCardHeader
        title="Compliance"
        subtitle="Regulatory Center"
        description="Manage KYC, document uploads, and trade compliance tasks."
        backgroundImage="https://images.unsplash.com/photo-1507208773393-40d9fc9f9777?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
        overlayOpacity={0.6}
        className="mb-6"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg border bg-card text-card-foreground p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-semibold">Document Templates</h2>
            <p className="text-muted-foreground mt-1">Download templates for commonly required shipping documents:</p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { name: 'Commercial Invoice', icon: FileText, color: 'text-blue-600' },
              { name: 'Bill of Lading', icon: FileBadge, color: 'text-indigo-600' },
              { name: 'Certificate of Origin', icon: FileBadge, color: 'text-green-600' },
              { name: 'Dangerous Goods', icon: FileWarning, color: 'text-amber-600' }
            ].map((item, idx) => (
              <div key={idx} className="rounded-md border p-4 hover:bg-gray-50 flex items-center gap-3 cursor-pointer transition-colors">
                <item.icon className={`h-5 w-5 ${item.color}`} />
                <span className="font-medium text-gray-700">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-100 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900">Coming Soon: Compliance Hub</h3>
          <ul className="mt-2 space-y-1 text-blue-800 text-sm">
            <li>• KYC/KYB Checklists</li>
            <li>• Sanctions Screening Results</li>
            <li>• Automatic Document Expiry Reminders</li>
          </ul>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CompliancePage;