import { UserItem, Users } from '../types';
import { httpClient } from '../utils/http-client';
import { ApiResult } from './apis.d';

export const getProjectList = async (params: any): Promise<ApiResult<any>> =>
  await httpClient.post('/api/projects', params);
export const getMembers = async (params: any): Promise<ApiResult<UserItem[]>> =>
  await httpClient.post('/api/users', params);

//目标版本
export const fetchVersion = async (params: any): Promise<ApiResult<UserItem[]>> =>
  await httpClient.post('/api/project/version', params);
