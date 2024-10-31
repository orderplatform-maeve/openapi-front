import { Module } from '@nestjs/common';
import { TodoModule } from '@/api/todo/todo.module';
import { PokemonModule } from '@/api/pokemon/pokemon.module';

@Module({
  imports: [TodoModule, PokemonModule],
})
export class ApiModule {}
