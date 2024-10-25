export type Todo = {
  id: number;
  title: string;
};

export type CreateTodoInput = Omit<Todo, 'id'>;
