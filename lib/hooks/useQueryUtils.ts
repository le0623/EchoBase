'use client';

import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from './useQueries';

export function useQueryUtils() {
  const queryClient = useQueryClient();

  const invalidateAll = () => {
    queryClient.invalidateQueries();
  };

  const invalidateUser = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.currentUser });
    queryClient.invalidateQueries({ queryKey: queryKeys.dashboardData });
  };

  const invalidateTenant = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.currentTenant });
    queryClient.invalidateQueries({ queryKey: queryKeys.dashboardData });
  };

  const invalidateTenantUsers = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.tenantUsers });
    queryClient.invalidateQueries({ queryKey: queryKeys.userStats });
    queryClient.invalidateQueries({ queryKey: queryKeys.dashboardData });
  };

  const invalidateDashboard = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.dashboardData });
    queryClient.invalidateQueries({ queryKey: queryKeys.userStats });
  };

  const refetchAll = () => {
    queryClient.refetchQueries();
  };

  const setQueryData = <T>(queryKey: any[], data: T) => {
    queryClient.setQueryData(queryKey, data);
  };

  const getQueryData = <T>(queryKey: any[]): T | undefined => {
    return queryClient.getQueryData<T>(queryKey);
  };

  const removeQueries = (queryKey?: any[]) => {
    if (queryKey) {
      queryClient.removeQueries({ queryKey });
    } else {
      queryClient.removeQueries();
    }
  };

  const prefetchQuery = async (queryKey: any[], queryFn: () => Promise<any>) => {
    await queryClient.prefetchQuery({
      queryKey,
      queryFn,
      staleTime: 1000 * 60 * 5, // 5 minutes
    });
  };

  return {
    // Invalidation methods
    invalidateAll,
    invalidateUser,
    invalidateTenant,
    invalidateTenantUsers,
    invalidateDashboard,
    
    // Utility methods
    refetchAll,
    setQueryData,
    getQueryData,
    removeQueries,
    prefetchQuery,
    
    // Direct access to queryClient for advanced use cases
    queryClient,
  };
}
