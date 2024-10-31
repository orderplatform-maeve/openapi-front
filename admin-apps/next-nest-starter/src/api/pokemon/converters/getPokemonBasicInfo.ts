// @ts-ignore
const getPokemonBasicInfo = ({ detail, species, types, abilities }) => {
  // @ts-ignore
  const koreanName = species.names.find((name) => name.language.name === 'ko');
  const name = koreanName?.name ?? '';

  // @ts-ignore
  const typeNames = types.map((type) => {
    // @ts-ignore
    const koreanType = type.names.find((name) => name.language.name === 'ko');
    return koreanType.name;
  });

  // @ts-ignore
  const abilityNames = abilities.map((ability) => {
    // @ts-ignore
    const koreanType = ability.names.find((name) => name.language.name === 'ko');
    return koreanType.name;
  });
  return {
    basicInfo: {
      name,
      height: detail.height,
      weight: detail.weight,
      imageUrl: detail.sprites.front_default,
      typeNames,
      abilityNames,
    },
  };
};

export default getPokemonBasicInfo;
