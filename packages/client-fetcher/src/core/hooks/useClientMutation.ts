import { useMutation, UseMutationOptions, UseMutationResult, MutationFunction } from '@tanstack/react-query';

export function useClientMutation<TData = unknown, TError = unknown, TVariables = void, TContext = unknown>(
  options: UseMutationOptions<TData, TError, TVariables, TContext>,
): UseMutationResult<TData, TError, TVariables, TContext>;
export function useClientMutation<TData = unknown, TError = unknown, TVariables = void, TContext = unknown>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: Omit<UseMutationOptions<TData, TError, TVariables, TContext>, 'mutationFn'>,
): UseMutationResult<TData, TError, TVariables, TContext>;

export function useClientMutation<TData = unknown, TError = unknown, TVariables = void, TContext = unknown>(
  args1: MutationFunction<TData, TVariables> | UseMutationOptions<TData, TError, TVariables, TContext>,
  args2?: UseMutationOptions<TData, TError, TVariables, TContext>,
): UseMutationResult<TData, TError, TVariables, TContext> {
  const defaultOption = {
    retry: 0,
  };
  if (typeof args1 === 'function') {
    return useMutation(args1 as MutationFunction<TData, TVariables>, { ...defaultOption, ...args2 });
  }
  return useMutation({ ...defaultOption, ...args1 } as UseMutationOptions<TData, TError, TVariables, TContext>);
}
