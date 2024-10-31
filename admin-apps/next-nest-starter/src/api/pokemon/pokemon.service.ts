import { Injectable } from '@nestjs/common';
import PokemonFetcher from '@/api/pokemon/pockmon.fetch';
import { convertPokemonDetail, converterPokemonList } from '@/api/pokemon/converters';

@Injectable()
export class PokemonService {
  private async getCommonData(id: number) {
    const [detail, species] = await Promise.all([PokemonFetcher.getById(id), PokemonFetcher.getSpeciesByPokemonId(id)]);
    // @ts-ignore
    const types = await Promise.all(detail.types.map(({ type }) => PokemonFetcher.getTypeByName(type.name)));
    // @ts-ignore
    const abilities = await Promise.all(
      // @ts-ignore
      detail.abilities.map(({ ability }) => PokemonFetcher.getAbilityByName(ability.name)),
    );

    return { detail, species, types, abilities };
  }

  async findAll() {
    const data = await PokemonFetcher.getList();

    return Promise.all(
      // @ts-ignore
      data.results.map(async ({ url }) => {
        const id = url.match(/\/pokemon\/(\d+)\//)[1];
        const commonData = await this.getCommonData(+id);
        return converterPokemonList({ ...commonData, id });
      }),
    );
  }

  async findById(id: number) {
    const commonData = await this.getCommonData(id);
    const skills = await Promise.all(
      // @ts-ignore
      commonData.detail.moves.map(({ move }) => PokemonFetcher.getMoveByName(move.name)),
    );

    return convertPokemonDetail({ ...commonData, skills });
  }
}
