import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { Admin } from '@torder/client-fetcher';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import PokemonSkills from '@/components/pokemon/skills.tsx';
import PokemonBasicInfo from '@/components/pokemon/basicInfo.tsx';

const PokemonDetail = ({ id }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data, isSuccess } = Admin.AdminPokemon.useAdminGetPokemonDetailApi(id);

  if (!isSuccess) {
    return <div>Loading...</div>;
  }

  return (
    <div className={'p-6'}>
      <PokemonBasicInfo {...data.basicInfo} />
      <hr className={'my-2'} />
      <PokemonSkills {...data.skills} />
    </div>
  );
};

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const { params } = context;
  const id = params?.id;

  if (!id) {
    return {
      redirect: {
        destination: '/pokemon',
        permanent: false,
      },
    };
  }
  const queryClient = new QueryClient();
  await Admin.AdminPokemon.prefetchAdminGetPokemonDetailApi(queryClient, +id);

  return {
    props: {
      id: +id,
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export default PokemonDetail;
