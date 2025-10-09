# EchoBase Setup Guide

This is a multi-tenant application built with Next.js, WorkOS AuthKit, Prisma, and DaisyUI.

## Prerequisites

- Node.js 18+ 
- PostgreSQL database
- WorkOS account

## 1. Install Dependencies

```bash
npm install
```

## 2. Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/echobase"

# WorkOS Configuration
WORKOS_API_KEY="sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
WORKOS_CLIENT_ID="client_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
WORKOS_REDIRECT_URI="http://localhost:3000/api/auth/callback"
WORKOS_COOKIE_PASSWORD="your-32-character-secret-key-here"

# Next.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-key-here"
```

### Getting WorkOS Credentials

1. Sign up for a [WorkOS account](https://workos.com)
2. Create a new project in your WorkOS dashboard
3. Copy the API Key and Client ID from your project settings
4. Set up your redirect URI to match your local development URL

## 3. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma db push

# (Optional) Open Prisma Studio to view your data
npx prisma studio
```

## 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Features

### 🔐 Authentication
- **WorkOS AuthKit Integration**: Enterprise-grade authentication
- **SSO Support**: Google, Microsoft, Okta, and other providers
- **Magic Links**: Passwordless authentication
- **Session Management**: Secure cookie-based sessions

### 🏢 Multi-Tenant Architecture
- **Tenant Isolation**: Complete data separation between organizations
- **User Management**: Users are scoped to their organization
- **Tenant Guards**: Helper functions for data isolation

### 🎨 Modern UI
- **DaisyUI Components**: Beautiful, accessible components
- **Tailwind CSS**: Utility-first styling
- **Responsive Design**: Mobile-first approach

### 🛡️ Security
- **Route Protection**: Middleware-based authentication
- **Data Isolation**: Tenant-scoped database queries
- **Session Validation**: Server-side session verification

## Project Structure

```
echobase/
├── app/                    # Next.js app directory
│   ├── api/auth/          # Authentication routes
│   ├── dashboard/         # Protected dashboard
│   ├── settings/          # User and org settings
│   └── signin/            # Sign-in page
├── components/            # Reusable components
│   ├── AuthenticatedLayout.tsx
│   └── Navbar.tsx
├── lib/                   # Utility libraries
│   ├── auth.ts           # Authentication helpers
│   ├── prisma.ts         # Database client
│   └── workos.ts         # WorkOS configuration
├── prisma/               # Database schema
│   └── schema.prisma
└── middleware.ts         # Route protection
```

## Key Components

### Authentication Helpers

- `getCurrentUser()`: Get the current authenticated user
- `getCurrentTenant()`: Get the current user's organization
- `requireAuth()`: Require authentication (redirects if not authenticated)
- `requireTenant()`: Require both user and tenant (redirects if missing)
- `withTenantGuard()`: Higher-order function for tenant-scoped operations

### Database Models

- **User**: Linked to WorkOS user with tenant relationship
- **Tenant**: Represents an organization with WorkOS organization ID

### Protected Routes

- `/dashboard`: Main application dashboard
- `/settings/profile`: User profile settings
- `/settings/organization`: Organization settings and team members

## Development

### Adding New Protected Routes

1. Create your page component in the `app/` directory
2. Use `AuthenticatedLayout` for consistent UI
3. Use `requireTenant()` to ensure authentication and tenant access

Example:
```tsx
import { requireTenant } from '@/lib/auth';
import { AuthenticatedLayout } from '@/components/AuthenticatedLayout';

export default async function MyPage() {
  const { user, tenant } = await requireTenant();
  
  return (
    <AuthenticatedLayout>
      <h1>Hello {user.firstName}!</h1>
    </AuthenticatedLayout>
  );
}
```

### Adding Database Models

1. Update `prisma/schema.prisma`
2. Run `npx prisma db push` to apply changes
3. Update TypeScript types with `npx prisma generate`

## Deployment

1. Set up your production database
2. Configure environment variables in your hosting platform
3. Run database migrations: `npx prisma db push`
4. Deploy your application

## Troubleshooting

### Common Issues

1. **Database Connection**: Ensure your `DATABASE_URL` is correct and the database is accessible
2. **WorkOS Configuration**: Verify your WorkOS credentials and redirect URI
3. **Session Issues**: Check that `WORKOS_COOKIE_PASSWORD` is set and consistent

### Getting Help

- Check the [WorkOS documentation](https://workos.com/docs)
- Review the [Next.js documentation](https://nextjs.org/docs)
- Check the [Prisma documentation](https://www.prisma.io/docs)
