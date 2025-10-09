'use client';

import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { mockRootProps } from '@/lib/mockData';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-[#f8f8f8] p-7">
      <div className="flex gap-6">
        <Sidebar />
        <main className="flex-1">
          <Navbar user={mockRootProps.user} />
          {children}
        </main>
      </div>
    </div>
  );
}