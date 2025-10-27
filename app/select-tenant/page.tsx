'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';

type Tenant = {
  id: string;
  name: string;
  subdomain: string | null;
  role: string;
  isOwner: boolean;
};

export default function SelectTenantPage() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user?.email) {
      fetchTenants();
    }
  }, [session]);

  const fetchTenants = async () => {
    try {
      const response = await fetch('/api/user/tenants');
      if (response.ok) {
        const data = await response.json();
        setTenants(data.tenants || []);
      } else {
        setError('Failed to load tenants');
      }
    } catch (error) {
      setError('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectTenant = (tenantId: string, subdomain: string | null) => {
    if (subdomain) {
      // Redirect to tenant subdomain
      window.location.href = `http://${subdomain}.localhost:3000`;
    } else {
      // Redirect to dashboard with tenant ID
      router.push(`/dashboard?tenant=${tenantId}`);
    }
  };

  const hasNoTenants = !isLoading && tenants.length === 0;
  const hasOwnOrganization = tenants.some(tenant => tenant.isOwner);
  const hasInvitedOrganizations = tenants.some(tenant => !tenant.isOwner);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Hero Image */}
      <div className="hidden lg:flex lg:w-1/2 p-12 flex-col justify-center bg-white">
        <Image
          src="/images/sign-hero.png"
          alt="Select Tenant"
          width={916}
          height={909}
          className="w-full h-full object-contain"
          priority
          quality={100}
        />
      </div>

      {/* Right Side - Tenant Selection */}
      <div className="w-full lg:w-1/2 bg-white flex flex-col justify-center min-h-screen max-h-screen overflow-y-auto">
        <div className="flex flex-col items-center w-full p-8 lg:p-12">
          <h2 className="text-4xl font-extrabold mb-3">Select Organization</h2>
          <p className="body-md text-[#676767] mb-6">
            {hasNoTenants 
              ? 'Create your organization to get started' 
              : hasInvitedOrganizations && !hasOwnOrganization
              ? 'Choose an organization to enter or create your own'
              : 'Choose which organization to enter'}
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg w-full max-w-md">
              <span>{error}</span>
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center">
              <div className="w-8 h-8 border-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
            </div>
          ) : hasNoTenants ? (
            <div className="w-full max-w-md space-y-4">
              <p className="text-center text-gray-600">
                You don't have any organizations yet.
              </p>
              <Link href="/setup-tenant">
                <button className="w-full bg-[#1d1d1d] text-white py-4 rounded-lg font-semibold text-lg hover:bg-[#2d2d2d] transition-colors">
                  Create Your Organization
                </button>
              </Link>
            </div>
          ) : (
            <div className="w-full max-w-md space-y-4">
              <div className="space-y-3">
                {tenants.map((tenant) => (
                  <button
                    key={tenant.id}
                    onClick={() => handleSelectTenant(tenant.id, tenant.subdomain)}
                    className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-all text-left"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-lg">{tenant.name}</div>
                        <div className="text-sm text-gray-500">
                          {tenant.isOwner ? 'Owner' : tenant.role}
                        </div>
                      </div>
                      <div className="text-primary">→</div>
                    </div>
                  </button>
                ))}
              </div>

              {!hasOwnOrganization && (
                <div className="pt-4 border-t">
                  <Link href="/setup-tenant">
                    <button className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                      {hasInvitedOrganizations ? '+ Create Your Organization' : '+ Create New Organization'}
                    </button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

