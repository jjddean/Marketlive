import React from 'react';
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ShieldAlert, CheckCircle, FileWarning } from 'lucide-react';
import { toast } from 'sonner';

const AdminCompliancePage = () => {
    // We fetch all documents. In a real app we might have a dedicated 'complianceRequests' table
    // or filter documents for 'KYC' type specifically.
    const documents = useQuery(api.documents.listDocuments, {}) || [];

    // Filter for "Pending" items that look like they need compliance review
    // For demo, we treat 'pending' DocuSign envelopes or 'draft' docs as needing review
    const kyQueue = documents.filter(d => d.docusign?.status === 'sent' || d.status === 'pending_review');

    const handleApproveKYC = (id: string) => {
        toast.success(`KYC Request ${id.substring(0, 6)} Approved`);
        // Mutation to update status would go here
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Compliance & KYC</h1>
                <p className="text-gray-500">Review pending identity verifications and trade compliance alerts.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
                        <ShieldAlert className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{kyQueue.length}</div>
                        <p className="text-xs text-muted-foreground">Requires manual action</p>
                    </CardContent>
                </Card>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">KYC Approval Queue</h3>

                {kyQueue.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg dashed border-2 border-gray-200">
                        <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-400" />
                        <p>All clean. No pending compliance reviews.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {kyQueue.map((item: any) => (
                            <div key={item._id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                                <div className="flex items-center space-x-4">
                                    <div className="p-2 bg-orange-100 rounded-full">
                                        <FileWarning className="h-5 w-5 text-orange-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">Document Review: {item.type}</p>
                                        <p className="text-sm text-gray-500">Ref: {item.documentData?.documentNumber} • User ID: {item.userId?.substring(0, 8)}...</p>
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <Button size="sm" variant="outline">View</Button>
                                    <Button size="sm" onClick={() => handleApproveKYC(item._id)}>Approve</Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminCompliancePage;
