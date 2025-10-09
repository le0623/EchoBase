'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from './useQueries';

// Example mutation hooks for future data updates
// These would be used when you have API endpoints for updating data

export function useRefreshData() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // Simulate a refresh operation
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true };
    },
    onSuccess: () => {
      // Invalidate all queries to refresh data
      queryClient.invalidateQueries();
    },
  });
}

export function useRefreshUserStats() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // This would call an API endpoint to refresh user stats
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true };
    },
    onSuccess: () => {
      // Invalidate specific queries
      queryClient.invalidateQueries({ queryKey: queryKeys.userStats });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboardData });
    },
  });
}

export function useRefreshTenantUsers() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // This would call an API endpoint to refresh tenant users
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tenantUsers });
    },
  });
}

// Utility hook for optimistic updates
export function useOptimisticUpdate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newData: any) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return newData;
    },
    onMutate: async (newData) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.dashboardData });

      // Snapshot the previous value
      const previousData = queryClient.getQueryData(queryKeys.dashboardData);

      // Optimistically update to the new value
      queryClient.setQueryData(queryKeys.dashboardData, (old: any) => ({
        ...old,
        ...newData,
      }));

      // Return a context object with the snapshotted value
      return { previousData };
    },
    onError: (err, newData, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousData) {
        queryClient.setQueryData(queryKeys.dashboardData, context.previousData);
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboardData });
    },
  });
}
