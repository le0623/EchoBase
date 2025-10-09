'use client';

import DemobotDashboard from '@/components/DemobotDashboard';
import { mockRootProps } from '@/lib/dashboardMockData';

export default function DashboardPreviewPage() {
  return (
    <DemobotDashboard
      user={mockRootProps.user}
      metrics={mockRootProps.metrics}
      chartData={mockRootProps.chartData}
      documents={mockRootProps.documents}
      conversations={mockRootProps.conversations}
      hasUnreadNotifications={mockRootProps.hasUnreadNotifications}
    />
  );
}