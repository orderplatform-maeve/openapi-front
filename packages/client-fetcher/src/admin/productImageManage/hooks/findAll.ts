import { QueryClient } from '@tanstack/react-query';
import { AdminProductImageManageClient } from '../client';
import { QUERY_KEYS } from '../../../core/query-keys';
import { useClientQuery } from '../../../core/hooks/useClientQuery';

const useProductImageManageFindAll = () => {
  return useClientQuery(QUERY_KEYS.ADMIN.PRODUCT_IMAGE_MANAGE, AdminProductImageManageClient.findAll, {
    staleTime: 3000,
  });
};

const prefetchProductImageManageFindAll = async (queryClient: QueryClient, cookie: string) => {
  await queryClient.prefetchQuery({
    queryKey: QUERY_KEYS.ADMIN.PRODUCT_IMAGE_MANAGE,
    queryFn: () => AdminProductImageManageClient.findAll(cookie),
  });

  return queryClient;
};

export { useProductImageManageFindAll, prefetchProductImageManageFindAll };
