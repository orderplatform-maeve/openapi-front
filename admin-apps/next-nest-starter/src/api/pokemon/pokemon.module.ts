import { Module } from '@nestjs/common';
import { PokemonService } from '@/api/pokemon/pokemon.service';
import { PokemonController } from '@/api/pokemon/pokemon.controller';

@Module({
  controllers: [PokemonController],
  providers: [PokemonService],
})
export class PokemonModule {}
