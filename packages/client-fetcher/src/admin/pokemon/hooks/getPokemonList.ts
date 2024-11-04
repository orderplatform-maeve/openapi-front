import { QueryClient } from '@tanstack/react-query';
import { AdminPokemonClient } from '../client';
import { QUERY_KEYS } from '../../../core/query-keys';
import { useClientQuery } from '../../../core/hooks/useClientQuery';

const useAdminGetPokemonListApi = () => {
  return useClientQuery(QUERY_KEYS.ADMIN.POKEMON, AdminPokemonClient.getPokemonList, { staleTime: 3000 });
};

const prefetchAdminGetPokemonListApi = async (queryClient: QueryClient) => {
  await queryClient.prefetchQuery({
    queryKey: QUERY_KEYS.ADMIN.POKEMON,
    queryFn: AdminPokemonClient.getPokemonList,
  });

  return queryClient;
};

export { useAdminGetPokemonListApi, prefetchAdminGetPokemonListApi };