import { notFound, redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { prisma } from '@/lib/prisma';

export async function generateMetadata({
  params
}: {
  params: Promise<{ subdomain: string }>;
}) {
  const { subdomain } = await params;
  
  const tenant = await prisma.tenant.findUnique({
    where: { subdomain: subdomain }
  });

  if (!tenant) {
    return {
      title: 'Organization Not Found'
    };
  }

  return {
    title: `${tenant.name} - EchoBase`,
    description: `Welcome to ${tenant.name} organization`
  };
}

export default async function SubdomainPage({
  params
}: {
  params: Promise<{ subdomain: string }>;
}) {
  const { subdomain } = await params;
  const session = await getServerSession(authOptions);
  
  // Find the tenant by subdomain
  const tenant = await prisma.tenant.findUnique({
    where: { subdomain: subdomain }
  });

  if (!tenant) {
    notFound();
  }

  // If user is not authenticated, redirect to tenant-specific signin
  if (!session) {
    redirect(`http://${subdomain}.localhost:3000/s/${subdomain}/signin`);
  }

  // Find the user by email
  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  });

  if (!user) {
    redirect(`http://${subdomain}.localhost:3000/s/${subdomain}/signin`);
  }

  // Check if user is a member of this tenant
  const userMembership = await prisma.tenantMember.findUnique({
    where: {
      userId_tenantId: {
        userId: user.id,
        tenantId: tenant.id
      }
    }
  });

  if (!userMembership) {
    // User is not a member of this tenant, redirect to signin
    redirect(`http://${subdomain}.localhost:3000/s/${subdomain}/signin`);
  }

  // User is authenticated and is a member, redirect to dashboard
  redirect(`http://${subdomain}.localhost:3000/dashboard`);
}
