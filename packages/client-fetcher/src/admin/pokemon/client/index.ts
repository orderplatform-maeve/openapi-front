import { AxiosResponseTransformer } from 'axios';
import { getAdminApiUrl } from '../../utils/getAdminApiUrl';
import { BaseClient } from '../../../core/client';

/**
 * Data from BFF
 * 테스트 용 컴포넌트라 해당 파일에 type 지정
 *
 * 실제 개발 진행시에는 client-fetcher model 로 정의하여 api, client-fetcher, bff 에서
 * 하나의 응답 모델을 바라보게 해야함.
 */
type BasicInfo = {
  name: string;
  imageUrl: string;
  height: string;
  weight: string;
  typeNames: string[];
  abilityNames: string[];
};

type Skills = {
  names: string[];
};

class Client extends BaseClient {
  constructor() {
    const url = getAdminApiUrl();
    super(url);
  }

  private basePath = '/api/pokemon';

  getPokemonList = async () => {
    const { data } = await this.get<{ id: number; basicInfo: BasicInfo }[]>(this.basePath);
    return data;
  };

  getPokemonById = async (id: number) => {
    const { data } = await this.get<{ basicInfo: BasicInfo; skills: Skills }>(`${this.basePath}/${id}`);
    return data;
  };

  transformResponse?: AxiosResponseTransformer;
}

const AdminPokemonClient = new Client();
export { AdminPokemonClient };
