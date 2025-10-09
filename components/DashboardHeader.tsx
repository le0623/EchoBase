'use client';

import { useState } from 'react';
import Image from 'next/image';
import SearchIcon from './icons/SearchIcon';
import BellIcon from './icons/BellIcon';
import IdBadgeIcon from './icons/IdBadgeIcon';
import ChevronDownSmallIcon from './icons/ChevronDownSmallIcon';

interface DashboardHeaderProps {
  user: {
    name: string;
    avatar: string;
    role: string;
  };
  hasUnreadNotifications?: boolean;
}

export default function DashboardHeader({ user, hasUnreadNotifications }: DashboardHeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="flex items-center justify-between mb-6">
      {/* Search Bar */}
      <div className="relative w-[580px]">
        <div className="input input-md flex items-center gap-3 bg-white border border-[var(--border-light)] rounded-xl">
          <SearchIcon width={20} height={20} color="#676767" />
          <input
            type="text"
            placeholder="Search documents, conversations ..."
            className="flex-1 bg-transparent border-none outline-none body-md text-[#1d1d1d] opacity-60"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-6">
        {/* Notification Bell */}
        <button className="relative" aria-label="Notifications">
          <BellIcon width={30} height={32} color="#1d1d1d" />
          {hasUnreadNotifications && (
            <span className="absolute top-0 right-0 w-2 h-2 bg-error rounded-full" />
          )}
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3">
          <Image
            src={user.avatar}
            alt={user.name}
            width={50}
            height={50}
            className="rounded-full"
          />
          <span className="text-lg font-bold tracking-[-0.14px] text-[#1d1d1d]">
            {user.name}
          </span>
        </div>

        {/* User Role Dropdown */}
        <div className="dropdown dropdown-end">
          <button
            className="btn btn-md bg-[#0198ff] text-white rounded-xl flex items-center gap-2 border-none hover:bg-[#0188e6]"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <IdBadgeIcon width={21} height={21} color="white" />
            <span className="text-lg font-bold tracking-[-0.14px]">{user.role}</span>
            <ChevronDownSmallIcon width={13} height={7} />
          </button>
          {isDropdownOpen && (
            <ul className="dropdown-content menu bg-white rounded-box z-[1] w-52 p-2 shadow-lg border border-[var(--border-light)] mt-2">
              <li><a>Profile Settings</a></li>
              <li><a>Account</a></li>
              <li><a>Sign Out</a></li>
            </ul>
          )}
        </div>
      </div>
    </header>
  );
}