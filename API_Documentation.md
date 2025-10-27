# EchoBase API Documentation

## Overview
EchoBase is a multi-tenant document management system with user authentication, role-based access control, and document approval workflows.

## Postman Collection Setup

### Files Included
1. `EchoBase_API_Collection.postman_collection.json` - Complete API collection
2. `EchoBase_Environment.postman_environment.json` - Environment variables
3. `API_Documentation.md` - This documentation file

### Import Instructions

1. **Import Collection:**
   - Open Postman
   - Click "Import" button
   - Select `EchoBase_API_Collection.postman_collection.json`
   - Click "Import"

2. **Import Environment:**
   - Click "Import" button
   - Select `EchoBase_Environment.postman_environment.json`
   - Click "Import"
   - Select the "EchoBase Environment" from the environment dropdown

3. **Configure Environment:**
   - Update `baseUrl` if your server runs on a different port
   - Set `authToken` after successful authentication

## API Endpoints Overview

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/signin` - Login (NextAuth)
- `POST /api/auth/signout` - Logout (NextAuth)

### Tenant Management
- `POST /api/tenant/create` - Create organization/tenant

### User Management
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:userId` - Get specific user (Admin only)
- `PUT /api/users/:userId` - Update user (Admin only)
- `DELETE /api/users/:userId` - Delete user (Admin only)
- `POST /api/users` - Create user invitation (Admin only)
- `GET /api/users/invitations` - Get user invitations (Admin only)
- `POST /api/users/invite` - Send invitation email (Admin only)

### Invitation Management
- `GET /api/invitations/:token` - Get invitation details (Public)
- `POST /api/invitations/accept` - Accept invitation

### Document Management
- `GET /api/documents` - Get all documents (with filtering & pagination)
- `GET /api/documents/:documentId` - Get specific document
- `PUT /api/documents/:documentId` - Update document metadata
- `DELETE /api/documents/:documentId` - Delete document
- `POST /api/documents/upload` - Upload new document
- `POST /api/documents/:documentId/approve` - Approve document (Admin only)
- `POST /api/documents/:documentId/reject` - Reject document (Admin only)

## Authentication Flow

1. **Register User:**
   ```
   POST /api/auth/register
   {
     "name": "John Doe",
     "email": "john@example.com",
     "password": "password123"
   }
   ```

2. **Create Organization:**
   ```
   POST /api/tenant/create
   {
     "name": "my-organization"
   }
   ```

3. **Login via NextAuth:**
   - Use the NextAuth endpoints for authentication
   - The system uses session-based authentication

## User Roles

- **ADMIN**: Full access to all features
- **MEMBER**: Can upload documents and manage their own documents
- **VIEWER**: Read-only access

## Document Workflow

1. **Upload Document:**
   - Members and Admins can upload documents
   - Documents start with `PENDING` status
   - File size limit: 10MB
   - Supported formats: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, CSV, images

2. **Document Approval:**
   - Only Admins can approve/reject documents
   - Documents can be approved or rejected with reasons
   - Status changes: `PENDING` → `APPROVED` or `REJECTED`

## Query Parameters

### Documents Endpoint
- `status`: Filter by status (PENDING, APPROVED, REJECTED)
- `search`: Search in name, description, tags, or submitter
- `page`: Page number for pagination
- `limit`: Items per page (default: 20)

## Error Responses

All endpoints return consistent error responses:
```json
{
  "error": "Error message description"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Environment Variables

The Postman environment includes:
- `baseUrl`: API base URL (default: http://localhost:3000)
- `authToken`: Authentication token (set after login)
- `userId`: User ID for testing
- `documentId`: Document ID for testing
- `invitationToken`: Invitation token for testing

## Testing Workflow

1. Start with user registration
2. Create an organization
3. Login and get authentication token
4. Test user management (as admin)
5. Test document upload and management
6. Test invitation flow

## File Upload

For document upload, use form-data with:
- `file`: The actual file
- `name`: Document name
- `description`: Document description (optional)
- `tags`: Comma-separated tags (optional)

## Multi-tenancy

All endpoints are tenant-aware. Users can only access resources within their tenant/organization.
