import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosResponseTransformer } from 'axios';

abstract class BaseClient {
  private defaultConfig: AxiosRequestConfig = {
    timeout: 5000,
  };
  protected readonly instance: AxiosInstance;

  /**
   *
   * @param url 접근 경로
   * @param defaultConfig 기본 axios 설정 값
   * @param axiosInstance axios instance
   */
  protected constructor(
    private url: string,
    defaultConfig: AxiosRequestConfig = {
      timeout: 5000, // 기본 timeout
    },
    axiosInstance?: AxiosInstance,
  ) {
    this.instance =
      axiosInstance ||
      axios.create({
        baseURL: url,
      });
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

  get = <T, D = unknown>(path: string, axiosConfig?: AxiosRequestConfig<D>) => {
    const apiEndpoint = this.getPath(path);
    return this.instance.get<T, AxiosResponse<T>>(apiEndpoint, this.mergeConfig<D>(axiosConfig));
  };

  post = <T, D = unknown>(path: string, data: D, axiosConfig?: AxiosRequestConfig<D>) => {
    const apiEndpoint = this.getPath(path);
    return this.instance.post<T, AxiosResponse<T>>(apiEndpoint, data, this.mergeConfig(axiosConfig));
  };

  delete = <T, D = unknown>(path: string, axiosConfig?: AxiosRequestConfig<D>) => {
    const apiEndpoint = this.getPath(path);
    return this.instance.delete<T, AxiosResponse<T>>(apiEndpoint, this.mergeConfig<D>(axiosConfig));
  };

  put = <T, D = unknown>(path: string, data: D, axiosConfig?: AxiosRequestConfig<D>) => {
    const apiEndpoint = this.getPath(path);
    return this.instance.put<T, AxiosResponse<T>>(apiEndpoint, data, this.mergeConfig(axiosConfig));
  };

  /* 응답 정규화 */
  abstract transformResponse?: AxiosResponseTransformer;
}

export { BaseClient };
