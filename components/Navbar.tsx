'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { signOut } from 'next-auth/react';
import { navigateToTenant } from '@/lib/url-utils';
import SearchIcon from './icons/SearchIcon';
import BellIcon from './icons/BellIcon';
import { Button } from './ui/button';
import { Check, MenuIcon, XIcon } from 'lucide-react';
import { baseUrl } from '@/lib/utils';

interface NavbarProps {
  user?: {
    name: string;
    email: string;
    avatar: string;
  };
  onToggleSidebar: () => void;
  currentTenant?: {
    id: string;
    name: string;
    subdomain: string;
  };
  availableTenants?: Array<{
    id: string;
    name: string;
    subdomain: string;
    isOwner: boolean;
  }>;
}

export default function Navbar({
  user,
  onToggleSidebar,
  currentTenant,
  availableTenants = []
}: NavbarProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isTenantDropdownOpen, setIsTenantDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const tenantDropdownRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        (tenantDropdownRef.current && !tenantDropdownRef.current.contains(event.target as Node)) &&
        (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node))
      ) {
        setIsTenantDropdownOpen(false);
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTenantSwitch = (tenantId: string) => {
    const tenant = availableTenants.find(t => t.id === tenantId);
    if (tenant) {
      navigateToTenant(tenant.subdomain, '/dashboard');
    }
    setIsTenantDropdownOpen(false);
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: baseUrl });
  };

  return (
    isSearchOpen ? (
      <nav className="flex items-center justify-between w-full">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-2 hover:bg-gray-100 transition-colors"
          >
            <XIcon width={20} height={20} color="#1d1d1d" />
          </button>

          <div className="flex items-center gap-2 bg-white border border-[#e1e1e1] rounded-lg px-4 py-3 w-full">
            <SearchIcon width={20} height={20} color="#1d1d1d" />
            <input
              type="text"
              placeholder="Search documents, conversations ..."
              className="flex-1 outline-none text-base font-medium tracking-[-0.13px] opacity-60"
              autoFocus
            />
          </div>
        </div>
      </nav>
    ) : (
      <nav className="flex items-center justify-between">
        {/* Mobile Hamburger + Search */}
        <div className="flex items-center gap-3 lg:gap-3">
          {/* Hamburger Menu Button - Mobile Only */}
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <MenuIcon width={20} height={20} color="#1d1d1d" />
          </button>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:flex items-center gap-3 bg-white border border-[#e1e1e1] rounded-xl px-4 py-3 w-[580px]">
            <SearchIcon width={20} height={20} color="#1d1d1d" />
            <input
              type="text"
              placeholder="Search documents, conversations ..."
              className="flex-1 outline-none text-base font-medium tracking-[-0.13px] opacity-60"
            />
          </div>

          {/* Search Icon - Mobile */}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <SearchIcon width={20} height={20} color="#1d1d1d" />
          </button>
        </div>

        {/* User Section */}
        <div className="flex items-center gap-2 lg:gap-4">
          {/* Notification - Desktop */}
          <button className="hidden lg:block p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <BellIcon width={30} height={32} />
          </button>

          {/* Notification - Mobile */}
          <button className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <BellIcon width={24} height={24} />
          </button>

          {user && (
            <>
              {/* User Avatar */}
              <div className="relative" ref={userDropdownRef}>
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-2 hover:bg-gray-100 rounded-lg p-1 transition-colors"
                >
                  <Image
                    src={user.avatar}
                    alt={user.name}
                    width={50}
                    height={50}
                    className="rounded-full w-10 h-10 lg:w-[50px] lg:h-[50px]"
                  />

                  {/* User Name - Desktop Only */}
                  <span className="hidden lg:block text-lg font-bold tracking-[-0.14px]">{user.name}</span>

                  {/* Dropdown Arrow */}
                  <svg
                    width="12"
                    height="8"
                    viewBox="0 0 12 8"
                    fill="none"
                    className={`hidden lg:block transition-transform ${isUserDropdownOpen ? 'rotate-180' : ''}`}
                  >
                    <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                {/* User Dropdown */}
                {isUserDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50 user-dropdown">
                    <div className="p-2">
                      <div className="px-3 py-2 border-b border-gray-100 mb-2">
                        <div className="text-sm font-semibold text-gray-900">{user.name}</div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                      </div>

                      <button
                        onClick={() => {
                          setIsUserDropdownOpen(false);
                          // Add profile functionality here
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
                        </svg>
                        Profile
                      </button>

                      <button
                        onClick={() => {
                          setIsUserDropdownOpen(false);
                          // Add settings functionality here
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
                          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" strokeWidth="2" />
                        </svg>
                        Settings
                      </button>

                      <div className="border-t border-gray-100 mt-2 pt-2">
                        <button
                          onClick={handleSignOut}
                          className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <polyline points="16,17 21,12 16,7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Tenant Selector - Desktop */}
              <div className="relative" ref={tenantDropdownRef}>
                <Button
                  onClick={() => setIsTenantDropdownOpen(!isTenantDropdownOpen)}
                  className="bg-[#0198ff] text-white flex items-center gap-2 text-lg font-bold tracking-[-0.14px] hover:bg-[#0188e6] transition-colors"
                >
                  <span className="hidden lg:block">{currentTenant?.name || 'Select App'}</span>
                  <svg width="13" height="7" viewBox="0 0 13 7" fill="none">
                    <path d="M1 1L6.5 6L12 1" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </Button>

                {/* Tenant Dropdown */}
                {isTenantDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50 tenant-dropdown">
                    <div className="p-2">
                      {availableTenants.length > 0 ? (
                        availableTenants.map((tenant) => (
                          <Button
                            variant={'ghost'}
                            key={tenant.id}
                            onClick={() => handleTenantSwitch(tenant.id)}
                          >
                            <div className="flex gap-2 mr-4">
                              <span className='font-bold'>{tenant.name}</span>
                              {tenant.isOwner && (
                                <span>(owner)</span>
                              )}
                            </div>
                            {currentTenant?.id === tenant.id && (
                              <Check width={16} height={16} />
                            )}
                          </Button>
                        ))
                      ) : (
                        <div className="px-3 py-2 text-sm text-gray-500 text-center">
                          No app available
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </nav>
    )
  );
}