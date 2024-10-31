import { useState } from 'react';
import { QUERY_KEYS } from '@torder/client-fetcher';
import { Admin } from '@torder/client-fetcher';
import { useQueryClient } from '@tanstack/react-query';
import { CreateTodoDto } from '@/api/todo/dto/todo.dto';

const TodoForm = () => {
  const queryClient = useQueryClient();
  const [todo, setTodo] = useState<CreateTodoDto>({ value: '' });
  const { mutateAsync } = Admin.AdminTodo.useAdminAddTodo();
  const addTodo = async () => {
    await mutateAsync(todo);
    await queryClient.invalidateQueries(QUERY_KEYS.ADMIN.TODO);
    /**
     * query 데이터 변경 두번째 방법
     * queryClient.setQueryData(['todos'], old => [...old, data]);
     *
     * 현재는 고정된 테스트 데이터라 setQueryData 사용하지 않음
     */
    setTodo({ value: '' });
  };

  return (
    <div>
      <h2>Todo 를 추가하세요.</h2>
      <input
        type={'text'}
        className={'border border-amber-950'}
        value={todo.value}
        onChange={(e) => setTodo({ value: e.target.value })}
      />
      <button className={'ml-4 p-1 border border-amber-950'} onClick={addTodo}>
        추가
      </button>
    </div>
  );
};

export default TodoForm;
