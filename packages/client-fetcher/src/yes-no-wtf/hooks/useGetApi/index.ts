import { Client } from '@/yes-no-wtf/client';
import { QUERY_KEYS } from '@/core/query-keys';
import { useClientQuery } from '@/core/hooks/useClientQuery.ts';

const useGetApi = () => {
  return useClientQuery(QUERY_KEYS.YES_NO.API, () => Client.api());
};

export { useGetApi };
