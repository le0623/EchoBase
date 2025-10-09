'use client';

import { mockDashboardData } from '@/lib/mockData';
import { formatFileSize, formatRelativeTime, formatDate } from '@/lib/formatters';
import { DocumentStatus } from '@/lib/enums';
import StatCard from './StatCard';
import AnalyticsChart from './AnalyticsChart';
import PageHeader from './PageHeader';

export default function DashboardContent() {
  const { stats, recentDocuments, recentConversations, analyticsData } = mockDashboardData;

  return (
    <div>
      <PageHeader
        title="Transform Your Documents Into Intelligent Knowledge"
        description="Upload, process, and search through your organization's documents with AI-powered intelligence. Get instant answers from your knowledge base."
        illustration="/images/robot-dashboard.png"
        actionButton={{ label: 'Create AI Agent', onClick: () => {} }}
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white border border-[#e1e1e1] rounded-xl p-6">
          <StatCard
            label="Total Documents"
            value={stats.totalDocuments.toLocaleString()}
            change={stats.totalDocumentsChange}
          />
        </div>
        <div className="bg-white border border-[#e1e1e1] rounded-xl p-6">
          <StatCard
            label="Total Queries"
            value={stats.totalQueries.toLocaleString()}
            change={stats.totalQueriesChange}
          />
        </div>
        <div className="bg-white border border-[#e1e1e1] rounded-xl p-6">
          <StatCard
            label="Active Users"
            value={stats.activeUsers}
            change={Math.abs(stats.activeUsersChange)}
            isPositive={stats.activeUsersChange > 0}
          />
        </div>
        <div className="bg-white border border-[#e1e1e1] rounded-xl p-6">
          <StatCard
            label="Success Rate"
            value={`${stats.successRate}%`}
            change={stats.successRateChange}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Analytics Chart */}
        <div className="bg-white border border-[#e1e1e1] rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="heading-md">Analytics</h2>
            <button className="flex items-center gap-2 px-4 py-2 border border-[#e1e1e1] rounded-xl text-sm font-bold">
              Membership
              <svg width="13" height="7" viewBox="0 0 13 7" fill="none">
                <path d="M1 1L6.5 6L12 1" stroke="currentColor" strokeWidth="2" />
              </svg>
            </button>
          </div>
          <AnalyticsChart data={analyticsData} />
        </div>

        {/* Recent Documents */}
        <div className="bg-white border border-[#e1e1e1] rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="heading-md mb-2">Recent Documents</h2>
              <p className="text-sm text-[#676767]">Latest document uploads and processing status</p>
            </div>
            <button className="bg-[#1d1d1d] text-white px-4 py-3 rounded-xl text-base font-bold flex items-center gap-2">
              View All
              <svg width="5" height="9" viewBox="0 0 5 9" fill="currentColor">
                <path d="M0 0L5 4.5L0 9V0Z" />
              </svg>
            </button>
          </div>
          <div className="space-y-4">
            {recentDocuments.map((doc) => (
              <div key={doc.id}>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[#1d1d1d] rounded" />
                  <div className="flex-1">
                    <p className="font-bold text-base tracking-[-0.13px]">{doc.name}</p>
                    <p className="text-sm text-[#676767]">{formatFileSize(doc.size)}</p>
                  </div>
                  <span className={`badge ${
                    doc.status === DocumentStatus.PROCESSED ? 'badge-success' : 'badge-error'
                  }`}>
                    {doc.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-2 text-sm text-[#676767]">
                  <span>{formatRelativeTime(doc.uploadedAt)}</span>
                  <span>{doc.queries} queries</span>
                </div>
                <div className="border-t border-[#e1e1e1] mt-4" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Conversations */}
      <div className="bg-white border border-[#e1e1e1] rounded-xl p-6 mt-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="heading-md mb-2">Recent Conversations</h2>
            <p className="text-sm text-[#676767]">Latest AI chat interactions and confidence scores</p>
          </div>
          <button className="bg-[#1d1d1d] text-white px-4 py-3 rounded-xl text-base font-bold flex items-center gap-2">
            View All
            <svg width="5" height="9" viewBox="0 0 5 9" fill="currentColor">
              <path d="M0 0L5 4.5L0 9V0Z" />
            </svg>
          </button>
        </div>
        <div className="space-y-4">
          {recentConversations.map((conv) => (
            <div key={conv.id}>
              <div className="flex items-start justify-between">
                <p className="font-bold text-base tracking-[-0.13px] flex-1">{conv.question}</p>
                <div className="w-6 h-6 bg-[#1d1d1d] rounded-full" />
              </div>
              <div className="flex items-center gap-4 mt-2 text-base text-[#676767]">
                <span>{formatRelativeTime(conv.timestamp)}</span>
                <span>{conv.sources} sources</span>
                <span className="ml-auto text-[#0198ff] font-medium">{conv.confidence}% confidence</span>
              </div>
              <div className="border-t border-[#e1e1e1] mt-4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}