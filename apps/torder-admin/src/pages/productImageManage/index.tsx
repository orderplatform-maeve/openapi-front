import { GetServerSidePropsContext } from 'next';
import { Admin } from '@torder/client-fetcher';
import { dehydrate, QueryClient } from '@tanstack/react-query';

const ProductImageManagePage = () => {
  const { data } = Admin.ProductImageManage.useProductImageManageFindAll();
  console.log('data', data);
  return <div>AdminProductImageManage</div>;
};

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const queryClient = new QueryClient();
  const cookie = context.req.headers.cookie || '';
  await Admin.ProductImageManage.prefetchProductImageManageFindAll(queryClient, cookie);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export default ProductImageManagePage;
