import type { Todo } from '@/features/todos/apis/types/todo.type';

interface TodoItemProps {
  todo: Todo;
}

export const TodoItem = ({ todo }: TodoItemProps) => {
  return <li>{todo.title}</li>;
};
