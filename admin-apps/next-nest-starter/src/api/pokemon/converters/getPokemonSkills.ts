// @ts-ignore
const getPokemonSkills = ({ skills }) => {
  // @ts-ignore
  const names = skills.map((skill) => {
    // @ts-ignore
    const koreanSkill = skill.names.find((name) => name.language.name === 'ko');
    if (koreanSkill) {
      return koreanSkill.name;
    }

    // @ts-ignore
    const enSkill = skill.names.find((name) => name.language.name === 'en');
    return enSkill.name;
  });

  return {
    skills: {
      names,
    },
  };
};

export default getPokemonSkills;
