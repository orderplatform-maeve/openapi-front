/**
 * Data from BFF
 * 테스트 용 컴포넌트라 해당 파일에 type 지정
 *
 * 실제 개발 진행시에는 client-fetcher model 로 정의하여 api, client-fetcher, bff 에서
 * 하나의 응답 모델을 바라보게 해야함.
 */
type Props = {
  names: string[];
};

const PokemonSkills = ({ names }: Props) => {
  return (
    <div>
      <p>기술</p>
      <ul className={'grid grid-cols-8 gap-2 list-disc ml-5'}>
        {names.map((name, i) => (
          <li key={i}>{name}</li>
        ))}
      </ul>
    </div>
  );
};

export default PokemonSkills;
