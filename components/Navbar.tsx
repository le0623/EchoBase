'use client';

import Image from 'next/image';
import SearchIcon from './icons/SearchIcon';
import BellIcon from './icons/BellIcon';

interface NavbarProps {
  user?: {
    name: string;
    email: string;
    avatar: string;
  };
}

export default function Navbar({ user }: NavbarProps) {
  return (
    <nav className="flex items-center justify-between mb-8">
      {/* Search */}
      <div className="flex items-center gap-3 bg-white border border-[#e1e1e1] rounded-xl px-4 py-3 w-[580px]">
        <SearchIcon width={20} height={20} color="#1d1d1d" />
        <input
          type="text"
          placeholder="Search documents, conversations ..."
          className="flex-1 outline-none text-base font-medium tracking-[-0.13px] opacity-60"
        />
      </div>

      {/* User Section */}
      <div className="flex items-center gap-4">
        <button className="p-2 bg-[#1d1d1d] rounded-lg">
          <BellIcon width={30} height={32} color="white" />
        </button>
        
        {user && (
          <>
            <Image
              src={user.avatar}
              alt={user.name}
              width={50}
              height={50}
              className="rounded-full"
            />
            <span className="text-lg font-bold tracking-[-0.14px]">{user.name}</span>
            <button className="bg-[#0198ff] text-white px-4 py-3 rounded-xl flex items-center gap-2 text-lg font-bold tracking-[-0.14px]">
              <svg width="21" height="21" viewBox="0 0 21 21" fill="currentColor">
                <rect width="21" height="21" rx="4" />
              </svg>
              Internal User
              <svg width="13" height="7" viewBox="0 0 13 7" fill="none">
                <path d="M1 1L6.5 6L12 1" stroke="currentColor" strokeWidth="2" />
              </svg>
            </button>
          </>
        )}
      </div>
    </nav>
  );
}