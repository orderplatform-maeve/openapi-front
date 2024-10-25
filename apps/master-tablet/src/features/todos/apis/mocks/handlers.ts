import { http, HttpResponse } from 'msw';
import { Todo } from '@/features/todos/apis/types/todo.type.ts';

const API_URL = 'https://example.com/user';

const todos: Todo[] = [
  { id: 1, title: 'Learn React Query' },
  { id: 2, title: 'Build an awesome app' },
];

export const sampleHandlers = [
  // Intercept "GET https://example.com/user" requests...
  http.get(`${API_URL}/todos`, () => {
    return HttpResponse.json(todos);
  }),

  http.post<Omit<Todo, 'id'>>(`${API_URL}/todos`, async ({ request }) => {
    const { title } = (await request.json()) as Omit<Todo, 'id'>;
    const newTodo: Todo = { id: Date.now(), title };
    todos.push(newTodo);
    return HttpResponse.json(newTodo, { status: 201 });
  }),
];
