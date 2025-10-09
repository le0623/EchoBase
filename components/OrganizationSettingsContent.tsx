'use client';

import { useTenantUsers, useCurrentTenant } from '@/lib/hooks/useQueries';
import { AuthenticatedLayout } from './AuthenticatedLayout';

export function OrganizationSettingsContent() {
  const { data: tenant, isLoading: tenantLoading, isError: tenantError } = useCurrentTenant();
  const { data: tenantUsers, isLoading: usersLoading, isError: usersError } = useTenantUsers();

  if (tenantLoading || usersLoading) {
    return (
      <AuthenticatedLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="loading loading-spinner loading-lg text-primary"></div>
        </div>
      </AuthenticatedLayout>
    );
  }

  if (tenantError || usersError) {
    return (
      <AuthenticatedLayout>
        <div className="alert alert-error">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <h3 className="font-bold">Error loading organization data</h3>
            <div className="text-xs">Please try refreshing the page</div>
          </div>
        </div>
      </AuthenticatedLayout>
    );
  }

  if (!tenant) {
    return (
      <AuthenticatedLayout>
        <div className="alert alert-warning">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          <span>No organization data available</span>
        </div>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        {/* Organization Info */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Organization Information</h2>
            
            <div className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Organization Name</span>
                </label>
                <input
                  type="text"
                  value={tenant.name}
                  className="input input-bordered"
                  disabled
                />
                <label className="label">
                  <span className="label-text-alt">
                    Organization name is managed by WorkOS
                  </span>
                </label>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Domain</span>
                </label>
                <input
                  type="text"
                  value={tenant.domain || 'No domain set'}
                  className="input input-bordered"
                  disabled
                />
                <label className="label">
                  <span className="label-text-alt">
                    Domain is managed by WorkOS
                  </span>
                </label>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">WorkOS Organization ID</span>
                </label>
                <input
                  type="text"
                  value={tenant.workosOrgId}
                  className="input input-bordered font-mono text-sm"
                  disabled
                />
                <label className="label">
                  <span className="label-text-alt">
                    Internal identifier from WorkOS
                  </span>
                </label>
              </div>
            </div>

            <div className="alert alert-info">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="stroke-current shrink-0 w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <span>
                Organization settings are managed by WorkOS. To update organization
                information, please use your WorkOS dashboard or contact your administrator.
              </span>
            </div>
          </div>
        </div>

        {/* Team Members */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Team Members</h2>
            <p className="text-base-content/70">
              {tenantUsers?.length || 0} member{(tenantUsers?.length || 0) !== 1 ? 's' : ''} in your organization
            </p>
            
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Joined</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {tenantUsers?.map((member) => (
                    <tr key={member.id}>
                      <td>
                        <div className="flex items-center gap-3">
                          {member.profileImageUrl ? (
                            <div className="avatar">
                              <div className="mask mask-squircle w-8 h-8">
                                <img
                                  src={member.profileImageUrl}
                                  alt={`${member.firstName || ''} ${member.lastName || ''}`.trim() || member.email}
                                />
                              </div>
                            </div>
                          ) : (
                            <div className="avatar placeholder">
                              <div className="bg-primary text-primary-content mask mask-squircle w-8 h-8">
                                <span className="text-xs">
                                  {(member.firstName || member.email).charAt(0).toUpperCase()}
                                </span>
                              </div>
                            </div>
                          )}
                          <div>
                            <div className="font-bold">
                              {member.firstName && member.lastName
                                ? `${member.firstName} ${member.lastName}`
                                : member.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>{member.email}</td>
                      <td>
                        {new Date(member.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <div className="badge badge-success">Active</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
