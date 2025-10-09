'use client';

import { formatTimeAgo, formatSourceCount, formatConfidence } from '@/lib/formatters';
import EyeViewIcon from './icons/EyeViewIcon';

interface ConversationListItemProps {
  conversation: {
    id: string;
    question: string;
    timestamp: Date;
    sourceCount: number;
    confidence: number;
  };
}

export default function ConversationListItem({ conversation }: ConversationListItemProps) {
  const getConfidenceBadgeClass = (confidence: number) => {
    if (confidence >= 90) {
      return 'badge badge-md bg-[#0198ff] text-white border-none';
    } else if (confidence >= 80) {
      return 'badge badge-md bg-[#0198ff] text-white border-none';
    } else {
      return 'badge badge-md badge-warning';
    }
  };

  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex-1">
        <p className="text-base font-bold tracking-[-0.13px] text-[#1d1d1d] mb-2">
          {conversation.question}
        </p>
        <div className="flex items-center gap-4">
          <span className="text-base font-medium tracking-[-0.13px] text-[#676767]">
            {formatTimeAgo(conversation.timestamp)}
          </span>
          <span className="text-base font-medium tracking-[-0.13px] text-[#676767]">
            {formatSourceCount(conversation.sourceCount)}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span className={getConfidenceBadgeClass(conversation.confidence)}>
          {formatConfidence(conversation.confidence)}
        </span>
        <button className="btn btn-ghost btn-sm btn-circle" aria-label="View conversation">
          <EyeViewIcon width={24} height={19} color="#1d1d1d" />
        </button>
      </div>
    </div>
  );
}