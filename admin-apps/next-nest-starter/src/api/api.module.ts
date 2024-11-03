import { Module } from '@nestjs/common';
import { TodoModule } from '@/api/todo/todo.module';

@Module({
  imports: [TodoModule],
})
export class ApiModule {}
