import { useQuery, UseQueryOptions, UseQueryResult, QueryKey } from '@tanstack/react-query';

function useClientQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  queryKey: TQueryKey,
  queryFn: () => Promise<TQueryFnData>,
  options?: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
): UseQueryResult<TData, TError> {
  return useQuery(queryKey, queryFn, {
    // 기본 설정 추가
    retry: 1,

    // window 가 focus 될 때마다 refetch off
    refetchOnWindowFocus: false,

    // 외부에서 설정한 값으로 덮어 쓰기
    ...options,
  });
}

export { useClientQuery };
