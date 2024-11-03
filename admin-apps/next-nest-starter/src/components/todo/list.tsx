import { Admin } from '@torder/client-fetcher';

const TodoList = () => {
  const { data, isSuccess } = Admin.AdminTodo.useAdminGetTodoListApi();

  if (!isSuccess) return null;

  return (
    <ul>
      {data.map(({ value }, i) => (
        <li key={i}>{value}</li>
      ))}
    </ul>
  );
};

export default TodoList;
