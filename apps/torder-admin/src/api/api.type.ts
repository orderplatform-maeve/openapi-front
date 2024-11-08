export type TOrderAdminApiResponse<T> = {
  result: boolean;
  code: number;
  message?: string;
  msg?: string;
  data?: T;
};

type TOrderAdminApiSuccessResponse<T> = TOrderAdminApiResponse<T> & { code: 200; data: T };

export const hasOrderAdminApiResponseData = <T>(
  response: TOrderAdminApiResponse<T>,
): response is TOrderAdminApiSuccessResponse<T> => {
  return response.code === 200 && response.data !== undefined;
};
