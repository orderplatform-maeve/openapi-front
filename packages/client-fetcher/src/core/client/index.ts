import axios, { AxiosRequestConfig, AxiosResponse, AxiosResponseTransformer } from 'axios';

abstract class BaseClient {
  private defaultConfig: AxiosRequestConfig = {
    timeout: 5000,
  };

  /**
   *
   * @param url 접근 경로
   * @param defaultConfig 기본 axios 설정 값
   */
  protected constructor(
    private url: string,
    defaultConfig: AxiosRequestConfig = {
      timeout: 5000, // 기본 timeout
    },
  ) {
    this.defaultConfig = {
      ...this.defaultConfig,
      ...defaultConfig,
    };
  }

  private getPath = (path: string) => {
    const url = new URL(this.url);
    url.pathname = path;
    return url.toString();
  };

  private mergeConfig = <D>(requestConfig?: AxiosRequestConfig<D>): AxiosRequestConfig<D> => {
    return {
      ...this.defaultConfig,
      transformResponse: this.transformResponse,
      ...(requestConfig || {}),
    };
  };

  get = <D>(path: string, axiosConfig?: AxiosRequestConfig<D>) => {
    const apiEndpoint = this.getPath(path);
    return axios.get<D, AxiosResponse<D>>(apiEndpoint, this.mergeConfig<D>(axiosConfig));
  };

  post = <D>(path: string, axiosConfig?: AxiosRequestConfig<D>) => {
    const apiEndpoint = this.getPath(path);
    return axios.post<D, AxiosResponse<D>>(apiEndpoint, this.mergeConfig(axiosConfig));
  };

  delete = <D>(path: string, axiosConfig?: AxiosRequestConfig<D>) => {
    const apiEndpoint = this.getPath(path);
    return axios.delete<D, AxiosResponse<D>>(apiEndpoint, this.mergeConfig(axiosConfig));
  };

  put = <D>(path: string, axiosConfig?: AxiosRequestConfig<D>) => {
    const apiEndpoint = this.getPath(path);
    return axios.put<D, AxiosResponse<D>>(apiEndpoint, this.mergeConfig(axiosConfig));
  };

  /* 응답 정규화 */
  abstract transformResponse?: AxiosResponseTransformer;
}

export { BaseClient };
