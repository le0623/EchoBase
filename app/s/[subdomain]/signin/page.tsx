'use client';

import { useState } from 'react';
import Image from 'next/image';
import { signIn, useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { useEffect } from 'react';
import { rootDomain } from '@/lib/utils';

export default function TenantSignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const params = useParams();
  const subdomain = params?.subdomain as string;
  const { data: session } = useSession();

  // If already signed in, redirect to dashboard
  useEffect(() => {
    if (session) {
      router.push(`/dashboard`);
    }
  }, [session, router]);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
      } else {
        // After successful sign in, redirect to dashboard
        router.push(`/dashboard`);
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMicrosoftSignIn = async () => {
    setIsLoading(true);
    setError('');

    try {
      await signIn('azure-ad', {
        callbackUrl: `http://${subdomain}.${rootDomain}/dashboard`
      });
    } catch (error) {
      setError('An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Hero Image */}
      <div className="hidden lg:flex lg:w-1/2 p-12 flex-col justify-center bg-white">
        <Image
          src="/images/bot.png"
          alt="Sign In Hero"
          width={916}
          height={909}
          className="w-full h-full object-contain"
          priority
          quality={100}
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>

      {/* Right Side - Sign In Form */}
      <div className="w-full lg:w-1/2 bg-white flex flex-col justify-center min-h-[50vh] lg:min-h-screen max-h-screen overflow-y-auto">
        <div className="flex flex-col items-center w-full p-8 lg:p-12">
          <h2 className="text-4xl font-extrabold mb-3">Welcome back</h2>
          <p className="body-md text-[#676767] mb-6">
            Sign in to access this organization
          </p>

          {/* Auth Method Tabs */}
          <div className="flex gap-4 mb-6">
            <button
              className="flex-1 py-3 px-6 rounded-xl font-bold text-base tracking-[-0.13px] bg-[#1d1d1d] text-white"
            >
              Email
            </button>
            <button
              onClick={() => setError('SSO sign in is being configured')}
              className="flex-1 py-3 px-6 rounded-xl font-bold text-base tracking-[-0.13px] bg-white text-[#1d1d1d] border border-[#e1e1e1]"
            >
              SSO
            </button>
          </div>

          <h3 className="text-2xl font-extrabold mb-2">Sign in with email</h3>
          <p className="body-md text-[#676767] mb-4">
            Enter your email and password to continue
          </p>

          <form onSubmit={handleEmailSignIn} className="space-y-4 w-full max-w-md">
            <div>
              <label className="block text-base font-medium text-[#676767] mb-2">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-base font-medium text-[#676767] mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                  👁️
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[#1d1d1d] text-white py-4 rounded-lg font-semibold text-lg hover:bg-[#2d2d2d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading || !email || !password}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="mt-8 text-center text-lg font-bold text-[#0198ff]">
            <a href="/privacy">Privacy Policy</a>
            {' | '}
            <a href="/terms">Terms of Service</a>
            {' | '}
            <a href="/support">Support</a>
          </div>
        </div>
      </div>
    </div>
  );
}

