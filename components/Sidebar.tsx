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
import KeyIcon from './icons/KeyIcon';
import BillingIcon from './icons/BillingIcon';
import UploadIcon from './icons/UploadIcon';
import Link from 'next/link';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: HomeIcon, active: true },
  { id: 'analytics', label: 'Analytics', icon: AnalyticsIcon, active: false },
  { id: 'users', label: 'User Management', icon: UserIcon, active: false },
  { id: 'upload', label: 'Upload', icon: UploadIcon, active: false },
  { id: 'documents', label: 'Documents', icon: DocumentIcon, active: false },
  { id: 'approval', label: 'Document Approval', icon: ApprovalIcon, active: false },
  { id: 'search', label: 'AI-Powerd Search', icon: LightningIcon, active: false },
  { id: 'billing', label: 'Billing & Usage', icon: BillingIcon, active: false },
  { id: 'api-keys', label: 'API Key', icon: KeyIcon, active: false },
  { id: 'settings', label: 'Settings', icon: SettingsIcon, active: false },
];

export default function DashboardSidebar() {
  const [activeItem, setActiveItem] = useState('dashboard');

  return (
    <aside className="w-[310px] bg-[#1d1d1d] text-white rounded-[20px] p-6 flex flex-col h-[calc(100vh-56px)] sticky top-7">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-12">
        <Image
          src="/images/demobot-logo.png"
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
            <Link
              key={item.id}
              href={`/${item.id}`}
              onClick={() => setActiveItem(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-white text-[#1d1d1d]'
                  : 'text-[#676767] hover:bg-[#2d2d2d]'
              }`}
            >
              <Icon width={20} height={20} color={isActive ? '#1d1d1d' : '#676767'} />
              <span className="text-md font-medium tracking-[-0.14px]">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* PRO Plan CTA */}
      <div className="mt-auto bg-[#323232] border border-[#444444] rounded-xl p-2 cursor-pointer hover:bg-[#3a3a3a] transition-colors flex items-center gap-3">
        <Image
          src="/images/demobot-logo.png"
          alt="Demobot"
          width={60}
          height={60}
          className="rounded-full"
        />
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-bold tracking-[-0.10px]">Get the PRO Plan</span>
            <svg width="20" height="12" viewBox="0 0 20 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 5.25C0.585786 5.25 0.25 5.58579 0.25 6C0.25 6.41421 0.585786 6.75 1 6.75V6V5.25ZM19.5303 6.53033C19.8232 6.23744 19.8232 5.76256 19.5303 5.46967L14.7574 0.696699C14.4645 0.403806 13.9896 0.403806 13.6967 0.696699C13.4038 0.989593 13.4038 1.46447 13.6967 1.75736L17.9393 6L13.6967 10.2426C13.4038 10.5355 13.4038 11.0104 13.6967 11.3033C13.9896 11.5962 14.4645 11.5962 14.7574 11.3033L19.5303 6.53033ZM1 6V6.75H19V6V5.25H1V6Z" fill="white"/>
            </svg>
          </div>
          <p className="text-xs text-[#606060]">Unlock all AI based features.</p>
        </div>
      </div>
    </aside>
  );
}