import type { AxiosResponse } from 'axios';
import { UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import type { LoginVariables, LoginResponse } from '../client';
import { Client } from '../../rest';
import { QUERY_KEYS } from '../../core/query-keys';
import { useClientMutation } from '../../core/hooks/useClientMutation';

type TOptions = UseMutationOptions<AxiosResponse<LoginResponse>, Error, LoginVariables>;
type RLogin = UseMutationResult<AxiosResponse<LoginResponse>, Error, LoginVariables>;

export function useLoginApi(options?: TOptions): RLogin {
  return useClientMutation(QUERY_KEYS.REST.LOGIN, Client.memberLogin, { ...options });
}
