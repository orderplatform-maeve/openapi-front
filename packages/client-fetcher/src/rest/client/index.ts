import { AxiosResponse, AxiosResponseTransformer } from 'axios';
import { BaseClient } from '../../core/client';

export type StoreData = {
  store_id: string;
  store_code: string;
  store_name: string;
};

export type LoginVariables = {
  member_id: string;
  member_pwd: string;
};
export type LoginResponse = {
  result: boolean;
  token?: string;
  member_data: {
    member_id: string;
    member_code: string;
    member_name: string;
    member_auth: string;
  };
  shop_data: [StoreData];
};
export type AxiosLoginResponse = AxiosResponse<LoginResponse>;

export type StoreListVariables = {
  member_id: string;
};
export type StoreListResponse = {
  result: boolean;
  shop_data: [StoreData];
};

class RestClient extends BaseClient {
  constructor(url: string) {
    super(url);
  }

  memberLogin = (data: LoginVariables): Promise<AxiosResponse<LoginResponse>> => {
    const formData = new FormData();
    formData.append('member_id', data.member_id);
    formData.append('member_pwd', data.member_pwd);

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    return this.post<LoginResponse, LoginVariables>('/login/member_login', data, config);
  };

  storeList = (data: StoreListVariables) => {
    const formData = new FormData();
    formData.append('member_id', data.member_id);

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };

    return this.post<StoreListResponse, StoreListVariables>('/store/store_list', data, config);
  };

  transformResponse?: AxiosResponseTransformer | undefined;
}

// TODO: URL 정보를 외부에서 입력받는 방법 고민해야함
// @ts-ignore
export const Client = new RestClient(import.meta.env.VITE_REST_URL);
