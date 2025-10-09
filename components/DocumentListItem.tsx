'use client';

import { useState } from 'react';
import type { DocumentStatus } from '@/lib/enums';
import { formatFileSize, formatTimeAgo, formatQueryCount } from '@/lib/formatters';
import DocumentFileIcon from './icons/DocumentFileIcon';
import MenuDotsVerticalIcon from './icons/MenuDotsVerticalIcon';

interface DocumentListItemProps {
  document: {
    id: string;
    name: string;
    uploadedAt: Date;
    size: number;
    queryCount: number;
    status: DocumentStatus;
  };
}

export default function DocumentListItem({ document }: DocumentListItemProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getStatusBadgeClass = (status: DocumentStatus) => {
    switch (status) {
      case 'Processed':
        return 'badge badge-md bg-[#0198ff] text-white border-none';
      case 'Error':
        return 'badge badge-md bg-[#fd3b3b] text-white border-none';
      default:
        return 'badge badge-md badge-neutral';
    }
  };

  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex items-center gap-3 flex-1">
        <DocumentFileIcon width={22} height={26} color="#1d1d1d" />
        <span className="text-base font-bold tracking-[-0.13px] text-[#1d1d1d]">
          {document.name}
        </span>
      </div>

      <div className="flex items-center gap-6">
        <span className="text-base font-medium tracking-[-0.13px] text-[#676767] w-24">
          {formatTimeAgo(document.uploadedAt)}
        </span>
        <span className="text-base font-medium tracking-[-0.13px] text-[#676767] w-20">
          {formatFileSize(document.size)}
        </span>
        <span className="text-base font-medium tracking-[-0.13px] text-[#676767] w-24">
          {formatQueryCount(document.queryCount)}
        </span>
        <span className={getStatusBadgeClass(document.status)}>
          {document.status}
        </span>
        
        {/* Menu Dropdown */}
        <div className="dropdown dropdown-end">
          <button
            className="btn btn-ghost btn-sm btn-circle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="More options"
          >
            <MenuDotsVerticalIcon width={4} height={16} color="#1d1d1d" />
          </button>
          {isMenuOpen && (
            <ul className="dropdown-content menu bg-white rounded-box z-[1] w-48 p-2 shadow-lg border border-[var(--border-light)] mt-2">
              <li><a>View Details</a></li>
              <li><a>Download</a></li>
              <li><a>Share</a></li>
              <li><a className="text-error">Delete</a></li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}