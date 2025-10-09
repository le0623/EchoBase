'use client';

import type { DocumentStatus } from '@/lib/enums';
import DocumentListItem from './DocumentListItem';
import ArrowRightSmallIcon from './icons/ArrowRightSmallIcon';

interface Document {
  id: string;
  name: string;
  uploadedAt: Date;
  size: number;
  queryCount: number;
  status: DocumentStatus;
}

interface RecentDocumentsCardProps {
  documents: Document[];
}

export default function RecentDocumentsCard({ documents }: RecentDocumentsCardProps) {
  return (
    <div className="bg-white rounded-[20px] border border-[var(--border-light)] p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#1d1d1d] mb-1">
            Recent Documents
          </h2>
          <p className="text-sm font-medium text-[#676767]">
            Latest document uploads and processing status
          </p>
        </div>
        
        <button className="btn btn-md bg-[#1d1d1d] text-white rounded-xl border-none hover:bg-[#2d2d2d] flex items-center gap-2">
          <span className="text-base font-bold tracking-[-0.13px]">View All</span>
          <ArrowRightSmallIcon width={5} height={9} color="white" />
        </button>
      </div>

      {/* Document List */}
      <div className="divide-y divide-[var(--border-light)]">
        {documents.map((document) => (
          <DocumentListItem key={document.id} document={document} />
        ))}
      </div>
    </div>
  );
}