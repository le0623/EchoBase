import { getServerSession } from 'next-auth';
import { authOptions } from './auth-config';
import { prisma } from './prisma';
import { redirect } from 'next/navigation';

export interface CurrentUser {
  id: string;
  email: string;
  name?: string;
  profileImageUrl?: string;
  status?: string;
}

export interface CurrentTenant {
  id: string;
  name: string;
  subdomain: string;
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
      status: user.status || undefined,
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

export async function getCurrentTenant(subdomain?: string): Promise<CurrentTenant | null> {
  try {
    // If subdomain is provided, find tenant by subdomain
    if (subdomain) {
      const tenant = await prisma.tenant.findUnique({
        where: {
          subdomain: subdomain,
        },
      });

      if (!tenant) {
        return null;
      }

      return {
        id: tenant.id,
        name: tenant.name,
        subdomain: tenant.subdomain,
        logoUrl: tenant.logoUrl || undefined,
      };
    }

    // If no subdomain, return null (user needs to select a tenant)
    return null;
  } catch (error) {
    console.error('Error getting current tenant:', error);
    return null;
  }
}

export async function withTenantGuard<T>(
  handler: (user: CurrentUser, tenant: CurrentTenant) => Promise<T>,
  subdomain?: string
): Promise<T | null> {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/signin');
  }

  const tenant = await getCurrentTenant(subdomain);
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

export async function requireTenant(subdomain?: string): Promise<{ user: CurrentUser; tenant: CurrentTenant }> {
  const user = await requireAuth();
  const tenant = await getCurrentTenant(subdomain);
  if (!tenant) {
    redirect('/signin');
  }
  
  // Check if user has access to this tenant
  const hasAccess = await checkUserTenantAccess(user.id, tenant.id);
  if (!hasAccess) {
    redirect('/signin');
  }
  
  return { user, tenant };
}

export async function checkUserTenantAccess(userId: string, tenantId: string): Promise<boolean> {
  try {
    const membership = await prisma.tenantMember.findFirst({
      where: {
        userId: userId,
        tenantId: tenantId,
      },
    });
    
    return !!membership;
  } catch (error) {
    console.error('Error checking user tenant access:', error);
    return false;
  }
}