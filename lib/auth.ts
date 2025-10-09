import { getServerSession } from 'next-auth';
import { authOptions } from './auth-config';
import { prisma } from './prisma';
import { redirect } from 'next/navigation';

export interface CurrentUser {
  id: string;
  email: string;
  name?: string;
  profileImageUrl?: string;
  tenantId?: string;
}

export interface CurrentTenant {
  id: string;
  name: string;
  domain?: string;
  logoUrl?: string;
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name || undefined,
      profileImageUrl: user.profileImageUrl || undefined,
      tenantId: user.tenantId || undefined,
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

export async function getCurrentTenant(user: CurrentUser): Promise<CurrentTenant | null> {
  if (!user.tenantId) {
    return null;
  }

  try {
    const tenant = await prisma.tenant.findUnique({
      where: {
        id: user.tenantId,
      },
    });

    if (!tenant) {
      return null;
    }

    return {
      id: tenant.id,
      name: tenant.name,
      logoUrl: tenant.logoUrl || undefined,
    };
  } catch (error) {
    console.error('Error getting current tenant:', error);
    return null;
  }
}

export async function withTenantGuard<T>(
  handler: (user: CurrentUser, tenant: CurrentTenant) => Promise<T>
): Promise<T | null> {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/signin');
  }

  const tenant = await getCurrentTenant(user);
  if (!tenant) {
    redirect('/signin');
  }

  return handler(user, tenant);
}

export async function requireAuth(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/signin');
  }
  return user;
}

export async function requireTenant(): Promise<{ user: CurrentUser; tenant: CurrentTenant }> {
  const user = await requireAuth();
  const tenant = await getCurrentTenant(user);
  if (!tenant) {
    redirect('/signin');
  }
  return { user, tenant };
}