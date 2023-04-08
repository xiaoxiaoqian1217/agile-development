import { User } from '../types';
import { httpClient } from '../utils/http-client';
import { ApiResult } from './apis.d';

export const getProjectList = async (params: any): Promise<ApiResult<any>> =>
  await httpClient.post('/api/projects', params);
export const getMembers = async (params: any): Promise<ApiResult<User[]>> =>
  await httpClient.post('/api/users', params);
