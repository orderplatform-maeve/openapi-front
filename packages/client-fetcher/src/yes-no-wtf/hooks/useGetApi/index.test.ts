import { describe, expect, test } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { Providers } from '../../../core/for-test/Providers';
import { useGetApi } from './index';

describe('yesNoWtf', () => {
  test('useGetApi', async () => {
    const { result } = renderHook(() => useGetApi(), { wrapper: Providers });
    await waitFor(() => expect(result.current.isSuccess).toBe(true), { timeout: 5000, interval: 1000 });
    expect(result.current.data?.['data'].answer).oneOf(['yes', 'no']);
    expect(result.current.data?.['data'].message).toBe('참 잘했어요');
  });
});
