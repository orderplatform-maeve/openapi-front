const DEMO_URL = 'http://demo.torder.co.kr';
const ADMIN_URL = 'http://admin.torder.co.kr';

// export const DEV_URL = 'http://dev.torder.co.kr';
// export const DEMO_URL = 'http://demo.torder.co.kr';

const endpoints = {
  authentication: {
    login: `${DEMO_URL}/login/member_login`,
  },
  orders: {
    todayRedisData: `${DEMO_URL}/logs/Today_redis_data`,
  },
};

export default endpoints;
