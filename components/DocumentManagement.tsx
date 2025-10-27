'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { formatDate, formatFileSize } from '@/lib/formatters';
import { formatFileSize as formatFileSizeUtil } from '@/lib/s3';
import StatCard from './StatCard';
import PageHeader from './PageHeader';
import DocumentUpload from './DocumentUpload';
import SearchIcon from './icons/SearchIcon';
import MenuDotsIcon from './icons/MenuDotsIcon';
import DocumentFileIcon from './icons/DocumentFileIcon';
import CheckIcon from './icons/CheckIcon';
import ClockIcon from './icons/ClockIcon';

interface Document {
  id: string;
  name: string;
  originalName: string;
  description?: string;
  tags: string[];
  fileUrl: string;
  fileKey: string;
  fileSize: number;
  mimeType: string;
  version: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  submittedBy: {
    id: string;
    name?: string;
    email: string;
    profileImageUrl?: string;
  };
  approvedBy?: {
    id: string;
    name?: string;
    email: string;
  };
  rejectedBy?: {
    id: string;
    name?: string;
    email: string;
  };
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
  approvedAt?: string;
  rejectedAt?: string;
}

interface DocumentStats {
  totalDocuments: number;
  pendingDocuments: number;
  approvedDocuments: number;
  rejectedDocuments: number;
  totalSize: number;
}

export default function DocumentManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [showActions, setShowActions] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [userRole, setUserRole] = useState<string>('');

  const queryClient = useQueryClient();

  // Get current user role (you might want to get this from auth context)
  useEffect(() => {
    // This should be replaced with actual auth context
    // For now, we'll assume admin role
    setUserRole('ADMIN');
  }, []);

  // Fetch documents
  const { data: documentsData, isLoading } = useQuery({
    queryKey: ['documents', searchQuery, statusFilter, currentPage],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
      });

      if (searchQuery) params.append('search', searchQuery);
      if (statusFilter !== 'ALL') params.append('status', statusFilter);

      const response = await fetch(`/api/documents?${params}`);
      if (!response.ok) throw new Error('Failed to fetch documents');
      return response.json();
    },
  });

  const documents: Document[] = documentsData?.documents || [];
  const pagination = documentsData?.pagination;

  // Calculate stats
  const stats: DocumentStats = {
    totalDocuments: documents.length,
    pendingDocuments: documents.filter(d => d.status === 'PENDING').length,
    approvedDocuments: documents.filter(d => d.status === 'APPROVED').length,
    rejectedDocuments: documents.filter(d => d.status === 'REJECTED').length,
    totalSize: documents.reduce((sum, d) => sum + d.fileSize, 0),
  };

  // Approve document mutation
  const approveMutation = useMutation({
    mutationFn: async (documentId: string) => {
      const response = await fetch(`/api/documents/${documentId}/approve`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to approve document');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      setShowActions(false);
      setSelectedDocument(null);
    },
  });

  // Reject document mutation
  const rejectMutation = useMutation({
    mutationFn: async ({ documentId, reason }: { documentId: string; reason: string }) => {
      const response = await fetch(`/api/documents/${documentId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });
      if (!response.ok) throw new Error('Failed to reject document');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      setShowActions(false);
      setShowApprovalModal(false);
      setSelectedDocument(null);
      setRejectionReason('');
    },
  });

  // Delete document mutation
  const deleteMutation = useMutation({
    mutationFn: async (documentId: string) => {
      const response = await fetch(`/api/documents/${documentId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete document');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      setShowActions(false);
      setSelectedDocument(null);
    },
  });

  const handleDocumentAction = (document: Document, action: string) => {
    setSelectedDocument(document);
    if (action === 'approve') {
      approveMutation.mutate(document.id);
    } else if (action === 'reject') {
      setShowApprovalModal(true);
    } else if (action === 'manage') {
      setShowActions(true);
    }
  };

  const handleDownload = async (document: Document) => {
    try {
      const response = await fetch(`/api/documents/${document.id}/download`);
      const data = await response.json();
      
      if (response.ok) {
        // Create a temporary link to download the file
        const link = document.createElement('a');
        link.href = data.downloadUrl;
        link.download = document.originalName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        throw new Error(data.error || 'Failed to download document');
      }
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download document');
    }
  };

  const handleReject = () => {
    if (!selectedDocument || !rejectionReason.trim()) {
      alert('Please enter a rejection reason');
      return;
    }

    rejectMutation.mutate({
      documentId: selectedDocument.id,
      reason: rejectionReason,
    });
  };

  const getStatusBadge = (status: string) => {
    const classes = {
      PENDING: 'badge-warning',
      APPROVED: 'badge-success',
      REJECTED: 'badge-error',
    };
    const icons = {
      PENDING: <ClockIcon width={12} height={12} />,
      APPROVED: <CheckIcon width={12} height={12} />,
      REJECTED: <span>✕</span>,
    };
    return (
      <span className={`badge ${classes[status as keyof typeof classes]} text-white flex items-center gap-1`}>
        {icons[status as keyof typeof icons]}
        {status}
      </span>
    );
  };

  const getFileIcon = (mimeType: string) => {
    return <DocumentFileIcon width={20} height={20} color="#6b7280" />;
  };

  return (
    <div>
      <PageHeader
        title="Document Management"
        description="Upload, organize, and manage documents with approval workflow"
        illustration="/images/documents-illustration.png"
        actionButton={{
          label: 'Upload Document',
          onClick: () => {}, // This will be handled by the DocumentUpload component
        }}
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-5 gap-6 mb-8">
        <div className="bg-white border border-[#e1e1e1] rounded-xl p-6">
          <StatCard
            label="Total Documents"
            value={stats.totalDocuments}
            change={0}
          />
        </div>
        <div className="bg-white border border-[#e1e1e1] rounded-xl p-6">
          <StatCard
            label="Pending Review"
            value={stats.pendingDocuments}
            change={0}
          />
        </div>
        <div className="bg-white border border-[#e1e1e1] rounded-xl p-6">
          <StatCard
            label="Approved"
            value={stats.approvedDocuments}
            change={0}
          />
        </div>
        <div className="bg-white border border-[#e1e1e1] rounded-xl p-6">
          <StatCard
            label="Rejected"
            value={stats.rejectedDocuments}
            change={0}
          />
        </div>
        <div className="bg-white border border-[#e1e1e1] rounded-xl p-6">
          <StatCard
            label="Total Size"
            value={formatFileSizeUtil(stats.totalSize)}
            change={0}
          />
        </div>
      </div>

      {/* Upload Component */}
      <div className="mb-6">
        <DocumentUpload />
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 flex items-center gap-3 bg-white border border-[#e1e1e1] rounded-xl px-4 py-3">
          <SearchIcon width={20} height={20} color="#1d1d1d" />
          <input
            type="text"
            placeholder="Search documents by name, description, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 outline-none"
          />
        </div>
        <select
          className="select select-bordered"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {/* Documents Table */}
      <div className="bg-white border border-[#e1e1e1] rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="heading-md">Documents</h2>
          <span className="text-sm text-base-content/70">
            Showing {documents.length} of {pagination?.total || 0} documents
          </span>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : documents.length === 0 ? (
          <div className="text-center py-8">
            <DocumentFileIcon width={48} height={48} color="#d1d5db" />
            <p className="text-base-content/70 mt-2">No documents found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Document</th>
                  <th>Tags</th>
                  <th>Submitted By</th>
                  <th>Version</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((document) => (
                  <tr key={document.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        {getFileIcon(document.mimeType)}
                        <div>
                          <p className="font-bold">{document.name}</p>
                          <p className="text-sm text-[#676767]">
                            {document.originalName} • {formatFileSizeUtil(document.fileSize)}
                          </p>
                          {document.description && (
                            <p className="text-xs text-[#676767] mt-1">
                              {document.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="flex flex-wrap gap-1">
                        {document.tags.map((tag, index) => (
                          <span key={index} className="badge badge-outline badge-sm">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="avatar">
                          <div className="w-8 h-8 rounded-full bg-base-300 flex items-center justify-center">
                            {document.submittedBy.profileImageUrl ? (
                              <img
                                src={document.submittedBy.profileImageUrl}
                                alt={document.submittedBy.name || document.submittedBy.email}
                                className="w-8 h-8 rounded-full"
                              />
                            ) : (
                              <span className="text-xs font-bold">
                                {(document.submittedBy.name || document.submittedBy.email).charAt(0).toUpperCase()}
                              </span>
                            )}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {document.submittedBy.name || 'No name'}
                          </p>
                          <p className="text-xs text-[#676767]">
                            {document.submittedBy.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-outline">v{document.version}</span>
                    </td>
                    <td>{getStatusBadge(document.status)}</td>
                    <td>
                      <div>
                        <p className="text-sm">{formatDate(document.createdAt)}</p>
                        {document.approvedAt && (
                          <p className="text-xs text-success">Approved: {formatDate(document.approvedAt)}</p>
                        )}
                        {document.rejectedAt && (
                          <p className="text-xs text-error">Rejected: {formatDate(document.rejectedAt)}</p>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => handleDownload(document)}
                          title="Download"
                        >
                          ⬇️
                        </button>
                        {userRole === 'ADMIN' && document.status === 'PENDING' && (
                          <>
                            <button
                              className="btn btn-success btn-sm"
                              onClick={() => handleDocumentAction(document, 'approve')}
                              title="Approve"
                            >
                              ✓
                            </button>
                            <button
                              className="btn btn-error btn-sm"
                              onClick={() => handleDocumentAction(document, 'reject')}
                              title="Reject"
                            >
                              ✕
                            </button>
                          </>
                        )}
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => handleDocumentAction(document, 'manage')}
                          title="More actions"
                        >
                          <MenuDotsIcon width={4} height={16} color="#1d1d1d" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className="flex justify-center mt-6">
            <div className="join">
              <button
                className="join-item btn"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
              >
                Previous
              </button>
              <button className="join-item btn btn-active">
                {currentPage} of {pagination.pages}
              </button>
              <button
                className="join-item btn"
                disabled={currentPage === pagination.pages}
                onClick={() => setCurrentPage(prev => prev + 1)}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Document Actions Modal */}
      {showActions && selectedDocument && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">
              Manage Document: {selectedDocument.name}
            </h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-base-content/70">
                  Status: {selectedDocument.status}
                </p>
                {selectedDocument.rejectionReason && (
                  <p className="text-sm text-error mt-2">
                    Rejection Reason: {selectedDocument.rejectionReason}
                  </p>
                )}
              </div>
            </div>

            <div className="modal-action">
              <button
                className="btn btn-error"
                onClick={() => {
                  if (confirm('Are you sure you want to delete this document?')) {
                    deleteMutation.mutate(selectedDocument.id);
                  }
                }}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete Document'}
              </button>
              <button
                className="btn btn-ghost"
                onClick={() => setShowActions(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {showApprovalModal && selectedDocument && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">
              Reject Document: {selectedDocument.name}
            </h3>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text">Rejection Reason *</span>
              </label>
              <textarea
                className="textarea textarea-bordered"
                placeholder="Enter the reason for rejecting this document..."
                rows={4}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                required
              />
            </div>

            <div className="modal-action">
              <button
                className="btn btn-error"
                onClick={handleReject}
                disabled={rejectMutation.isPending || !rejectionReason.trim()}
              >
                {rejectMutation.isPending ? 'Rejecting...' : 'Reject Document'}
              </button>
              <button
                className="btn btn-ghost"
                onClick={() => {
                  setShowApprovalModal(false);
                  setRejectionReason('');
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
