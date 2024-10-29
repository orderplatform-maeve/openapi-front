import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';

function useClientMutation<TData = unknown, TError = unknown, TVariables = void, TContext = unknown>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: UseMutationOptions<TData, TError, TVariables, TContext>,
): UseMutationResult<TData, TError, TVariables, TContext> {
  return useMutation(mutationFn, {
    ...options,
    // 공통 설정
    retry: 1,
  });
}

export { useClientMutation };
