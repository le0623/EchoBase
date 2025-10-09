'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [authMethod, setAuthMethod] = useState<'email' | 'sso'>('email');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

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
        router.push('/dashboard');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
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
          name,
          email,
          password,
        }),
      });

      if (response.ok) {
        // Auto sign in after successful registration
        const result = await signIn('credentials', {
          email,
          password,
          redirect: false,
        });

        if (result?.error) {
          setError('Account created but sign in failed. Please try signing in manually.');
        } else {
          router.push('/setup-tenant');
        }
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

  const handleMicrosoftSignIn = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      await signIn('azure-ad', { callbackUrl: '/dashboard' });
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
          src="/images/sign-hero.png"
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
          <h2 className="text-4xl font-extrabold mb-3">
            {activeTab === 'signin' ? 'Welcome back' : 'Create account'}
          </h2>
          <p className="body-md text-[#676767] mb-6">
            {activeTab === 'signin' 
              ? 'Sign in to your account to continue'
              : 'Create your account to get started'
            }
          </p>

          {/* Auth Method Tabs */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setAuthMethod('email')}
              className={`flex-1 py-3 px-6 rounded-xl font-bold text-base tracking-[-0.13px] ${
                authMethod === 'email'
                  ? 'bg-[#1d1d1d] text-white'
                  : 'bg-white text-[#1d1d1d] border border-[#e1e1e1]'
              }`}
            >
              Email
            </button>
            <button
              onClick={() => setAuthMethod('sso')}
              className={`flex-1 py-3 px-6 rounded-xl font-bold text-base tracking-[-0.13px] ${
                authMethod === 'sso'
                  ? 'bg-[#1d1d1d] text-white'
                  : 'bg-white text-[#1d1d1d] border border-[#e1e1e1]'
              }`}
            >
              SSO
            </button>
          </div>

          {authMethod === 'email' ? (
            <>
              <h3 className="text-2xl font-extrabold mb-2">
                {activeTab === 'signin' ? 'Sign in with email' : 'Sign up with email'}
              </h3>
              <p className="body-md text-[#676767] mb-4">
                {activeTab === 'signin' 
                  ? 'Enter your email and password to continue'
                  : 'Enter your details to create an account'
                }
              </p>

              <form onSubmit={activeTab === 'signin' ? handleEmailSignIn : handleSignUp} className="space-y-4">
                {activeTab === 'signup' && (
                  <div>
                    <label className="block text-base font-medium text-[#676767] mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="input input-bordered w-full"
                      required
                    />
                  </div>
                )}

                <div>
                  <label className="block text-base font-medium text-[#676767] mb-2">
                    Email address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input input-bordered w-full"
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
                      className="input input-bordered w-full pr-12"
                      required
                      minLength={activeTab === 'signup' ? 6 : undefined}
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

                {activeTab === 'signup' && (
                  <div>
                    <label className="block text-base font-medium text-[#676767] mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="input input-bordered w-full pr-12"
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
                )}

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
                  {isLoading 
                    ? (activeTab === 'signin' ? 'Signing in...' : 'Creating account...') 
                    : (activeTab === 'signin' ? 'Sign in' : 'Create account')
                  }
                </button>
              </form>

              <div className="mt-4 text-center">
                <p className="text-lg text-[#676767]">
                  {activeTab === 'signin' ? (
                    <>
                      Don't have an account?{' '}
                      <button 
                        onClick={() => setActiveTab('signup')} 
                        className="text-[#0198ff] font-bold hover:underline"
                      >
                        Sign up
                      </button>
                    </>
                  ) : (
                    <>
                      Already have an account?{' '}
                      <button 
                        onClick={() => setActiveTab('signin')} 
                        className="text-[#0198ff] font-bold hover:underline"
                      >
                        Sign in
                      </button>
                    </>
                  )}
                </p>
              </div>
            </>
          ) : (
            <>
              <h3 className="text-[28px] font-extrabold mb-2">Enterprise SSO</h3>
              <p className="body-md text-[#676767] mb-6">
                Sign in with your organization's identity provider
              </p>

              <button 
                onClick={handleMicrosoftSignIn}
                disabled={isLoading}
                className="w-full bg-white border border-[#e1e1e1] rounded-xl px-6 py-4 flex items-center gap-3 hover:bg-gray-50 disabled:opacity-50"
              >
                <div className="w-9 h-9 bg-[#0198ff] rounded" />
                <span className="text-base font-semibold text-[#676767]">
                  {isLoading ? 'Connecting...' : 'Continue with Microsoft Account'}
                </span>
                <svg width="8" height="14" viewBox="0 0 8 14" fill="none" className="ml-auto">
                  <path d="M1 1L7 7L1 13" stroke="currentColor" strokeWidth="2" />
                </svg>
              </button>

              <div className="mt-6 text-center">
                <p className="text-lg text-[#676767]">
                  Don't see your provider?{' '}
                  <Link href="/contact-admin" className="text-[#0198ff] font-bold">
                    Contact your administrator
                  </Link>
                </p>
              </div>
            </>
          )}

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