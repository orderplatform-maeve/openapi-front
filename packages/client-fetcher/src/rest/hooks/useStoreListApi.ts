import type { AxiosResponse } from 'axios';
import { UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import type { StoreListResponse } from '../client';
import { Client } from '../../rest';
import { QUERY_KEYS } from '../../core/query-keys';
import { useClientQuery } from '../../core/hooks/useClientQuery.ts';

type TOptions = UseQueryOptions<
  AxiosResponse<StoreListResponse>,
  unknown,
  StoreListResponse,
  ReturnType<typeof QUERY_KEYS.REST.STORE_LIST>
>;
type RStoreList = UseQueryResult<StoreListResponse, unknown>;

export const useStoreListApi = (storeCode: string, options?: TOptions): RStoreList => {
  return useClientQuery(
    QUERY_KEYS.REST.STORE_LIST(storeCode),
    () => {
      if (!storeCode) {
        throw new Error('Unexpected usage error');
      }
      return Client.storeList({ member_id: storeCode });
    },
    options,
  );
};
