import qs from 'qs';
import { NextPageContext } from 'next';
import { Base64 } from 'js-base64';
import axios from 'axios';
import conf from '@/conf';

const AdminAuth = () => {
  return <div>Loading...</div>;
};

export const getServerSideProps = async (context: NextPageContext) => {
  const { query, res } = context;

  /**
   * query string 에 code 가 없는 경우 로그인으로 redirect
   */
  if (!query.code) {
    return {
      redirect: {
        destination: '/hooks/login',
      },
    };
  }

  /**
   * pnpm run dev 로 실행한 경우만 localhost 로 redirect (next.config.js)
   * pnpm run start 로 실행되면 conf url 값으로 redirect
   */
  const targetUrl = process.env.NODE_ENV === 'development' ? process.env.SERVER_URL : conf.ADMIN_URL;
  const authorizationCode = Base64.encode(`${conf.ADMIN_AUTH_API.CLIENT_ID}:${conf.ADMIN_AUTH_API.CLIENT_SECRET_ID}`);

  /**
   * @link https://torder.atlassian.net/wiki/spaces/INTLTM/pages/416153634/ACS-#3.-%5BOAuth2%5D-POST-%2Fauth%2Ftoken
   * grant_type: authorization_code
   * - access_token, refresh_token 발급
   */
  const response = await axios.post(
    `${conf.ADMIN_AUTH_API.URL}/auth/token/v2`,
    qs.stringify(
      {
        grant_type: 'authorization_code',
        redirect_uri: `${targetUrl}/hooks/auth`,
        code: query.code,
      },
      { encode: false },
    ),
    {
      headers: {
        Authorization: `Basic ${authorizationCode}`,
        'content-type': 'application/x-www-form-urlencoded',
      },
    },
  );

  /**
   * admin-auth 에서 넘어오는 쿠키 값을 그대로 사용
   */
  const cookies = response.headers['set-cookie'] ?? [];
  res?.setHeader('set-cookie', cookies);

  /**
   * 메인 페이지로 이동
   */
  return {
    redirect: {
      destination: '/',
    },
  };
};

export default AdminAuth;
