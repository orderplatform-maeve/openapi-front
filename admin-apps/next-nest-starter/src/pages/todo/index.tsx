import { Primary } from '@torder/ui';
import { Admin } from '@torder/client-fetcher';
import { Sample } from '@torder/admin-ui';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import TodoList from '@/components/todo/list';
import TodoForm from '@/components/todo/form';

const Todo = () => {
  return (
    <div className={'p-6'}>
      <h1>TODO List</h1>
      <Sample />
      <Primary>test</Primary>
      <TodoForm />
      <TodoList />
    </div>
  );
};

export const getServerSideProps = async () => {
  const queryClient = new QueryClient();
  await Admin.AdminTodo.prefetchAdminGetTodoListApi(queryClient);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export default Todo;
