import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  MutationKey,
  MutationFunction,
} from '@tanstack/react-query';

export function useClientMutation<TData = unknown, TError = unknown, TVariables = void, TContext = unknown>(
  mutationKey: MutationKey,
  mutationFn: MutationFunction<TData, TVariables>,
  options?: UseMutationOptions<TData, TError, TVariables, TContext>,
): UseMutationResult<TData, TError, TVariables, TContext> {
  const defaultOption = {
    retry: 0,
  };
  return useMutation(mutationKey, mutationFn, { ...defaultOption, ...options });
}
