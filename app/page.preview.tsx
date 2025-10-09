'use client';

import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import DashboardContent from '@/components/DashboardContent';
import BillingContent from '@/components/BillingContent';
import DocumentsContent from '@/components/DocumentsContent';
import UsersContent from '@/components/UsersContent';
import ChatContent from '@/components/ChatContent';
import SettingsContent from '@/components/SettingsContent';
import Link from 'next/link';

type PageType = 'dashboard' | 'billing' | 'documents' | 'users' | 'chat' | 'settings' | 'signin';

export default function PreviewPage() {
  const [activePage, setActivePage] = useState<PageType>('dashboard');

  return (
    <div>
      {/* Page Selector */}
      <div className="fixed top-4 right-4 z-50 bg-white rounded-xl shadow-lg p-4">
        <p className="text-sm font-bold mb-2">Preview Pages:</p>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => setActivePage('dashboard')}
            className={`px-3 py-1 rounded text-sm ${
              activePage === 'dashboard' ? 'bg-[#0198ff] text-white' : 'bg-gray-100'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActivePage('billing')}
            className={`px-3 py-1 rounded text-sm ${
              activePage === 'billing' ? 'bg-[#0198ff] text-white' : 'bg-gray-100'
            }`}
          >
            Billing
          </button>
          <button
            onClick={() => setActivePage('documents')}
            className={`px-3 py-1 rounded text-sm ${
              activePage === 'documents' ? 'bg-[#0198ff] text-white' : 'bg-gray-100'
            }`}
          >
            Documents
          </button>
          <button
            onClick={() => setActivePage('users')}
            className={`px-3 py-1 rounded text-sm ${
              activePage === 'users' ? 'bg-[#0198ff] text-white' : 'bg-gray-100'
            }`}
          >
            Users
          </button>
          <button
            onClick={() => setActivePage('chat')}
            className={`px-3 py-1 rounded text-sm ${
              activePage === 'chat' ? 'bg-[#0198ff] text-white' : 'bg-gray-100'
            }`}
          >
            Chat
          </button>
          <button
            onClick={() => setActivePage('settings')}
            className={`px-3 py-1 rounded text-sm ${
              activePage === 'settings' ? 'bg-[#0198ff] text-white' : 'bg-gray-100'
            }`}
          >
            Settings
          </button>
          <button
            onClick={() => setActivePage('signin')}
            className={`px-3 py-1 rounded text-sm ${
              activePage === 'signin' ? 'bg-[#0198ff] text-white' : 'bg-gray-100'
            }`}
          >
            Sign In
          </button>
        </div>
      </div>

      {activePage === 'signin' ? (
        <div>
          <div className="fixed top-4 left-4 z-50">
            <button
              onClick={() => setActivePage('dashboard')}
              className="bg-white px-4 py-2 rounded-lg shadow-lg"
            >
              ← Back to App
            </button>
          </div>
          <Link href="/signin">
            <div className="cursor-pointer">Sign In Page (Click to view)</div>
          </Link>
        </div>
      ) : (
        <AppLayout>
          {activePage === 'dashboard' && <DashboardContent />}
          {activePage === 'billing' && <BillingContent />}
          {activePage === 'documents' && <DocumentsContent />}
          {activePage === 'users' && <UsersContent />}
          {activePage === 'chat' && <ChatContent />}
          {activePage === 'settings' && <SettingsContent />}
        </AppLayout>
      )}
    </div>
  );
}