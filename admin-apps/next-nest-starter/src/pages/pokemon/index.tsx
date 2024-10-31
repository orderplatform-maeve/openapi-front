import Link from 'next/link';
import { Admin } from '@torder/client-fetcher';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import PokemonBasicInfo from '@/components/pokemon/basicInfo.tsx';

const Pokemon = () => {
  const { data, isSuccess } = Admin.AdminPokemon.useAdminGetPokemonListApi();

  if (!isSuccess) {
    return <div>Loading...</div>;
  }

  return (
    <div className={'p-6'}>
      <h1 className={'mb-4 text-2xl'}>포켓몬 도감</h1>
      <ul className={'grid grid-cols-4 gap-1'}>
        {data.map((pokemon) => (
          <li key={pokemon.id} className={'border rounded hover:bg-slate-300 cursor-pointer'}>
            <Link href={`/pokemon/${pokemon.id}`} className={'p-2 block'}>
              <PokemonBasicInfo {...pokemon.basicInfo} />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const getServerSideProps = async () => {
  const queryClient = new QueryClient();
  await Admin.AdminPokemon.prefetchAdminGetPokemonListApi(queryClient);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export default Pokemon;
