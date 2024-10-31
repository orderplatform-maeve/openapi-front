import { IAdminTodo } from '@torder/client-fetcher/src/admin/todo/model';
import { ApiBody } from '@nestjs/swagger';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { TodoService } from '@/api/todo/todo.service';
import { CreateTodoDto, CreateTodoDtoData } from '@/api/todo/dto/todo.dto';

@Controller('todo')
export class TodoController {
  constructor(private todoService: TodoService) {}

  @Get()
  async findAll(): Promise<IAdminTodo[]> {
    return this.todoService.findAll();
  }

  @ApiBody({
    description: '작업 추가',
    type: CreateTodoDtoData,
  })
  @Post()
  async create(@Body('data') creatTodoDto: CreateTodoDto): Promise<IAdminTodo[]> {
    return this.todoService.create(creatTodoDto);
  }
}
