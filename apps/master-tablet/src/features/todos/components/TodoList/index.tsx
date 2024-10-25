import { TodoItem } from '@/features/todos/components/TodoItem';
import { useCreateTodo, useTodos } from '@/features/todos/apis/hooks/useTodos.ts';

export const TodoList = () => {
  const { data: todos, isLoading, error } = useTodos();
  const createTodo = useCreateTodo();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <ul>{todos?.map((todo) => <TodoItem key={todo.id} todo={todo} />)}</ul>
      <button
        onClick={() => {
          createTodo.mutate({ title: 'Do Laundry' });
        }}
      >
        Add Todo
      </button>
    </div>
  );
};
