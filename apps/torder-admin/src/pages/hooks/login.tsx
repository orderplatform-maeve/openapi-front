import qs from 'qs';
import conf from '@/conf';

const AdminAuthLogin = () => {
  return <div>Go To Login...</div>;
};

export const getServerSideProps = () => {
  /**
   * pnpm run dev 로 실행한 경우만 localhost 로 redirect (next.config.js)
   * pnpm run start 로 실행되면 conf url 값으로 redirect
   */
  const targetUrl = process.env.NODE_ENV === 'development' ? process.env.SERVER_URL : conf.ADMIN_URL;
  const loginParams = qs.stringify(
    {
      response_type: 'code',
      client_id: conf.ADMIN_AUTH_API.CLIENT_ID,
      redirect_uri: `${targetUrl}/hooks/auth`,
      scope: 'Permission',
    },
    { encode: false },
  );
  return {
    redirect: {
      /**
       * @link https://torder.atlassian.net/wiki/spaces/INTLTM/pages/416153634/ACS-#1.-%5BOAuth2%5D-GET-%2Flogin
       */
      destination: `${conf.ADMIN_AUTH_API.URL}/login?${loginParams}`,
    },
  };
};

export default AdminAuthLogin;
