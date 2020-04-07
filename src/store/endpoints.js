import { isDev } from '@utils/constants';

const DEMO_URL = 'http://demo.torder.co.kr';
const REST_URL = 'http://rest.torder.co.kr';

const DEMO_ADMIN_URL = 'http://demo.admin.torder.co.kr';
const ADMIN_URL = 'http://admin.torder.co.kr';
const DEV_URL = 'http://dev.torder.co.kr';
const API_URL = 'http://api.auth.order.orderhae.com';

const SERVER_URL = isDev ? DEMO_URL : REST_URL;

const endpoints = {
  authentication: {
    login: `${SERVER_URL}/login/member_login`,
  },
  orders: {
    todayRedisData: `${SERVER_URL}/logs/Today_redis_data`,
    commitOrderViewData: `${SERVER_URL}/logs/commit_orderView_data`,
    order: `${SERVER_URL}/shop/order`,
  },
  device: {
    shopOpen: `${SERVER_URL}/store/shop_open`,
    shopClose: `${SERVER_URL}/store/shop_close`,
    shopOpenOrder: `${SERVER_URL}/store/shop_open_order`,
    shopCloseOrder: `${SERVER_URL}/store/shop_close_order`,
  },
  table: {
    getTableList: `${SERVER_URL}/shop/get_table_list`,
    getCartList: `${SERVER_URL}/tablet_order/get_cart_list`,
  },
  menu: {
    categories: `${SERVER_URL}/shop/categorys`,
    getGoodsList: `${SERVER_URL}/goods/get_goods_list`,
  },
  shop: {
    init: `${SERVER_URL}/shop/init`,
  },
};

export default endpoints;
