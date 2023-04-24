import { httpClient } from '../utils/http-client';
import { ApiResult } from './apis.d';

export const loginIn = async (params: any): Promise<ApiResult<any>> =>
  await httpClient.post('/api/login', { ...params });

export * from './task';
export * from './project';
