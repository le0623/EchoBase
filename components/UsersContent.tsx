'use client';

import { useState } from 'react';
import { mockUsers, mockUserStats } from '@/lib/mockData';
import { formatRelativeTime, formatDate } from '@/lib/formatters';
import StatCard from './StatCard';
import PageHeader from './PageHeader';
import Image from 'next/image';
import SearchIcon from './icons/SearchIcon';
import MenuDotsIcon from './icons/MenuDotsIcon';

export default function UsersContent() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div>
      <PageHeader
        title="User Management"
        description="Manage users, roles, and permissions across your organization"
        illustration="/images/users-illustration.png"
        actionButton={{ label: 'Invite User', onClick: () => {} }}
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white border border-[#e1e1e1] rounded-xl p-6">
          <StatCard
            label="Total Users"
            value={mockUserStats.totalUsers}
            change={mockUserStats.totalUsersChange}
          />
        </div>
        <div className="bg-white border border-[#e1e1e1] rounded-xl p-6">
          <StatCard
            label="Active Users"
            value={mockUserStats.activeUsers}
            change={mockUserStats.activeUsersChange}
          />
        </div>
        <div className="bg-white border border-[#e1e1e1] rounded-xl p-6">
          <StatCard
            label="Pending Invites"
            value={mockUserStats.pendingInvites}
            change={mockUserStats.pendingInvitesChange}
          />
        </div>
        <div className="bg-white border border-[#e1e1e1] rounded-xl p-6">
          <StatCard
            label="Admin Users"
            value={mockUserStats.adminUsers}
            change={mockUserStats.adminUsersChange}
          />
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="flex items-center gap-3 bg-white border border-[#e1e1e1] rounded-xl px-4 py-3">
          <SearchIcon width={20} height={20} color="#1d1d1d" />
          <input
            type="text"
            placeholder="Search user by name, email or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 outline-none"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-[#e1e1e1] rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="heading-md">Users</h2>
          <select className="select select-bordered">
            <option>All Documents</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Status</th>
                <th>Last Active</th>
                <th>Joined</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {mockUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <Image
                        src={user.avatar}
                        alt={user.name}
                        width={42}
                        height={42}
                        className="rounded-full"
                      />
                      <div>
                        <p className="font-bold">{user.name}</p>
                        <p className="text-sm text-[#676767]">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td>{user.role}</td>
                  <td>
                    <span className="badge badge-success text-white">{user.status}</span>
                  </td>
                  <td>{formatRelativeTime(user.lastActive)}</td>
                  <td>{formatDate(user.joinedAt)}</td>
                  <td>
                    <button className="btn btn-ghost btn-sm">
                      <MenuDotsIcon width={4} height={16} color="#1d1d1d" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}