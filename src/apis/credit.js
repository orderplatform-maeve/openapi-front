import { getRequestApi, postRequestApi } from '@utils/axiosUtils';
import endpoints from '@apis/endpoints';

const requestPayDetails = (config) => {
  const url = `${endpoints.credit.payDetails}?page=${config.page}&size=${config.size}&storeCode=${config.storeCode}&tabletNumber=${config.tabletNumber}&paymentMethod=${config.paymentMethod}&paymentStatus=${config.paymentStatus}&startDatetime=${config.startDatetime}&endDatetime=${config.endDatetime}`;
  const auth = {
    auth: {
      username: 'torder-credit-api',
      password: 'xldhejtjsrufwp123!',
    }
  };

  const res = getRequestApi(url, auth);

  return res;
};

const requestCashAllCommit = (orderKey) => {
  const url = `${endpoints.credit.cashAllCommit}`;
  const auth = {
    auth: {
      username: 'torder-credit-api',
      password: 'xldhejtjsrufwp123!',
    }
  };

  const config = {
    orderKey,
  };

  const res = postRequestApi(url, config, auth);

  return res;
};

const requestCashCommit = (config) => {
  const url = `${endpoints.credit.cashCommit}`;
  const auth = {
    auth: {
      username: 'torder-credit-api',
      password: 'xldhejtjsrufwp123!',
    }
  };

  const res = postRequestApi(url, config, auth);
  return res;
};

const requestCashCancelCommit = (config) => {
  const url = `${endpoints.credit.cashCancelCommit}`;
  const auth = {
    auth: {
      username: 'torder-credit-api',
      password: 'xldhejtjsrufwp123!',
    }
  };

  const res = postRequestApi(url, config, auth);
  return res;
};

// 결제주문 보류처리 요청
const requestPaymentPend = (config) => {
  const url = `${endpoints.credit.pend}`;
  const auth = {
    auth: {
      username: 'torder-credit-api',
      password: 'xldhejtjsrufwp123!',
    }
  };

  const res = postRequestApi(url, config, auth);
  return res;
};

const requestTabletStatus = (config) => {
  const url = `${endpoints.credit.tablet.status}?storeCode=${config.storeCode}`;
  const auth = {
    auth: {
      username: 'torder-credit-api',
      password: 'xldhejtjsrufwp123!',
    }
  };

  const res = getRequestApi(url, auth);
  return res;
};

// 보류된 주문 리스트 조회
const requestPendingList = (config) => {
  const url = `${endpoints.credit.pends}?storeCode=${config.storeCode}&tabletNumber=${config.tabletNumber}&startDatetime=${config.startDatetime}&endDatetime=${config.endDatetime}&page=${config.page}&size=${config.size}`;
  const auth = {
    auth: {
      username: 'torder-credit-api',
      password: 'xldhejtjsrufwp123!',
    }
  };
  const res = getRequestApi(url, auth);

  return res;
};

const requestCreditWebLogs = (payload) => {
  const url = endpoints.credit.webLogs;
  const auth = {
    auth: {
      username: 'torder-credit-api',
      password: 'xldhejtjsrufwp123!',
    }
  };

  const res = postRequestApi(url, payload, auth);
  return res;
};

export default {
  requestPayDetails,
  requestCashAllCommit,
  requestCashCommit,
  requestCashCancelCommit,
  requestPaymentPend,
  requestTabletStatus,
  requestPendingList,
  requestCreditWebLogs
};
