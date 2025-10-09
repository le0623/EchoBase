'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function SetupTenantPage() {
  const [tenantName, setTenantName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { data: session } = useSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!tenantName.trim()) {
      setError('Tenant name is required');
      setIsLoading(false);
      return;
    }

    if (tenantName.length < 3) {
      setError('Tenant name must be at least 3 characters');
      setIsLoading(false);
      return;
    }

    // Check for valid characters (alphanumeric and hyphens only)
    if (!/^[a-zA-Z0-9-]+$/.test(tenantName)) {
      setError('Tenant name can only contain letters, numbers, and hyphens');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/tenant/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: tenantName.trim(),
        }),
      });

      if (response.ok) {
        // Redirect to dashboard
        window.location.href = '/dashboard';
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to create tenant');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Hero Image */}
      <div className="hidden lg:flex lg:w-1/2 p-12 flex-col justify-center bg-white">
        <Image
          src="/images/sign-hero.png"
          alt="Setup Tenant"
          width={916}
          height={909}
          className="w-full h-full object-contain"
          priority
          quality={100}
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>

      {/* Right Side - Tenant Setup Form */}
      <div className="w-full lg:w-1/2 bg-white flex flex-col justify-center min-h-[50vh] lg:min-h-screen max-h-screen overflow-y-auto">
        <div className="flex flex-col items-center w-full p-8 lg:p-12">
          <h2 className="text-4xl font-extrabold mb-3">Setup Your Organization</h2>
          <p className="body-md text-[#676767] mb-6">
            Create your organization workspace to get started with Echobase
          </p>

          <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
            <div>
              <label className="block text-base font-medium text-[#676767] mb-2">
                Organization Name
              </label>
              <input
                type="text"
                value={tenantName}
                onChange={(e) => setTenantName(e.target.value)}
                className="input input-bordered w-full"
                placeholder="e.g., my-company"
                required
                minLength={3}
                pattern="[a-zA-Z0-9-]+"
              />
              <p className="text-sm text-gray-500 mt-1">
                This will be your organization's unique identifier. Only letters, numbers, and hyphens are allowed.
              </p>
            </div>


            {error && (
              <div className="alert alert-error">
                <span>{error}</span>
              </div>
            )}

            <button 
              type="submit" 
              className="btn btn-primary w-full text-lg"
              disabled={isLoading || !tenantName.trim()}
            >
              {isLoading ? 'Creating Organization...' : 'Create Organization'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-[#676767]">
              You can change your organization settings later in the dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
