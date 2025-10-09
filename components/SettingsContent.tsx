'use client';

import { useState } from 'react';
import Image from 'next/image';
import { mockIntegrations, mockRoles } from '@/lib/mockData';
import PageHeader from './PageHeader';

type SettingsTab = 'general' | 'security' | 'notifications' | 'integrations' | 'advanced';

export default function SettingsContent() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [darkMode, setDarkMode] = useState(false);
  const [twoFA, setTwoFA] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);

  return (
    <div>
      <PageHeader
        title="System Settings"
        description="Configure your document management system"
        illustration="/images/settings-illustration.png"
        actionButton={{ label: 'Save All Changes', onClick: () => {} }}
      />

      {/* Tabs */}
      <div className="bg-white border border-[#e1e1e1] rounded-xl">
        <div className="flex border-b border-[#e1e1e1]">
          {(['general', 'security', 'notifications', 'integrations', 'advanced'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 text-lg font-bold capitalize ${
                activeTab === tab
                  ? 'text-[#1d1d1d] border-b-2 border-[#1d1d1d]'
                  : 'text-[#a8a8a8]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="p-8">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div>
                <h3 className="heading-lg mb-4">General Configuration</h3>
                <p className="text-lg text-[#676767] mb-6">Basic system settings and preferences</p>
                
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Organization Name"
                    className="input input-bordered w-full"
                  />
                  <input
                    type="email"
                    placeholder="Administrator Email"
                    className="input input-bordered w-full"
                  />
                  <textarea
                    placeholder="Organization Description"
                    className="textarea textarea-bordered w-full"
                    rows={4}
                  />
                </div>
              </div>

              <div>
                <h3 className="heading-lg mb-4">System Preferences</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-[#e1e1e1] rounded-2xl">
                    <div>
                      <p className="text-[22px] font-bold">Dark Mode</p>
                      <p className="text-base text-[#676767]">Enable dark theme for the interface</p>
                    </div>
                    <input
                      type="checkbox"
                      className="toggle toggle-primary"
                      checked={darkMode}
                      onChange={(e) => setDarkMode(e.target.checked)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h3 className="heading-lg mb-4">Security Settings</h3>
                <p className="text-lg text-[#676767] mb-6">Configure authentication and access control</p>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-[#e1e1e1] rounded-2xl">
                    <div>
                      <p className="text-[22px] font-bold">Two-Factor Authentication</p>
                      <p className="text-base text-[#676767]">Require 2FA for all admin users</p>
                    </div>
                    <input
                      type="checkbox"
                      className="toggle toggle-primary"
                      checked={twoFA}
                      onChange={(e) => setTwoFA(e.target.checked)}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="heading-lg mb-4">Access Control</h3>
                <p className="text-lg text-[#676767] mb-6">Manage user roles and permissions</p>
                <button className="btn btn-neutral mb-4">Manage Roles</button>
                
                <div className="space-y-4">
                  {mockRoles.map((role) => (
                    <div key={role.name} className="p-4 border border-[#e1e1e1] rounded-2xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[22px] font-bold">{role.name}</p>
                          <p className="text-base text-[#676767]">{role.description}</p>
                        </div>
                        <span className="badge badge-primary text-white">{role.userCount} users</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h3 className="heading-lg mb-4">Notification Preferences</h3>
                <p className="text-lg text-[#676767] mb-6">Configure how and when you receive notifications</p>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-[#e1e1e1] rounded-2xl">
                    <div>
                      <p className="text-[22px] font-bold">Email Notifications</p>
                      <p className="text-base text-[#676767]">Receive email alerts for important events</p>
                    </div>
                    <input
                      type="checkbox"
                      className="toggle toggle-primary"
                      checked={emailNotifications}
                      onChange={(e) => setEmailNotifications(e.target.checked)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'integrations' && (
            <div className="space-y-6">
              <div>
                <h3 className="heading-lg mb-4">External Integrations</h3>
                <p className="text-lg text-[#676767] mb-6">Connect with external services and APIs</p>
                
                <div className="space-y-4">
                  {mockIntegrations.map((integration) => (
                    <div key={integration.id} className="flex items-center gap-4 p-4 border border-[#e1e1e1] rounded-2xl">
                      <Image src={integration.logo} alt={integration.name} width={36} height={36} />
                      <div className="flex-1">
                        <p className="text-[22px] font-bold">{integration.name}</p>
                        <p className="text-base text-[#676767]">{integration.description}</p>
                      </div>
                      <span className={`badge ${
                        integration.status === 'Connected' ? 'badge-success' : 'badge-ghost'
                      } text-white`}>
                        {integration.status}
                      </span>
                      <button className="btn btn-neutral">Configure</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'advanced' && (
            <div className="space-y-6">
              <div>
                <h3 className="heading-lg mb-4">Advanced Configuration</h3>
                <p className="text-lg text-[#676767] mb-6">System-level settings and maintenance options</p>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 border border-[#e1e1e1] rounded-2xl">
                    <p className="text-[22px] font-bold flex-1">Database Backup Frequency</p>
                    <select className="select select-bordered">
                      <option>Daily</option>
                      <option>Weekly</option>
                      <option>Monthly</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="heading-lg mb-4 text-[#fd3b3b]">Danger Zone</h3>
                <p className="text-lg text-[#676767] mb-6">System-level settings and maintenance options</p>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-[#e1e1e1] rounded-2xl">
                    <div>
                      <p className="text-[22px] font-bold">Clear All Cache</p>
                      <p className="text-base text-[#676767]">Remove all cached data to improve performance</p>
                    </div>
                    <button className="btn btn-neutral">Clear Cache</button>
                  </div>
                  <div className="flex items-center justify-between p-4 border border-[#e1e1e1] rounded-2xl">
                    <div>
                      <p className="text-[22px] font-bold">Reset All Settings</p>
                      <p className="text-base text-[#676767]">Restore all settings to default values</p>
                    </div>
                    <button className="btn btn-neutral">Reset Settings</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}