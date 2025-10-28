import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';

export default async function RootPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    // User is not signed in, redirect to signin
    redirect('/signin');
  } else {
    // User is signed in, redirect to tenant selection
    redirect('/select-tenant');
  }
}