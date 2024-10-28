import { createLazyFileRoute } from '@tanstack/react-router';
import { TodoList } from '@/features/todos/components/TodoList';

export const Route = createLazyFileRoute('/todo/')({
  component: () => <TodoList />,
});
