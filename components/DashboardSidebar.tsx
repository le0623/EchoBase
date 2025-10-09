'use client';

import { useState } from 'react';
import Image from 'next/image';
import HomeIcon from './icons/HomeIcon';
import AnalyticsIcon from './icons/AnalyticsIcon';
import UserIcon from './icons/UserIcon';
import DocumentIcon from './icons/DocumentIcon';
import ApprovalIcon from './icons/ApprovalIcon';
import LightningIcon from './icons/LightningIcon';
import SettingsIcon from './icons/SettingsIcon';
import ArrowRightIcon from './icons/ArrowRightIcon';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: HomeIcon, active: true },
  { id: 'analytics', label: 'Analytics', icon: AnalyticsIcon, active: false },
  { id: 'users', label: 'User Management', icon: UserIcon, active: false },
  { id: 'documents', label: 'Documents', icon: DocumentIcon, active: false },
  { id: 'approval', label: 'Document Approval', icon: ApprovalIcon, active: false },
  { id: 'search', label: 'AI-Powerd Search', icon: LightningIcon, active: false },
  { id: 'settings', label: 'Settings', icon: SettingsIcon, active: false },
];

export default function DashboardSidebar() {
  const [activeItem, setActiveItem] = useState('dashboard');

  return (
    <aside className="w-[310px] bg-[#1d1d1d] text-white rounded-[20px] p-6 flex flex-col h-[calc(100vh-56px)] sticky top-7">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-12">
        <Image
          src="/images/demobot-logo.jpg"
          alt="Demobot"
          width={66}
          height={68}
          className="rounded-full"
        />
        <span className="text-[24.51px] font-bold tracking-[-0.20px]">Demobot</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveItem(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-white text-[#1d1d1d]'
                  : 'text-[#676767] hover:bg-[#2d2d2d]'
              }`}
            >
              <Icon width={20} height={20} color={isActive ? '#1d1d1d' : '#676767'} />
              <span className="text-lg font-medium tracking-[-0.14px]">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* PRO Plan CTA */}
      <div className="mt-auto bg-[#323232] border border-[#444444] rounded-xl p-4 cursor-pointer hover:bg-[#3a3a3a] transition-colors">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-bold tracking-[-0.10px]">Get the PRO Plan</span>
          <ArrowRightIcon width={21} height={3} color="white" />
        </div>
        <p className="text-xs text-[#606060]">Unlock all AI based features.</p>
      </div>
    </aside>
  );
}