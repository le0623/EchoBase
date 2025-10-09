'use client';

import HeroSection from '@/components/HeroSection';
import RecentDocumentsCard from '@/components/RecentDocumentsCard';
import AnalyticsChartCard from '@/components/AnalyticsChartCard';
import RecentConversationsCard from '@/components/RecentConversationsCard';
import { mockRootProps } from '@/lib/dashboardMockData';

export default function DashboardPreviewPage() {
  return (
    <>
      {/* Hero Section with Metrics */}
      <HeroSection metrics={mockRootProps.metrics} />

      {/* Two Column Layout */}
      <div className="grid grid-cols-[1fr_601px] gap-6 mb-6">
        {/* Recent Documents */}
        <RecentDocumentsCard documents={mockRootProps.documents} />

        {/* Analytics Chart */}
        <AnalyticsChartCard data={mockRootProps.chartData} />
      </div>

      {/* Recent Conversations */}
      <RecentConversationsCard conversations={mockRootProps.conversations} />
    </>
  );
}