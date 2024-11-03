import { IAdminTodo } from '@torder/client-fetcher/src/admin/todo/model';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { TodoService } from '@/api/todo/todo.service.ts';
import { CreateTodoDto } from '@/api/todo/dto/todo.dto.ts';

@Controller('todo')
export class TodoController {
  constructor(private todoService: TodoService) {}

  @Get()
  async findAll(): Promise<IAdminTodo[]> {
    return this.todoService.findAll();
  }

  @Post()
  async create(@Body('data') creatTodoDto: CreateTodoDto): Promise<IAdminTodo[]> {
    return this.todoService.create(creatTodoDto);
  }
}
