import { AxiosResponseTransformer } from 'axios';
import { getAdminApiUrl } from '../../utils/getAdminApiUrl';
import { BaseClient } from '../../../core/client';

class Client extends BaseClient {
  constructor() {
    const url = getAdminApiUrl();
    super(url);
  }

  private basePath = '/api/productImageManage';

  findAll = async (cookie?: string) => {
    const { data } = await this.get(this.basePath, {
      headers: {
        cookie: cookie || '',
      },
      withCredentials: true,
    });
    return data;
  };

  transformResponse?: AxiosResponseTransformer;
}

const AdminProductImageManageClient = new Client();
export { AdminProductImageManageClient };
