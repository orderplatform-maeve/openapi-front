import type { AxiosResponse } from 'axios';
import { UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import type { LoginVariables, LoginResponse } from '../client';
import { Client } from '../../rest';
import { QUERY_KEYS } from '../../core/query-keys';
import { useClientMutation } from '../../core/hooks/useClientMutation';

type TOptions = UseMutationOptions<AxiosResponse<LoginResponse>, unknown, LoginVariables>;
type RLogin = UseMutationResult<AxiosResponse<LoginResponse>, unknown, LoginVariables>;

export function useLoginApi(options?: TOptions): RLogin {
  return useClientMutation({
    ...options,
    mutationKey: QUERY_KEYS.REST.LOGIN,
    mutationFn: Client.memberLogin,
  });
}
