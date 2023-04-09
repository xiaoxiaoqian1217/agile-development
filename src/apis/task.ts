import { httpClient } from '../utils/http-client';
import { ApiResult } from './apis.d';

export const getTaskList = async (params: any): Promise<ApiResult<any>> =>
  httpClient.post('/api/issue/list', { ...params });

// 任务状态类型
export const getTaskStatusTypes = async (params: any): Promise<ApiResult<any>> =>
  httpClient.post('/api/issue/status', { ...params });
