'use client';

import ConversationListItem from './ConversationListItem';
import ArrowRightSmallIcon from './icons/ArrowRightSmallIcon';

interface Conversation {
  id: string;
  question: string;
  timestamp: Date;
  sourceCount: number;
  confidence: number;
}

interface RecentConversationsCardProps {
  conversations: Conversation[];
}

export default function RecentConversationsCard({ conversations }: RecentConversationsCardProps) {
  return (
    <div className="bg-white rounded-[20px] border border-[var(--border-light)] p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#1d1d1d] mb-1">
            Recent Conversations
          </h2>
          <p className="text-sm font-medium text-[#676767]">
            Latest AI chat interactions and confidence scores
          </p>
        </div>
        
        <button className="btn btn-md bg-[#1d1d1d] text-white rounded-xl border-none hover:bg-[#2d2d2d] flex items-center gap-2">
          <span className="text-base font-bold tracking-[-0.13px]">View All</span>
          <ArrowRightSmallIcon width={5} height={9} color="white" />
        </button>
      </div>

      {/* Conversation List */}
      <div className="divide-y divide-[var(--border-light)]">
        {conversations.map((conversation) => (
          <ConversationListItem key={conversation.id} conversation={conversation} />
        ))}
      </div>
    </div>
  );
}