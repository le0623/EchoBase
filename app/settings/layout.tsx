import { ReactNode } from 'react';
import { AuthenticatedLayout } from '@/components/AuthenticatedLayout';
import Link from 'next/link';

interface SettingsLayoutProps {
  children: ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-base-content/70">
              Manage your account and organization settings
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Settings Navigation */}
          <div className="lg:col-span-1">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-lg">Settings</h2>
                <div className="menu p-0">
                  <li>
                    <Link href="/settings/profile" className="active">
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link href="/settings/organization">Organization</Link>
                  </li>
                </div>
              </div>
            </div>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-3">
            {children}
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
