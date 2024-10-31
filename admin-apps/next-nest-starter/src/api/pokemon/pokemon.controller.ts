import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { PokemonService } from '@/api/pokemon/pokemon.service';

@Controller('pokemon')
export class PokemonController {
  constructor(private pokemonService: PokemonService) {}

  @Get()
  async findAll() {
    return this.pokemonService.findAll();
  }

  @Get(':id')
  async findByName(@Param('id', ParseIntPipe) id: number) {
    return this.pokemonService.findById(id);
  }
}
