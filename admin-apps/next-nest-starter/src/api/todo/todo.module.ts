import { Module } from '@nestjs/common';
import { TodoService } from '@/api/todo/todo.service';
import { TodoController } from '@/api/todo/todo.controller';

@Module({
  controllers: [TodoController],
  providers: [TodoService],
})
export class TodoModule {}
