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
    commitOrderViewData: `${DEMO_URL}/logs/commit_orderView_data`,
  },
  device: {
    shopOpen: `${ADMIN_URL}/store/shop_open`,
    shopClose: `${ADMIN_URL}/store/shop_close`,
    shopOpenOrder: `${ADMIN_URL}/store/shop_open_order`,
    shopCloseOrder: `${ADMIN_URL}/store/shop_close_order`,
  },
};

export default endpoints;
