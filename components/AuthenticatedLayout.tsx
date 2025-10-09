import { ReactNode } from 'react';
import { AuthenticatedLayoutClient } from './AuthenticatedLayoutClient';

interface AuthenticatedLayoutProps {
  children: ReactNode;
}

export function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  return (
    <AuthenticatedLayoutClient>
      {children}
    </AuthenticatedLayoutClient>
  );
}
