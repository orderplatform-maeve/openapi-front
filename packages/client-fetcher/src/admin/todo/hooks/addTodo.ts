import { IAdminTodo } from '../model';
import { AdminTodoClient } from '../client';
import { QUERY_KEYS } from '../../../core/query-keys';
import { useClientMutation } from '../../../core/hooks/useClientMutation';

const useAdminAddTodo = () => {
  return useClientMutation(QUERY_KEYS.ADMIN.TODO, (body: IAdminTodo) => AdminTodoClient.addTodo(body));
};

export { useAdminAddTodo };
