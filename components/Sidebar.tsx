'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import HomeIcon from './icons/HomeIcon';
import AnalyticsIcon from './icons/AnalyticsIcon';
import UserIcon from './icons/UserIcon';
import DocumentIcon from './icons/DocumentIcon';
import ApprovalIcon from './icons/ApprovalIcon';
import LightningIcon from './icons/LightningIcon';
import BillingIcon from './icons/BillingIcon';
import KeyIcon from './icons/KeyIcon';
import SettingsIcon from './icons/SettingsIcon';
import ArrowRightIcon from './icons/ArrowRightIcon';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: HomeIcon },
  { href: '/analytics', label: 'Analytics', icon: AnalyticsIcon },
  { href: '/users', label: 'User Management', icon: UserIcon },
  { href: '/upload', label: 'Upload', icon: DocumentIcon },
  { href: '/documents', label: 'Documents', icon: DocumentIcon },
  { href: '/approval', label: 'Document Approval', icon: ApprovalIcon },
  { href: '/chat', label: 'AI-Powerd Search', icon: LightningIcon },
  { href: '/billing', label: 'Billing & Usage', icon: BillingIcon },
  { href: '/api-keys', label: 'API Key', icon: KeyIcon },
  { href: '/settings', label: 'Settings', icon: SettingsIcon },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[310px] bg-[var(--sidebar-bg)] text-[var(--sidebar-text)] rounded-[20px] p-6 flex flex-col h-[calc(100vh-56px)] sticky top-7">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-12">
        <Image
          src="/images/avatar-default.jpg"
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
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-white text-neutral'
                  : 'text-[var(--sidebar-text)] hover:bg-[var(--sidebar-hover)]'
              }`}
            >
              <Icon width={20} height={20} color={isActive ? '#1d1d1d' : '#676767'} />
              <span className="text-lg font-medium tracking-[-0.14px]">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* PRO Plan CTA */}
      <div className="mt-auto bg-[#323232] border border-[#444444] rounded-xl p-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-bold tracking-[-0.10px]">Get the PRO Plan</span>
          <ArrowRightIcon width={21} height={3} color="white" />
        </div>
        <p className="text-xs text-[#606060]">Unlock all AI based features.</p>
      </div>
    </aside>
  );
}