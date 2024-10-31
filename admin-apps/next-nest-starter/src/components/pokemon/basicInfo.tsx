/**
 * Data from BFF
 * 테스트 용 컴포넌트라 해당 파일에 type 지정
 *
 * 실제 개발 진행시에는 client-fetcher model 로 정의하여 api, client-fetcher, bff 에서
 * 하나의 응답 모델을 바라보게 해야함.
 */
type Props = {
  name: string;
  imageUrl: string;
  height: string;
  weight: string;
  typeNames: string[];
  abilityNames: string[];
};

const PokemonBasicInfo = ({ name, imageUrl, height, weight, typeNames, abilityNames }: Props) => {
  return (
    <div>
      <h2>{name}</h2>
      <img className={'w-40 h-40'} alt={'이미지'} src={imageUrl} />
      <p>키: {height}</p>
      <p>무게: {weight}</p>
      <p>속성</p>
      <ul className={'list-disc ml-5'}>
        {typeNames.map((type, i) => (
          <li key={i}>{type}</li>
        ))}
      </ul>
      <p>특성</p>
      <ul className={'list-disc ml-5'}>
        {abilityNames.map((type, i) => (
          <li key={i}>{type}</li>
        ))}
      </ul>
    </div>
  );
};

export default PokemonBasicInfo;
