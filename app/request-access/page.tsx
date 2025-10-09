'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RequestAccessPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (response.ok) {
        setSuccess(true);
      } else {
        const data = await response.json();
        setError(data.error || 'Registration failed');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f5f5f5] via-[#e8e8f8] to-[#d8d8f8]">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">Account Created!</h2>
            <p className="text-gray-600 mb-6">
              Your account has been created successfully. You can now sign in.
            </p>
            <Link href="/signin" className="btn btn-primary">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Illustration */}
      <div className="flex-1 bg-gradient-to-br from-[#f5f5f5] via-[#e8e8f8] to-[#d8d8f8] p-12 flex items-center justify-center relative overflow-hidden">
        <div className="max-w-2xl">
          <div className="bg-white rounded-2xl p-6 mb-8 inline-block">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-[#0198ff] rounded" />
              <div>
                <p className="font-bold text-sm">Analytics</p>
                <p className="text-xs text-[#676767]">Detailed usage analytics and insights</p>
              </div>
            </div>
          </div>

          <Image
            src="/images/robot-illustration.png"
            alt="AI Robot"
            width={400}
            height={400}
            className="mb-8"
          />

          <h1 className="heading-xl mb-4">
            Transform Your Documents Into Intelligent <span className="text-[#0198ff]">Knowledge</span>
          </h1>
          <p className="body-lg text-[#676767]">
            Upload, process, and search through your organization's documents with AI-powered intelligence. Get instant answers from your knowledge base.
          </p>
        </div>
      </div>

      {/* Right Side - Registration Form */}
      <div className="w-[600px] bg-white p-12 flex flex-col justify-center">
        <div className="max-w-md mx-auto w-full">
          <h2 className="text-5xl font-extrabold mb-4">Request Access</h2>
          <p className="body-md text-[#676767] mb-8">
            Create your account to get started with Echobase
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-base font-medium text-[#676767] mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input input-bordered w-full"
                required
              />
            </div>

            <div>
              <label className="block text-base font-medium text-[#676767] mb-2">
                Email address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input input-bordered w-full"
                required
              />
            </div>

            <div>
              <label className="block text-base font-medium text-[#676767] mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input input-bordered w-full"
                required
                minLength={6}
              />
            </div>

            <div>
              <label className="block text-base font-medium text-[#676767] mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="input input-bordered w-full"
                required
              />
            </div>

            {error && (
              <div className="alert alert-error">
                <span>{error}</span>
              </div>
            )}

            <button 
              type="submit" 
              className="btn btn-primary w-full text-lg"
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-lg text-[#676767]">
              Already have an account?{' '}
              <Link href="/signin" className="text-[#0198ff] font-bold">
                Sign In
              </Link>
            </p>
          </div>

          <div className="mt-8 text-center text-lg font-bold text-[#0198ff]">
            <Link href="/privacy">Privacy Policy</Link>
            {' | '}
            <Link href="/terms">Terms of Service</Link>
            {' | '}
            <Link href="/support">Support</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

