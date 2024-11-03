import { IAdminTodo } from '../model';
import { AdminTodoClient } from '../client';
import { useClientMutation } from '../../../core/hooks/useClientMutation';

const useAdminAddTodo = () => {
  return useClientMutation((body: IAdminTodo) => AdminTodoClient.addTodo(body));
};

export { useAdminAddTodo };
