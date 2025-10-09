'use client';

import type { MetricType, DocumentStatus, ChartMonth } from '@/lib/enums';
import DashboardSidebar from './DashboardSidebar';
import DashboardHeader from './DashboardHeader';
import HeroSection from './HeroSection';
import AnalyticsChartCard from './AnalyticsChartCard';
import RecentDocumentsCard from './RecentDocumentsCard';
import RecentConversationsCard from './RecentConversationsCard';

interface DemobotDashboardProps {
  user: {
    name: string;
    avatar: string;
    role: string;
  };
  metrics: Array<{
    type: MetricType;
    value: number;
    changePercent: number;
    isPositive: boolean;
  }>;
  chartData: Array<{
    month: ChartMonth;
    value: number;
  }>;
  documents: Array<{
    id: string;
    name: string;
    uploadedAt: Date;
    size: number;
    queryCount: number;
    status: DocumentStatus;
  }>;
  conversations: Array<{
    id: string;
    question: string;
    timestamp: Date;
    sourceCount: number;
    confidence: number;
  }>;
  hasUnreadNotifications?: boolean;
}

export default function DemobotDashboard({
  user,
  metrics,
  chartData,
  documents,
  conversations,
  hasUnreadNotifications
}: DemobotDashboardProps) {
  return (
    <div className="min-h-screen bg-base-100 p-7">
      <div className="flex gap-6">
        {/* Sidebar */}
        <DashboardSidebar />

        {/* Main Content */}
        <main className="flex-1">
          {/* Header */}
          <DashboardHeader user={user} hasUnreadNotifications={hasUnreadNotifications} />

          {/* Hero Section with Metrics */}
          <HeroSection metrics={metrics} />

          {/* Two Column Layout */}
          <div className="grid grid-cols-[1fr_601px] gap-6 mb-6">
            {/* Recent Documents */}
            <RecentDocumentsCard documents={documents} />

            {/* Analytics Chart */}
            <AnalyticsChartCard data={chartData} />
          </div>

          {/* Recent Conversations */}
          <RecentConversationsCard conversations={conversations} />
        </main>
      </div>
    </div>
  );
}