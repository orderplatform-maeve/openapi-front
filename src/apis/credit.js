import axios from 'axios';
import endpoints from '@apis/endpoints';

const requestPayDetails = (config) => {
  const url = `${endpoints.credit.payDetails}?page=${config.page}&size=${config.size}&storeCode=${config.storeCode}`;
  const auth = {
    auth: {
      username: 'torder-credit-api',
      password: 'xldhejtjsrufwp123!',
    }
  };

  const res = axios.get(url, auth);

  return res;
};

export default {
  requestPayDetails,
};