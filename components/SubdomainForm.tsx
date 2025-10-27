'use client';

import { useState } from 'react';

type CreateState = {
  error?: string;
  success?: boolean;
  tenantName?: string;
};

export function SubdomainForm() {
  const [tenantName, setTenantName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!tenantName.trim()) {
      setError('Organization name is required');
      setIsLoading(false);
      return;
    }

    if (tenantName.length < 3) {
      setError('Organization name must be at least 3 characters');
      setIsLoading(false);
      return;
    }

    // Check for valid characters (alphanumeric and hyphens only)
    if (!/^[a-zA-Z0-9-]+$/.test(tenantName)) {
      setError('Organization name can only contain letters, numbers, and hyphens');
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
        // Redirect to tenant selection to show the new tenant
        window.location.href = '/select-tenant';
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to create organization');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
      <div>
        <label className="block text-base font-medium text-[#676767] mb-2">
          Organization Name
        </label>
        <input
          type="text"
          value={tenantName}
          onChange={(e) => setTenantName(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
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
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <span>{error}</span>
        </div>
      )}

      <button 
        type="submit" 
          className="w-full bg-[#1d1d1d] text-white py-4 rounded-lg font-semibold text-lg hover:bg-[#2d2d2d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isLoading || !tenantName.trim()}
      >
        {isLoading ? 'Creating Organization...' : 'Create Organization'}
      </button>
    </form>
  );
}
