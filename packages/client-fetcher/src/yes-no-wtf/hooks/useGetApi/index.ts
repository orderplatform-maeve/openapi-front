import { Client } from '../../client';
import { QUERY_KEYS } from '../../../core/query-keys';
import { useClientQuery } from '../../../core/hooks/useClientQuery';

const useGetApi = () => {
  return useClientQuery(QUERY_KEYS.YES_NO.API, () => Client.api());
};

export { useGetApi };
