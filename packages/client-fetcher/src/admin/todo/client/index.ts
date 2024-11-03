import { AxiosResponseTransformer } from 'axios';
import { IAdminTodo } from '../model';
import { getAdminApiUrl } from '../../utils/getAdminApiUrl';
import { BaseClient } from '../../../core/client';

class Client extends BaseClient {
  constructor() {
    const url = getAdminApiUrl();
    super(url);
  }

  private basePath = '/api/todo';

  getTodoList = async () => {
    const { data } = await this.get<IAdminTodo[]>(this.basePath);
    return data;
  };

  addTodo = async (body: IAdminTodo) => {
    const result = await this.post<IAdminTodo[], IAdminTodo>(this.basePath, { data: body });
    return result.data;
  };

  transformResponse?: AxiosResponseTransformer;
}

const AdminTodoClient = new Client();
export { AdminTodoClient };
