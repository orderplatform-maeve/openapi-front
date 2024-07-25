import { IS_DEV_TEAM, IS_LG_FLAG } from "@utils/constants";

let REST_URL = "http://rest.torder.co.kr";
let ORDER_URL = "http://rest.torder.co.kr";
let GET_CART_LIST_URL = "http://rest.torder.co.kr";
let ADMIN_URL = "http://admin.torder.co.kr";
let API_URL = "http://api.torder.co.kr";
let NOTICE_URL = "https://apigw.torder.co.kr/v2";
let TORDER_V2 = "https://apigw.torder.co.kr/v2";
let TABLE_GAME_URL = "https://apigw.torder.co.kr";
let ROBOT_TEXT = "http://robot.torder.co.kr:8888/v2/order";
let DEMO_URL = "http://demo.api.torder.co.kr";
let PAYMENT_URL = "https://sgw.torder.co.kr";
let HAPPY_TALK = "https://rest.torder.co.kr";

if (IS_DEV_TEAM) {
  REST_URL = "http://development.rest.torder.co.kr";
  ORDER_URL = "http://development.order.torder.co.kr";
  GET_CART_LIST_URL = "http://development.cart.torder.co.kr";
  ADMIN_URL = "http://development.rest.torder.co.kr";
  API_URL = "http://development.cache.torder.co.kr";
  NOTICE_URL = "https://dev-apigw.torder.co.kr/v2";
  TORDER_V2 = "https://dev-apigw.torder.co.kr/v2";
  TABLE_GAME_URL = "https://dev-apigw.torder.co.kr";
  ROBOT_TEXT = "http://dev.robot.torder.co.kr";
  DEMO_URL = "http://development.rest.torder.co.kr";
  PAYMENT_URL = "https://dev-sgw.torder.co.kr";
  HAPPY_TALK = "http://development.rest.torder.co.kr";
}

if (IS_LG_FLAG) {
  REST_URL = "https://kr.dev.rest-api.share.torder.com";
  ORDER_URL = "https://kr.dev.rest-api.share.torder.com";
  GET_CART_LIST_URL = "https://kr.dev.rest-api.share.torder.com";
  ADMIN_URL = "https://kr.dev.rest-api.share.torder.com";
  API_URL = "https://kr.dev.init-api.share.torder.com";
  NOTICE_URL = "https://dev-apigw.torder.co.kr/v2";
  TORDER_V2 = "https://kr.dev.tcloud-gateway.share.torder.com/v2";
  TABLE_GAME_URL = "https://dev-apigw.torder.co.kr";
  ROBOT_TEXT = "http://dev.robot.torder.co.kr";
  DEMO_URL = "https://kr.dev.rest-api.share.torder.com";
  PAYMENT_URL = "https://kr.dev.tcloud-gateway.share.torder.com";
  HAPPY_TALK = "http://kr.dev.rest-api.share.torder.com";
}

const endpoints = {
  authentication: {
    login: `${REST_URL}/login/member_login`
  },
  orders: {
    todayRedisData: `${REST_URL}/logs/Today_redis_data`,
    commitOrderViewData: `${REST_URL}/logs/commit_orderView_data`,
    order: `${REST_URL}/shop/order`,
    controlLastOrder: `${REST_URL}/message/_Post_message`,
    deleteLastOrder: `${REST_URL}/message/_deleteMessage`,
    orderReceive: `${TORDER_V2}/receive/order/confirm`
  },
  device: {
    shopOpen: `${REST_URL}/store/shop_open`,
    shopClose: `${REST_URL}/store/shop_close`,
    shopOpenOrder: `${REST_URL}/store/shop_open_order`,
    shopCloseOrder: `${REST_URL}/store/shop_close_order`,
    showRecentOrder: `${REST_URL}/store/shop_open_recent_order`,
    hideRecentOrder: `${REST_URL}/store/shop_close_recent_order`,
    showKitchenOrder: `${REST_URL}/store/shop_open_kitchen_order`,
    hideKitchenOrder: `${REST_URL}/store/shop_close_kitchen_order`
  },
  table: {
    getTableList: `${REST_URL}/shop/get_table_list`,
    getCartList: `${GET_CART_LIST_URL}/tablet_order/get_cart_list`,
    order: `${ORDER_URL}/tablet_order/order`
  },
  menu: {
    categories: `${REST_URL}/shop/categorys`,
    getGoodsList: `${REST_URL}/goods/get_goods_list`,
    updateCategoryOpen: `${ADMIN_URL}/category/update_categroty_open`,
    updateCategoryClose: `${ADMIN_URL}/category/update_categroty_close`,
    getAllCategories: `${ADMIN_URL}/category/get_all_categorys`,
    getMenuConfig: `${API_URL}/tablet_data/init`
  },
  shop: {
    config: `${REST_URL}/shop/config`,
    getList: `${REST_URL}/store/store_list`
  },
  goods: {
    updateGoodStatus: `${REST_URL}/goods/update_goods`,
    optionSaleOffCheck: `${REST_URL}/goods/optionSaleOffCheck`,
    optionSaleOffSubmit: `${REST_URL}/goods/optionSaleOffSubmit`
  },
  tablet: {
    allRefresh: `${ADMIN_URL}/tablet/tablet_all_update`,
    refresh: `${ADMIN_URL}/tablet/tablet_refresh`,
    resetOrder: `${ADMIN_URL}/tablet/tablet_order_trash`
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
    creditOrderKeyList: `${DEMO_URL}/credit/creditOrderKeyList`
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
    message: `${NOTICE_URL}/notice/message`
  },
  tableGame: {
    admin: {
      master: {
        room: `${TABLE_GAME_URL}/table-game/admin/master/room`,
        quick: `${TABLE_GAME_URL}/table-game/admin/master/quick`
      },
      store: `${TABLE_GAME_URL}/table-game/admin/store`,
      icon: `${TABLE_GAME_URL}/table-game/admin/store/icon`,
      game: `${TABLE_GAME_URL}/table-game/admin/game`
    },
    entertainment: {
      games: `${TABLE_GAME_URL}/entertainment/admin/stores/games`
    }
  },
  category: {
    updateCategoryScheduleOff: `${ADMIN_URL}/category/updateCategoryScheduleOff`,
    updateCategoryScheduleOn: `${ADMIN_URL}/category/updateCategoryScheduleOn`,
    updateCategoryTime: `${ADMIN_URL}/category/updateCategoryTime`,
    updateCategoryScheduleDateArray: `${ADMIN_URL}/category/updateCategoryScheduleDateArray`,
    updateCategoryHide: `${ADMIN_URL}/category/updateCategoryHide`,
    updateCategoryShow: `${ADMIN_URL}/category/updateCategoryShow`
  },
  happyTalk: {
    postMessage: `${HAPPY_TALK}/event/happytalk`
  },
  credit: {
    payDetails: `${PAYMENT_URL}/credit/v2/pay-details`,
    cashAllCommit: `${PAYMENT_URL}/credit/v2/cash-all-commit`,
    cashCommit: `${PAYMENT_URL}/credit/v2/cash-commit`,
    cashCancelCommit: `${PAYMENT_URL}/credit/v2/cash-cancel-commit`,
    pend: `${PAYMENT_URL}/credit/v2/pays/pend`,
    tablet: {
      status: `${PAYMENT_URL}/credit/v2/tablet/status`
    },
    pends: `${PAYMENT_URL}/credit/v2/pays/pends`,
    webLogs: `${PAYMENT_URL}/credit/v2/web-logs`
  }
};

export default endpoints;
