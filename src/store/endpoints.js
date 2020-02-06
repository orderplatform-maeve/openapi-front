const DEMO_URL = 'http://demo.torder.co.kr';
const ADMIN_URL = 'http://admin.torder.co.kr';
const REST_URL = 'http://rest.torder.co.kr';

// export const DEV_URL = 'http://dev.torder.co.kr';
// export const DEMO_URL = 'http://demo.torder.co.kr';

const endpoints = {
  authentication: {
    login: `${DEMO_URL}/login/member_login`,
  },
  orders: {
    todayRedisData: `${DEMO_URL}/logs/Today_redis_data`,
    commitOrderViewData: `${DEMO_URL}/logs/commit_orderView_data`,
    order: `${DEMO_URL}/shop/order`,
  },
  device: {
    shopOpen: `${ADMIN_URL}/store/shop_open`,
    shopClose: `${ADMIN_URL}/store/shop_close`,
    shopOpenOrder: `${ADMIN_URL}/store/shop_open_order`,
    shopCloseOrder: `${ADMIN_URL}/store/shop_close_order`,
  },
  table: {
    getTableList: `${DEMO_URL}/shop/get_table_list`,
    getCartList: `${DEMO_URL}/tablet_order/get_cart_list`,
  },
  menu: {
    categories: `${DEMO_URL}/shop/categorys`,
    getGoodsList: `${DEMO_URL}/goods/get_goods_list`,
  },
};

export default endpoints;
