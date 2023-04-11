import { httpClient } from '../utils/http-client';
import { ApiResult } from './apis.d';

export const loginIn = async (params: any): Promise<ApiResult<any>> =>
  await httpClient.post('/api/login', { username: 'xiaoqian', password: 'xiaoqian' });

export * from './task';
export * from './project';
