'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { formatRelativeTime, formatDate } from '@/lib/formatters';
import StatCard from './StatCard';
import PageHeader from './PageHeader';
import Image from 'next/image';
import SearchIcon from './icons/SearchIcon';
import MenuDotsIcon from './icons/MenuDotsIcon';
import PlusIcon from './icons/PlusIcon';

interface User {
  id: string;
  email: string;
  name?: string;
  profileImageUrl?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
  role: 'ADMIN' | 'MEMBER' | 'VIEWER';
  lastActive: string;
  createdAt: string;
  updatedAt: string;
}

interface Invitation {
  id: string;
  email: string;
  role: 'ADMIN' | 'MEMBER' | 'VIEWER';
  status: 'PENDING' | 'ACCEPTED' | 'EXPIRED' | 'REVOKED';
  createdAt: string;
  expiresAt: string;
  user?: {
    id: string;
    name?: string;
    email: string;
  };
}

interface UserStats {
  totalUsers: number;
  activeUsers: number;
  pendingInvites: number;
  adminUsers: number;
  totalUsersChange: number;
  activeUsersChange: number;
  pendingInvitesChange: number;
  adminUsersChange: number;
}

export default function UserManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    email: '',
    role: 'MEMBER' as 'ADMIN' | 'MEMBER' | 'VIEWER',
  });
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserActions, setShowUserActions] = useState(false);

  const queryClient = useQueryClient();

  // Fetch users
  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await fetch('/api/users');
      if (!response.ok) throw new Error('Failed to fetch users');
      return response.json();
    },
  });

  // Fetch invitations
  const { data: invitationsData } = useQuery({
    queryKey: ['invitations'],
    queryFn: async () => {
      const response = await fetch('/api/users/invitations');
      if (!response.ok) throw new Error('Failed to fetch invitations');
      return response.json();
    },
  });

  const users: User[] = usersData?.users || [];
  const invitations: Invitation[] = invitationsData?.invitations || [];

  // Calculate stats
  const stats: UserStats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.status === 'ACTIVE').length,
    pendingInvites: invitations.filter(i => i.status === 'PENDING').length,
    adminUsers: users.filter(u => u.role === 'ADMIN').length,
    totalUsersChange: 0, // You can calculate this based on historical data
    activeUsersChange: 0,
    pendingInvitesChange: 0,
    adminUsersChange: 0,
  };

  // Filter users based on search
  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Invite user mutation
  const inviteUserMutation = useMutation({
    mutationFn: async (data: { email: string; role: string }) => {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create invitation');
      return response.json();
    },
    onSuccess: async (data) => {
      // Send invitation email
      await fetch('/api/users/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invitationId: data.invitation.id }),
      });
      
      queryClient.invalidateQueries({ queryKey: ['invitations'] });
      setShowInviteModal(false);
      setInviteForm({ email: '', role: 'MEMBER' });
    },
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: async ({ userId, updates }: { userId: string; updates: Partial<User> }) => {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error('Failed to update user');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setShowUserActions(false);
      setSelectedUser(null);
    },
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete user');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setShowUserActions(false);
      setSelectedUser(null);
    },
  });

  const handleInviteUser = (e: React.FormEvent) => {
    e.preventDefault();
    inviteUserMutation.mutate(inviteForm);
  };

  const handleUserAction = (user: User, action: string) => {
    setSelectedUser(user);
    setShowUserActions(true);
  };

  const handleUpdateUser = (updates: Partial<User>) => {
    if (selectedUser) {
      updateUserMutation.mutate({ userId: selectedUser.id, updates });
    }
  };

  const handleDeleteUser = () => {
    if (selectedUser && confirm('Are you sure you want to delete this user?')) {
      deleteUserMutation.mutate(selectedUser.id);
    }
  };

  const getStatusBadge = (status: string) => {
    const classes = {
      ACTIVE: 'badge-success',
      INACTIVE: 'badge-error',
      PENDING: 'badge-warning',
    };
    return <span className={`badge ${classes[status as keyof typeof classes]} text-white`}>{status}</span>;
  };

  const getRoleBadge = (role: string) => {
    const classes = {
      ADMIN: 'badge-primary',
      MEMBER: 'badge-secondary',
      VIEWER: 'badge-accent',
    };
    return <span className={`badge ${classes[role as keyof typeof classes]}`}>{role}</span>;
  };

  return (
    <div>
      <PageHeader
        title="User Management"
        description="Manage users, roles, and permissions across your organization"
        illustration="/images/users-illustration.png"
        actionButton={{
          label: 'Invite User',
          onClick: () => setShowInviteModal(true),
        }}
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white border border-[#e1e1e1] rounded-xl p-6">
          <StatCard
            label="Total Users"
            value={stats.totalUsers}
            change={stats.totalUsersChange}
          />
        </div>
        <div className="bg-white border border-[#e1e1e1] rounded-xl p-6">
          <StatCard
            label="Active Users"
            value={stats.activeUsers}
            change={stats.activeUsersChange}
          />
        </div>
        <div className="bg-white border border-[#e1e1e1] rounded-xl p-6">
          <StatCard
            label="Pending Invites"
            value={stats.pendingInvites}
            change={stats.pendingInvitesChange}
          />
        </div>
        <div className="bg-white border border-[#e1e1e1] rounded-xl p-6">
          <StatCard
            label="Admin Users"
            value={stats.adminUsers}
            change={stats.adminUsersChange}
          />
        </div>
      </div>

      {/* Search */}
      <div className="mb usa-6">
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
            <option>All Users</option>
            <option>Active Only</option>
            <option>Pending Only</option>
          </select>
        </div>

        {usersLoading ? (
          <div className="flex justify-center py-8">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Last Active</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="w-12 h-12 rounded-full bg-base-300 flex items-center justify-center">
                            {user.profileImageUrl ? (
                              <Image
                                src={user.profileImageUrl}
                                alt={user.name || user.email}
                                width={48}
                                height={48}
                                className="rounded-full"
                              />
                            ) : (
                              <span className="text-lg font-bold">
                                {(user.name || user.email).charAt(0).toUpperCase()}
                              </span>
                            )}
                          </div>
                        </div>
                        <div>
                          <p className="font-bold">{user.name || 'No name'}</p>
                          <p className="text-sm text-[#676767]">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td>{getRoleBadge(user.role)}</td>
                    <td>{getStatusBadge(user.status)}</td>
                    <td>{formatRelativeTime(user.lastActive)}</td>
                    <td>{formatDate(user.createdAt)}</td>
                    <td>
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => handleUserAction(user, 'manage')}
                      >
                        <MenuDotsIcon width={4} height={16} color="#1d1d1d" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Invite User Modal */}
      {showInviteModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Invite User</h3>
            <form onSubmit={handleInviteUser}>
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Email Address</span>
                </label>
                <input
                  type="email"
                  placeholder="user@example.com"
                  className="input input-bordered"
                  value={inviteForm.email}
                  onChange={(e) =>
                    setInviteForm({ ...inviteForm, email: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-control mb-6">
                <label className="label">
                  <span className="label-text">Role</span>
                </label>
                <select
                  className="select select-bordered"
                  value={inviteForm.role}
                  onChange={(e) =>
                    setInviteForm({
                      ...inviteForm,
                      role: e.target.value as 'ADMIN' | 'MEMBER' | 'VIEWER',
                    })
                  }
                >
                  <option value="VIEWER">Viewer</option>
                  <option value="MEMBER">Member</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              <div className="modal-action">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setShowInviteModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={inviteUserMutation.isPending}
                >
                  {inviteUserMutation.isPending ? 'Sending...' : 'Send Invitation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Actions Modal */}
      {showUserActions && selectedUser && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">
              Manage User: {selectedUser.name || selectedUser.email}
            </h3>
            
            <div className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Role</span>
                </label>
                <select
                  className="select select-bordered"
                  value={selectedUser.role}
                  onChange={(e) =>
                    handleUpdateUser({ role: e.target.value as 'ADMIN' | 'MEMBER' | 'VIEWER' })
                  }
                >
                  <option value="VIEWER">Viewer</option>
                  <option value="MEMBER">Member</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Status</span>
                </label>
                <select
                  className="select select-bordered"
                  value={selectedUser.status}
                  onChange={(e) =>
                    handleUpdateUser({ status: e.target.value as 'ACTIVE' | 'INACTIVE' | 'PENDING' })
                  }
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                  <option value="PENDING">Pending</option>
                </select>
              </div>
            </div>

            <div className="modal-action">
              <button
                className="btn btn-error"
                onClick={handleDeleteUser}
                disabled={deleteUserMutation.isPending}
              >
                {deleteUserMutation.isPending ? 'Deleting...' : 'Delete User'}
              </button>
              <button
                className="btn btn-ghost"
                onClick={() => setShowUserActions(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
