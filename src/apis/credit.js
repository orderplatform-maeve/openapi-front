import axios from 'axios';
import endpoints from '@apis/endpoints';

const requestPayDetails = (config) => {
  const url = `${endpoints.credit.payDetails}?page=${config.page}&size=${config.size}&storeCode=${config.storeCode}&tabletNumber=${config.tabletNumber}&paymentMethod=${config.paymentMethod}&paymentStatus=${config.paymentStatus}&startDatetime=${config.startDatetime}&endDatetime=${config.endDatetime}`;
  const auth = {
    auth: {
      username: 'torder-credit-api',
      password: 'xldhejtjsrufwp123!',
    }
  };

  const res = axios.get(url, auth);

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

  const res = axios.post(url, config, auth);

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

  const res = axios.post(url, config, auth);
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

  const res = axios.post(url, config, auth);
  return res;
};


export default {
  requestPayDetails,
  requestCashAllCommit,
  requestCashCommit,
  requestCashCancelCommit
};