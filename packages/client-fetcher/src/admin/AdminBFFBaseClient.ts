import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosRequestHeaders,
  AxiosResponseTransformer,
  InternalAxiosRequestConfig,
} from 'axios';
import { BaseClient } from '../core/client';

/**
 * 관리자 BFF 에서 API 호출 용도의 BaseClient
 * - interceptor 를 통해 모든 API 요청 헤더에 jwt 를 삽입한다.
 */

class AdminBFFBaseClient extends BaseClient {
  protected readonly jwt: string;
  public constructor({
    baseURL,
    jwt,
    defaultConfig = {
      timeout: 0, // 관리자는 기본 timeout 사용하지 않음
    },
  }: {
    baseURL: string;
    jwt: string;
    defaultConfig?: AxiosRequestConfig;
  }) {
    const axiosInstance = axios.create({
      baseURL,
      withCredentials: true,
    });
    super(baseURL, defaultConfig, axiosInstance);
    this.jwt = jwt;
    this._initializeRequestInterceptor();
  }

  private _initializeRequestInterceptor = () => {
    this.instance.interceptors.request.use(this._handleRequest, this._handleError);
  };

  private _handleRequest = (config: InternalAxiosRequestConfig) => {
    config.headers = {
      ...(config.headers || {}),
      Authorization: `Bearer ${this.jwt}`,
    } as AxiosRequestHeaders;
    return config;
  };

  private _handleError = (err: AxiosError) => {
    return Promise.reject(err);
  };

  transformResponse?: AxiosResponseTransformer;
}

export { AdminBFFBaseClient };
