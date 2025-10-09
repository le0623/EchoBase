'use client';

import { useState } from 'react';
import { mockDocuments, mockDocumentStats } from '@/lib/mockData';
import { formatFileSize, formatDate } from '@/lib/formatters';
import { DocumentStatus } from '@/lib/enums';
import StatCard from './StatCard';
import PageHeader from './PageHeader';
import Image from 'next/image';
import SearchIcon from './icons/SearchIcon';
import MenuDotsIcon from './icons/MenuDotsIcon';

export default function DocumentsContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [typeFilter, setTypeFilter] = useState('All Types');

  return (
    <div>
      <PageHeader
        title="Document Library"
        description="Browse, search, and manage all your documents in one place"
        illustration="/images/documents-illustration.png"
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white border border-[#e1e1e1] rounded-xl p-6">
          <StatCard
            label="Total Documents"
            value={mockDocumentStats.totalDocuments}
            change={mockDocumentStats.totalDocumentsChange}
          />
        </div>
        <div className="bg-white border border-[#e1e1e1] rounded-xl p-6">
          <StatCard
            label="Approved"
            value={mockDocumentStats.approved}
            change={mockDocumentStats.approvedChange}
          />
        </div>
        <div className="bg-white border border-[#e1e1e1] rounded-xl p-6">
          <StatCard
            label="Pending Review"
            value={mockDocumentStats.pendingReview}
            change={mockDocumentStats.pendingReviewChange}
          />
        </div>
        <div className="bg-white border border-[#e1e1e1] rounded-xl p-6">
          <StatCard
            label="Total Downloads"
            value={mockDocumentStats.totalDownloads}
            change={Math.abs(mockDocumentStats.totalDownloadsChange)}
            isPositive={mockDocumentStats.totalDownloadsChange > 0}
          />
        </div>
      </div>

      {/* Search & Filters */}
      <div className="mb-6">
        <h2 className="heading-md mb-4">Search & Filters</h2>
        <div className="flex gap-4">
          <div className="flex-1 flex items-center gap-3 bg-white border border-[#e1e1e1] rounded-xl px-4 py-3">
            <SearchIcon width={20} height={20} color="#1d1d1d" />
            <input
              type="text"
              placeholder="Search documents, conversations ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 outline-none"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="select select-bordered"
          >
            <option>All Status</option>
            <option>Pending</option>
            <option>Processed</option>
            <option>Error</option>
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="select select-bordered"
          >
            <option>All Types</option>
            <option>PDF</option>
            <option>Word</option>
            <option>Excel</option>
          </select>
          <button className="btn btn-neutral">Apply Filters</button>
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-white border border-[#e1e1e1] rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="heading-md mb-2">Documents</h2>
            <p className="text-sm text-[#676767]">Showing {mockDocuments.length} of {mockDocuments.length} documents</p>
          </div>
          <select className="select select-bordered">
            <option>All Documents</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Document</th>
                <th>Author</th>
                <th>Status</th>
                <th>Version</th>
                <th>Last Modified</th>
                <th>Downloads</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {mockDocuments.map((doc) => (
                <tr key={doc.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                        📄
                      </div>
                      <div>
                        <p className="font-bold">{doc.name}</p>
                        <p className="text-sm text-[#676767]">{formatFileSize(doc.size)}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <Image
                        src={doc.author.avatar}
                        alt={doc.author.name}
                        width={30}
                        height={30}
                        className="rounded-full"
                      />
                      <span>{doc.author.name}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${
                      doc.status === DocumentStatus.PENDING ? 'badge-warning' :
                      doc.status === DocumentStatus.ERROR ? 'badge-error' : 'badge-success'
                    }`}>
                      {doc.status}
                    </span>
                  </td>
                  <td>{doc.version}</td>
                  <td>{formatDate(doc.lastModified)}</td>
                  <td>{doc.downloads}</td>
                  <td>
                    <button className="btn btn-ghost btn-sm">
                      <MenuDotsIcon width={4} height={16} color="#1d1d1d" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}