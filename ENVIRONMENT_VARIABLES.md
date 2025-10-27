# Environment Variables Configuration

## Required Environment Variables

### Database
```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/echobase?schema=public"
```

### NextAuth.js
```bash
NEXTAUTH_SECRET="your_nextauth_secret_here"
NEXTAUTH_URL="http://localhost:3000"
```

## Microsoft Azure AD (Optional)
```bash
AZURE_AD_CLIENT_ID="your_azure_ad_client_id"
AZURE_AD_CLIENT_SECRET="your_azure_ad_client_secret"
AZURE_AD_TENANT_ID="your_azure_ad_tenant_id"
```

## Email Configuration (Required for user invitations)
```bash
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
SMTP_FROM="Your App Name <noreply@yourapp.com>"
```

## AWS S3 Configuration (Required for document storage)
```bash
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="your-aws-access-key-id"
AWS_SECRET_ACCESS_KEY="your-aws-secret-access-key"
AWS_S3_BUCKET_NAME="your-s3-bucket-name"
```

## Environment
```bash
NODE_ENV="development"
```

## How It Works

1. **Multi-tenancy**: Users belong to organizations (tenants) but all access the same domain
2. **Tenant Isolation**: Data is isolated by tenant ID in the database
3. **Simple Setup**: No subdomain complexity - just regular domain access
4. **User Experience**: Users create their organization during signup, then access the dashboard normally

## Setup Instructions

1. Copy the environment variables to your `.env` file
2. Start your application
3. Users will create their organization during the signup process
4. All users access the same domain with tenant-based data isolation
