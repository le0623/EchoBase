'use client';

import { useAuthData } from '@/lib/hooks/useQueries';
import { AuthenticatedLayout } from './AuthenticatedLayout';

export function ProfileSettingsContent() {
  const { user, tenant, isLoading, isError } = useAuthData();

  if (isLoading) {
    return (
      <AuthenticatedLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="loading loading-spinner loading-lg text-primary"></div>
        </div>
      </AuthenticatedLayout>
    );
  }

  if (isError || !user || !tenant) {
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
            <h3 className="font-bold">Error loading profile data</h3>
            <div className="text-xs">Please try refreshing the page</div>
          </div>
        </div>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout>
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Profile Settings</h2>
          
          <div className="space-y-6">
            {/* User Info Display */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                value={user.email}
                className="input input-bordered"
                disabled
              />
              <label className="label">
                <span className="label-text-alt">
                  Email is managed by WorkOS and cannot be changed here
                </span>
              </label>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">First Name</span>
              </label>
              <input
                type="text"
                value={user.firstName || ''}
                className="input input-bordered"
                disabled
              />
              <label className="label">
                <span className="label-text-alt">
                  Name is managed by WorkOS and cannot be changed here
                </span>
              </label>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Last Name</span>
              </label>
              <input
                type="text"
                value={user.lastName || ''}
                className="input input-bordered"
                disabled
              />
              <label className="label">
                <span className="label-text-alt">
                  Name is managed by WorkOS and cannot be changed here
                </span>
              </label>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Organization</span>
              </label>
              <input
                type="text"
                value={tenant.name}
                className="input input-bordered"
                disabled
              />
              <label className="label">
                <span className="label-text-alt">
                  Organization settings can be managed in Organization settings
                </span>
              </label>
            </div>

            <div className="alert alert-info">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="stroke-current shrink-0 w-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <span>
                Profile information is managed by WorkOS. To update your profile,
                please contact your organization administrator or use your SSO provider.
              </span>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
