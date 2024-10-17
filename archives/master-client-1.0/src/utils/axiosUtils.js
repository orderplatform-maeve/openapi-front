import axios from 'axios';

export const getRequestApi = (url, config) => {
  const token = localStorage.getItem('jwt');

  return axios.get(
    url,
    {
      headers: {
        Authorization: token
      },
      config
    }
  );
};

export const postRequestApi = (url, params, config) => {
  const token = localStorage.getItem('jwt');

  return axios.post(
    url,
    params,
    {
      headers: {
        Authorization: token
      },
      config
    }
  );
};

export const putRequestApi = (url, params, config) => {
  const token = localStorage.getItem('jwt');

  return axios.put(
    url,
    params,
    {
      headers: {
        Authorization: token
      },
      config
    }
  );
};

