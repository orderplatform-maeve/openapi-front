import { useMutation, useQuery } from '@tanstack/react-query';
import { CreateTodoInput, Todo } from '@/features/todos/apis/types/todo.type.ts';
import { getTodos, postTodo } from '@/features/todos/apis/todos.ts';
import { queryClient } from '@/configs/reactQuery.ts';

export const useTodos = () => {
  return useQuery<Todo[], Error>({
    queryKey: ['todos'],
    queryFn: getTodos,
  });
};

export const useCreateTodo = () => {
  return useMutation<Todo, Error, CreateTodoInput>({
    mutationFn: postTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });
};
