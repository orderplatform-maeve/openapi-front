import { describe, it, expect } from 'vitest';
import { hasOrderAdminApiResponseData, TOrderAdminApiResponse } from '@/api/api.type';

describe('isSuccessfulResponse 테스트', () => {
  it('code가 200이고 data가 존재할 때, true를 반환해야 한다', () => {
    const response: TOrderAdminApiResponse<{ id: number }> = {
      result: true,
      code: 200,
      data: { id: 1 },
    };

    const result = hasOrderAdminApiResponseData(response);
    expect(result).toBe(true);
    expect(response.data).toBeDefined();
  });

  it('code가 200이 아니면 false를 반환해야 한다', () => {
    const response: TOrderAdminApiResponse<{ id: number }> = {
      result: false,
      code: 404,
      message: 'Not Found',
    };

    const result = hasOrderAdminApiResponseData(response);
    expect(result).toBe(false);
  });

  it('code가 200이지만 data가 없으면 false를 반환해야 한다', () => {
    const response: TOrderAdminApiResponse<{ id: number }> = {
      result: true,
      code: 200,
      message: 'Data missing',
    };

    const result = hasOrderAdminApiResponseData(response);
    expect(result).toBe(false);
  });
});
