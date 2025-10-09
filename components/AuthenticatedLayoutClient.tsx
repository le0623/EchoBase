'use client';

import { ReactNode } from 'react';
import { useAuthData } from '@/lib/hooks/useQueries';
import Navbar from './Navbar';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';

interface AuthenticatedLayoutClientProps {
  children: ReactNode;
}

export function AuthenticatedLayoutClient({ children }: AuthenticatedLayoutClientProps) {
  const { user, tenant, isLoading, isError } = useAuthData();

  useEffect(() => {
    if (isError) {
      redirect('/signin');
    }
  }, [isError]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="loading loading-spinner loading-lg text-primary"></div>
      </div>
    );
  }

  if (!user || !tenant) {
    redirect('/signin');
    return null;
  }

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
