import { isDemo } from '@utils/constants';

const DEMO_URL = 'http://demo.torder.co.kr';
const REST_URL = 'http://rest.torder.co.kr';
const ADMIN_URL = 'http://admin.torder.co.kr';

const SERVER_URL = isDemo ? DEMO_URL : REST_URL;

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
    showRecentOrder: `${SERVER_URL}/store/shop_open_recent_order`,
    hideRecentOrder: `${SERVER_URL}/store/shop_close_recent_order`,
  },
  table: {
    getTableList: `${SERVER_URL}/shop/get_table_list`,
    getCartList: `${SERVER_URL}/tablet_order/get_cart_list`,
    order: `${SERVER_URL}/tablet_order/order`,
  },
  menu: {
    categories: `${SERVER_URL}/shop/categorys`,
    getGoodsList: `${SERVER_URL}/goods/get_goods_list`,
    updateCategoryOpen: `${ADMIN_URL}/category/update_categroty_open`,
    updateCategoryClose: `${ADMIN_URL}/category/update_categroty_close`,
    getAllCategories: `${ADMIN_URL}/category/get_all_categorys`,
  },
  shop: {
    init: `${SERVER_URL}/shop/init`,
    getList: `${SERVER_URL}/store/store_list`,
  },
  goods: {
    updateGoodStatus: `${SERVER_URL}/goods/update_goods`,
  },
  tablet: {
    allRefresh: `${ADMIN_URL}/tablet/tablet_all_update`,
    refresh: `${ADMIN_URL}/tablet/tablet_refresh`,
    resetOrder: `${ADMIN_URL}/tablet/tablet_order_trash`,
  },
};

export default endpoints;
