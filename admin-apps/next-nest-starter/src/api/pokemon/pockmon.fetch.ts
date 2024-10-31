import { AxiosResponseTransformer } from 'axios';
import { BaseClient } from '@torder/client-fetcher/src/core/client';

class Pokemon extends BaseClient {
  constructor() {
    const url = 'https://pokeapi.co';
    super(url);
  }

  getList = async () => {
    const { data } = await this.get('/api/v2/pokemon', {
      params: {
        offset: 0,
        limit: 20,
      },
    });
    return data;
  };

  getById = async (id: number) => {
    const { data } = await this.get(`/api/v2/pokemon/${id}`);
    return data;
  };

  getSpeciesByPokemonId = async (id: number) => {
    const { data } = await this.get(`/api/v2/pokemon-species/${id}`);
    return data;
  };

  getTypeByName = async (name: string) => {
    const { data } = await this.get(`/api/v2/type/${name}`);
    return data;
  };

  getAbilityByName = async (name: string) => {
    const { data } = await this.get(`/api/v2/ability/${name}`);
    return data;
  };

  getMoveByName = async (name: string) => {
    const { data } = await this.get(`/api/v2/move/${name}`);
    return data;
  };

  transformResponse?: AxiosResponseTransformer;
}

const PokemonFetcher = new Pokemon();
export default PokemonFetcher;
