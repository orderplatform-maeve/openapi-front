import { IAdminTodo } from '@torder/client-fetcher/src/admin/todo/model';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TodoService {
  private readonly todoList: IAdminTodo[] = [{ value: '집가기' }, { value: '운동' }, { value: '회식' }];

  create(todo: IAdminTodo) {
    this.todoList.push(todo);
    return this.findAll();
  }

  findAll(): IAdminTodo[] {
    return this.todoList;
  }
}
