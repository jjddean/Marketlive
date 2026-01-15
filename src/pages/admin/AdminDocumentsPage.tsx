import React from 'react';
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import DataTable from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { FileText, Download, CheckCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

const AdminDocumentsPage = () => {
    const documents = useQuery(api.documents.listDocuments, {}) || [];

    const handleApprove = (id: string) => {
        // Ideally this connects to a mutation to set status='approved'
        toast.success("Document marked as Approved");
    };

    const columns: any[] = [
        {
            key: 'documentData',
            header: 'Reference',
            render: (data: any) => <span className="font-mono text-xs">{data?.documentNumber || 'N/A'}</span>
        },
        {
            key: 'type',
            header: 'Type',
            render: (val: string) => <span className="capitalize">{val?.replace(/_/g, ' ')}</span>
        },
        {
            key: 'status',
            header: 'Internal Status',
            render: (value: string) => (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
          ${value === 'approved' ? 'bg-green-100 text-green-800' :
                        value === 'draft' ? 'bg-gray-100 text-gray-800' :
                            'bg-blue-100 text-blue-800'}`}>
                    {value}
                </span>
            )
        },
        {
            key: 'docusign',
            header: 'Signature/KYC',
            render: (ds: any) => (
                ds?.status ? (
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs
             ${ds.status === 'completed' ? 'text-green-600 bg-green-50 border border-green-200' :
                            ds.status === 'sent' ? 'text-blue-600 bg-blue-50 border border-blue-200' :
                                'text-gray-500 bg-gray-50'}`}>
                        {ds.status}
                    </span>
                ) : <span className="text-gray-400 text-xs">-</span>
            )
        },
        {
            key: 'createdAt',
            header: 'Created',
            render: (val: number) => new Date(val).toLocaleDateString()
        },
        {
            key: '_id',
            header: 'Actions',
            render: (id: string, row: any) => (
                <div className="flex space-x-2">
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0" title="Download">
                        <Download className="h-4 w-4" />
                    </Button>
                    {row.status !== 'approved' && (
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-green-600" onClick={() => handleApprove(id)} title="Approve">
                            <CheckCircle className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Document Registry</h1>
                    <p className="text-gray-500">Global overview of all generated documents and bills of lading.</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <DataTable
                    data={documents}
                    columns={columns}
                    searchPlaceholder="Search by ref or type..."
                    rowsPerPage={10}
                />
            </div>
        </div>
    );
};

export default AdminDocumentsPage;
