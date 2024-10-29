import { AxiosRequestTransformer, AxiosResponseTransformer } from 'axios';
import { BaseClient } from '@/core/client';

export type APIReturnValue = {
  answer: 'yes' | 'no';
  forced: boolean;
  image: string;
  message?: string;
};

class YesNoClient extends BaseClient {
  constructor() {
    const url = 'https://yesno.wtf';
    super(url);
  }

  api = () => {
    return this.get<APIReturnValue>('api');
  };

  /**
   * 응답 변경
   * @param data
   * @param _headers
   * @param status
   */
  transformResponse: AxiosResponseTransformer = (data, _headers, status) => {
    const objectData = JSON.parse(data);
    if (status === 200) {
      objectData.message = '참 잘했어요';
    }

    return objectData;
  };
  transformRequest?: AxiosRequestTransformer;
}

const Client = new YesNoClient();
export { Client };
