import getPokemonSkills from '@/api/pokemon/converters/getPokemonSkills';
import getPokemonBasicInfo from '@/api/pokemon/converters/getPokemonBasicInfo';

// @ts-ignore
export const convertPokemonDetail = (data) => {
  return {
    ...getPokemonBasicInfo(data),
    ...getPokemonSkills(data),
  };
};

// @ts-ignore
export const converterPokemonList = (data) => {
  return {
    id: data.id,
    ...getPokemonBasicInfo(data),
  };
};
