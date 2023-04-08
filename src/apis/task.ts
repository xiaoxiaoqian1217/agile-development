import { httpClient } from '../utils/http-client';
import { ApiResult } from './apis.d';

export const getTaskList = async (params: any): Promise<ApiResult<any>> =>
  httpClient.post('/api/issue/list', { ...params });
