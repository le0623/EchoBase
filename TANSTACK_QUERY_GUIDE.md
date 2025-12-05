# TanStack Query Integration Guide

This guide explains how TanStack Query (React Query) is integrated into the EnduroShield Hub application for state management and data fetching.

## 🚀 Features Implemented

### ✅ Query Management
- **Automatic Caching**: Intelligent caching with configurable stale times
- **Background Refetching**: Automatic data synchronization
- **Error Handling**: Robust error handling with retry logic
- **Loading States**: Built-in loading and error states
- **DevTools Integration**: React Query DevTools for debugging

### ✅ Custom Hooks
- **Data Fetching**: Custom hooks for all major data operations
- **Mutations**: Mutation hooks for data updates
- **Utilities**: Helper hooks for common patterns
- **Query Invalidation**: Smart cache invalidation strategies

## 📁 File Structure

```
lib/
├── query-client.ts           # QueryClient configuration
├── api.ts                    # API client functions
└── hooks/
    ├── useQueries.ts         # Query hooks for data fetching
    ├── useMutations.ts       # Mutation hooks for data updates
    └── useQueryUtils.ts      # Utility functions for query management

components/
├── Providers.tsx             # QueryClient provider wrapper
├── AuthenticatedLayoutClient.tsx  # Client-side layout with queries
├── DashboardContent.tsx      # Dashboard with TanStack Query
├── OrganizationSettingsContent.tsx  # Settings with queries
└── ProfileSettingsContent.tsx      # Profile with queries
```

## 🔧 Configuration

### QueryClient Setup
```typescript
// lib/query-client.ts
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30,   // 30 minutes
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error instanceof Error && 'status' in error && typeof error.status === 'number') {
          if (error.status >= 400 && error.status < 500) {
            return false;
          }
        }
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
    },
  },
});
```

### Provider Setup
```typescript
// components/Providers.tsx
export function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

## 🎣 Available Query Hooks

### Data Fetching Hooks
```typescript
// Get current authenticated user
const { data: user, isLoading, isError } = useCurrentUser();

// Get current tenant/organization
const { data: tenant, isLoading, isError } = useCurrentTenant();

// Get all users in current tenant
const { data: users, isLoading, isError } = useTenantUsers();

// Get user statistics
const { data: stats, isLoading, isError } = useUserStats();

// Get complete dashboard data
const { data: dashboardData, isLoading, isError } = useDashboardData();

// Combined auth data (user + tenant)
const { user, tenant, isLoading, isError, refetch } = useAuthData();
```

### Mutation Hooks
```typescript
// Refresh user statistics
const refreshStats = useRefreshUserStats();
refreshStats.mutate();

// Refresh tenant users
const refreshUsers = useRefreshTenantUsers();
refreshUsers.mutate();

// Refresh all data
const refreshAll = useRefreshData();
refreshAll.mutate();

// Optimistic updates
const optimisticUpdate = useOptimisticUpdate();
optimisticUpdate.mutate(newData);
```

### Utility Hooks
```typescript
// Query utilities
const {
  invalidateAll,
  invalidateUser,
  invalidateTenant,
  invalidateTenantUsers,
  invalidateDashboard,
  refetchAll,
  setQueryData,
  getQueryData,
  removeQueries,
  prefetchQuery,
} = useQueryUtils();
```

## 🎯 Query Keys

All query keys are centralized for consistency:

```typescript
export const queryKeys = {
  currentUser: ['currentUser'] as const,
  currentTenant: ['currentTenant'] as const,
  tenantUsers: ['tenantUsers'] as const,
  userStats: ['userStats'] as const,
  dashboardData: ['dashboardData'] as const,
} as const;
```

## 📊 Usage Examples

### Basic Data Fetching
```typescript
function MyComponent() {
  const { data: user, isLoading, isError } = useCurrentUser();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading user</div>;
  if (!user) return <div>No user found</div>;

  return <div>Hello, {user.email}!</div>;
}
```

### Combined Auth Data
```typescript
function AuthenticatedComponent() {
  const { user, tenant, isLoading, isError, refetch } = useAuthData();

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <ErrorMessage />;

  return (
    <div>
      <h1>Welcome, {user.firstName}!</h1>
      <p>Organization: {tenant.name}</p>
      <button onClick={() => refetch()}>Refresh</button>
    </div>
  );
}
```

### Mutations with Invalidation
```typescript
function DataManagementComponent() {
  const { data: stats } = useUserStats();
  const refreshStats = useRefreshUserStats();
  const { invalidateDashboard } = useQueryUtils();

  const handleRefresh = () => {
    refreshStats.mutate(undefined, {
      onSuccess: () => {
        // Additional logic after successful refresh
        invalidateDashboard();
      },
    });
  };

  return (
    <div>
      <p>Total Users: {stats?.totalUsers}</p>
      <button 
        onClick={handleRefresh}
        disabled={refreshStats.isPending}
      >
        {refreshStats.isPending ? 'Refreshing...' : 'Refresh Stats'}
      </button>
    </div>
  );
}
```

### Optimistic Updates
```typescript
function OptimisticComponent() {
  const optimisticUpdate = useOptimisticUpdate();
  const { data } = useDashboardData();

  const handleUpdate = (newData) => {
    optimisticUpdate.mutate(newData);
  };

  return (
    <button onClick={() => handleUpdate({ newField: 'value' })}>
      Update Optimistically
    </button>
  );
}
```

## 🔄 Cache Management

### Automatic Invalidation
- User data invalidates dashboard data
- Tenant data invalidates related queries
- Mutations automatically invalidate related caches

### Manual Invalidation
```typescript
const { invalidateUser, invalidateAll } = useQueryUtils();

// Invalidate specific queries
invalidateUser();

// Invalidate all queries
invalidateAll();
```

### Prefetching
```typescript
const { prefetchQuery } = useQueryUtils();

// Prefetch data for better UX
useEffect(() => {
  prefetchQuery(queryKeys.tenantUsers, api.getTenantUsers);
}, []);
```

## 🎨 Loading States & Error Handling

### Loading States
```typescript
const { data, isLoading, isFetching, isPending } = useCurrentUser();

// isLoading: Initial load
// isFetching: Any fetch (including background)
// isPending: For mutations
```

### Error Handling
```typescript
const { data, isError, error } = useCurrentUser();

if (isError) {
  return (
    <div className="alert alert-error">
      <span>Error: {error.message}</span>
    </div>
  );
}
```

## 🛠️ Development Tools

### React Query DevTools
The application includes React Query DevTools for debugging:

- **Query Inspector**: View all active queries
- **Cache Explorer**: Inspect cached data
- **Mutations Monitor**: Track mutation states
- **Timeline**: View query lifecycle

Access via the floating button in development mode.

## 📈 Performance Optimizations

### Stale Time Configuration
- **User Data**: 5 minutes (rarely changes)
- **Tenant Data**: 10 minutes (very stable)
- **User Lists**: 2 minutes (more dynamic)
- **Dashboard Data**: 2 minutes (aggregated data)

### Background Refetching
- Queries automatically refetch in background when stale
- Window focus refetching disabled for better UX
- Smart retry logic prevents unnecessary requests

### Memory Management
- Automatic garbage collection after 30 minutes
- Query removal when components unmount
- Optimized cache sizes

## 🔮 Future Enhancements

### Potential Additions
1. **Infinite Queries**: For paginated data
2. **Real-time Updates**: WebSocket integration
3. **Offline Support**: Background sync
4. **Prefetching Strategies**: Route-based prefetching
5. **Custom Retry Logic**: Exponential backoff
6. **Cache Persistence**: LocalStorage integration

### API Integration
```typescript
// Future API client functions
export const api = {
  // ... existing functions
  
  // Paginated user list
  async getTenantUsersPaginated(page: number, limit: number) {
    // Implementation
  },
  
  // Real-time updates
  async subscribeToUpdates(callback: (data: any) => void) {
    // WebSocket implementation
  },
  
  // Bulk operations
  async updateMultipleUsers(updates: UserUpdate[]) {
    // Implementation
  },
};
```

## 🚨 Best Practices

### Do's
- ✅ Use custom hooks for data fetching
- ✅ Implement proper loading and error states
- ✅ Invalidate related queries after mutations
- ✅ Use optimistic updates for better UX
- ✅ Configure appropriate stale times
- ✅ Handle errors gracefully

### Don'ts
- ❌ Don't fetch data directly in components
- ❌ Don't ignore loading and error states
- ❌ Don't forget to invalidate caches
- ❌ Don't use stale data without indicating it
- ❌ Don't over-fetch data
- ❌ Don't ignore query key consistency

## 🎯 Migration from Server Components

The application now uses a hybrid approach:

1. **Server Components**: For initial data and SEO
2. **Client Components**: For interactive features and real-time updates
3. **TanStack Query**: For client-side state management

This provides the best of both worlds: server-side performance with client-side interactivity.
