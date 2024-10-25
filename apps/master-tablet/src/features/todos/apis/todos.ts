import axios from 'axios';
import { CreateTodoInput, Todo } from '@/features/todos/apis/types/todo.type.ts';

const API_URL = 'https://example.com/user';

export const getTodos = async (): Promise<Todo[]> => {
  const response = await axios.get<Todo[]>(`${API_URL}/todos`);
  return response.data as Todo[];
};

export const postTodo = async (newTodo: CreateTodoInput): Promise<Todo> => {
  const response = await axios.post<Todo>(`${API_URL}/todos`, newTodo);
  return response.data as Todo;
};
