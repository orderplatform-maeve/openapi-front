import { QueryClient } from '@tanstack/react-query';
import { AdminTodoClient } from '../client';
import { QUERY_KEYS } from '../../../core/query-keys';
import { useClientQuery } from '../../../core/hooks/useClientQuery';

const useAdminGetTodoListApi = () => {
  return useClientQuery(QUERY_KEYS.ADMIN.TODO, AdminTodoClient.getTodoList);
};

const prefetchAdminGetTodoListApi = async (queryClient: QueryClient) => {
  await queryClient.prefetchQuery({
    queryKey: QUERY_KEYS.ADMIN.TODO,
    queryFn: AdminTodoClient.getTodoList,
  });

  return queryClient;
};

export { useAdminGetTodoListApi, prefetchAdminGetTodoListApi };
