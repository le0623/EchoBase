'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

interface InvitationData {
  id: string;
  email: string;
  role: string;
  expiresAt: string;
  tenant: {
    id: string;
    name: string;
    logoUrl?: string;
  };
}

export default function AcceptInvitationPage() {
  const [invitation, setInvitation] = useState<InvitationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accepting, setAccepting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    password: '',
    confirmPassword: '',
  });

  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setError('Invalid invitation link');
      setLoading(false);
      return;
    }

    fetchInvitation();
  }, [token]);

  const fetchInvitation = async () => {
    try {
      const response = await fetch(`/api/invitations/${token}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to load invitation');
        return;
      }

      setInvitation(data.invitation);
    } catch (error) {
      setError('Failed to load invitation');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) return;

    // Validate form
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setAccepting(true);
    setError(null);

    try {
      const response = await fetch('/api/invitations/accept', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          name: formData.name,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to accept invitation');
        return;
      }

      // Redirect to sign in page
      router.push('/signin?message=Account created successfully. Please sign in.');
    } catch (error) {
      setError('Failed to accept invitation');
    } finally {
      setAccepting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card w-96 bg-base-100 shadow-xl">
          <div className="card-body text-center">
            <h2 className="card-title text-error">Error</h2>
            <p className="text-error">{error}</p>
            <div className="card-actions justify-center">
              <button
                className="btn btn-primary"
                onClick={() => router.push('/signin')}
              >
                Go to Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!invitation) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="text-center mb-6">
            {invitation.tenant.logoUrl && (
              <img
                src={invitation.tenant.logoUrl}
                alt={invitation.tenant.name}
                className="w-16 h-16 mx-auto mb-4 rounded-full"
              />
            )}
            <h1 className="text-2xl font-bold">Join {invitation.tenant.name}</h1>
            <p className="text-base-content/70">
              You've been invited as a <strong>{invitation.role}</strong>
            </p>
            <p className="text-sm text-base-content/50 mt-2">
              {invitation.email}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                className="input input-bordered"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                className="input input-bordered"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
                minLength={8}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Confirm Password</span>
              </label>
              <input
                type="password"
                placeholder="Confirm your password"
                className="input input-bordered"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                required
                minLength={8}
              />
            </div>

            {error && (
              <div className="alert alert-error">
                <span>{error}</span>
              </div>
            )}

            <div className="card-actions justify-center">
              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={accepting}
              >
                {accepting ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Creating Account...
                  </>
                ) : (
                  'Accept Invitation'
                )}
              </button>
            </div>
          </form>

          <div className="text-center mt-4">
            <p className="text-xs text-base-content/50">
              This invitation expires on{' '}
              {new Date(invitation.expiresAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
