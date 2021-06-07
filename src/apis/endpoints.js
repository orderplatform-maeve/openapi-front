// import { isDemo } from '@utils/constants';

// const DEMO_URL = 'http:///demo.api.torder.co.kr';
const REST_URL = 'http://rest.torder.co.kr';
const ADMIN_URL = 'http://admin.torder.co.kr';
const API_URL = 'http://api.torder.co.kr';

// const SERVER_URL = isDemo ? DEMO_URL : REST_URL;

const endpoints = {
  authentication: {
    login: `${REST_URL}/login/member_login`,
  },
  orders: {
    todayRedisData: `${REST_URL}/logs/Today_redis_data`,
    commitOrderViewData: `${REST_URL}/logs/commit_orderView_data`,
    order: `${REST_URL}/shop/order`,
    controlLastOrder: `${REST_URL}/message/_Post_message`,
  },
  device: {
    shopOpen: `${REST_URL}/store/shop_open`,
    shopClose: `${REST_URL}/store/shop_close`,
    shopOpenOrder: `${REST_URL}/store/shop_open_order`,
    shopCloseOrder: `${REST_URL}/store/shop_close_order`,
    showRecentOrder: `${REST_URL}/store/shop_open_recent_order`,
    hideRecentOrder: `${REST_URL}/store/shop_close_recent_order`,
    showKitchenOrder: `${REST_URL}/store/shop_open_kitchen_order`,
    hideKitchenOrder: `${REST_URL}/store/shop_close_kitchen_order`,
  },
  table: {
    getTableList: `${REST_URL}/shop/get_table_list`,
    getCartList: `${REST_URL}/tablet_order/get_cart_list`,
    order: `${REST_URL}/tablet_order/order`,
  },
  menu: {
    categories: `${REST_URL}/shop/categorys`,
    getGoodsList: `${REST_URL}/goods/get_goods_list`,
    updateCategoryOpen: `${ADMIN_URL}/category/update_categroty_open`,
    updateCategoryClose: `${ADMIN_URL}/category/update_categroty_close`,
    getAllCategories: `${ADMIN_URL}/category/get_all_categorys`,
    getMenuConfig: `${API_URL}/tablet_data/init`,
  },
  shop: {
    init: `${REST_URL}/shop/init`,
    getList: `${REST_URL}/store/store_list`,
  },
  goods: {
    updateGoodStatus: `${REST_URL}/goods/update_goods`,
  },
  tablet: {
    allRefresh: `${ADMIN_URL}/tablet/tablet_all_update`,
    refresh: `${ADMIN_URL}/tablet/tablet_refresh`,
    resetOrder: `${ADMIN_URL}/tablet/tablet_order_trash`,
  },
  payment: {
    cardCancelCommit: `${REST_URL}/credit/cardCancelCommit`,
    cashCommit: `${REST_URL}/credit/cashCommit`,
    creditList: `${REST_URL}/credit/creditList`,
    creditDataList: `${REST_URL}/credit/creditDataList`,
    cashCancelCommit: `${REST_URL}/credit/cashCancelCommit`,
    deleteCartList: `${REST_URL}/credit/deleteCartList`,
    misuCommit: `${REST_URL}/credit/misuCommit`,
  },
};

export default endpoints;
