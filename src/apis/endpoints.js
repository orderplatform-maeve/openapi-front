import { STOP_REDIRECT } from '@utils/constants';

const REST_URL = 'http://rest.torder.co.kr';
const ADMIN_URL = 'http://admin.torder.co.kr';
const API_URL = 'http://api.torder.co.kr';
const DEMO_URL = 'http://demo.api.torder.co.kr';
const ROBOT_TEXT = 'http://52.78.117.91:8888/v2/order';
// const ENTERTAINMENT_URL = 'https://dev-apigw.torder.co.kr';
const HAPPY_TALK = 'https://happytalk.torder.co.kr';
const NOTICE_URL = STOP_REDIRECT ? 'http://dev-apigw.torder.co.kr/v2' : 'http://apigw.torder.co.kr/v2';
// const DEV_ADMIN_URL = 'http://dev.admin.torder.co.kr';
const NOTICE_URL = 'https://apigw.torder.co.kr/v2';

// const SERVER_URL = isDemo ? DEMO_URL : REST_URL;
const TORDER_V2 = STOP_REDIRECT ? 'https://dev-apigw.torder.co.kr/v2' : 'https://apigw.torder.co.kr/v2';
const TABLE_GAME_URL = STOP_REDIRECT ? 'http://dev-apigw.torder.co.kr' : 'http://apigw.torder.co.kr';

const endpoints = {
  authentication: {
    login: `${REST_URL}/login/member_login`,
  },
  orders: {
    todayRedisData: `${REST_URL}/logs/Today_redis_data`,
    commitOrderViewData: `${REST_URL}/logs/commit_orderView_data`,
    order: `${REST_URL}/shop/order`,
    controlLastOrder: `${REST_URL}/message/_Post_message`,
    deleteLastOrder: `${REST_URL}/message/_deleteMessage`,
    orderReceive: `${TORDER_V2}/receive/order/confirm`,
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
    config: `${REST_URL}/shop/config`,
    getList: `${REST_URL}/store/store_list`,
  },
  goods: {
    updateGoodStatus: `${REST_URL}/goods/update_goods`,
    optionSaleOffCheck: `${REST_URL}/goods/optionSaleOffCheck`,
    optionSaleOffSubmit: `${REST_URL}/goods/optionSaleOffSubmit`,
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
    tableCreditStatList: `${DEMO_URL}/credit/getTabletCreditStatList`,
    tableCreditInfo: `${DEMO_URL}/credit/getTableCreditInfo`,
    creditOrderKeyList: `${DEMO_URL}/credit/creditOrderKeyList`,
  },
  servingRobot: {
    servingRobotStatus: `${DEMO_URL}/message/_storeRobotList`,
    robotOrder: `${DEMO_URL}/message/_robotOrder`,
    backRobot: `${ROBOT_TEXT}/ok`,
    robotMoving: `${DEMO_URL}/message/orderMoving`
  },
  notice: {
    info: `${NOTICE_URL}/notice/info`,
    popup: `${NOTICE_URL}/notice/popup`,
    message: `${NOTICE_URL}/notice/message`,
  },
  tableGame: {
    admin: {
      master: {
        room: `${TABLE_GAME_URL}/table-game/admin/master/room`,
        quick: `${TABLE_GAME_URL}/table-game/admin/master/quick`,
      },
      store: `${TABLE_GAME_URL}/table-game/admin/store`,
    }
  },
  category : {
    updateCategoryScheduleOff : `${ADMIN_URL}/category/updateCategoryScheduleOff`,
    updateCategoryScheduleOn : `${ADMIN_URL}/category/updateCategoryScheduleOn`,
    updateCategoryTime : `${ADMIN_URL}/category/updateCategoryTime`,
    updateCategoryScheduleDateArray  : `${ADMIN_URL}/category/updateCategoryScheduleDateArray`,
    updateCategoryHide : `${ADMIN_URL}/category/updateCategoryHide`,
    updateCategoryShow : `${ADMIN_URL}/category/updateCategoryShow`
  },
  happyTalk: {
    postMessage: `${HAPPY_TALK}/happytalk/happy-talk/message`,
  }
};

export default endpoints;
