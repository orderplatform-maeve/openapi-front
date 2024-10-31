import { QueryClient } from '@tanstack/react-query';
import { AdminPokemonClient } from '../client';
import { QUERY_KEYS } from '../../../core/query-keys';
import { useClientQuery } from '../../../core/hooks/useClientQuery';

const useAdminGetPokemonDetailApi = (id: number) => {
  return useClientQuery(QUERY_KEYS.ADMIN.POKEMON_DETAIL(id), () => AdminPokemonClient.getPokemonById(id), {
    staleTime: 3000,
  });
};

const prefetchAdminGetPokemonDetailApi = async (queryClient: QueryClient, id: number) => {
  await queryClient.prefetchQuery({
    queryKey: QUERY_KEYS.ADMIN.POKEMON_DETAIL(id),
    queryFn: () => AdminPokemonClient.getPokemonById(id),
  });

  return queryClient;
};

export { useAdminGetPokemonDetailApi, prefetchAdminGetPokemonDetailApi };
