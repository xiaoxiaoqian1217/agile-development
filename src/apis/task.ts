import { httpClient } from '../utils/http-client';
import { ApiResult } from './apis.d';

export const getTaskList = async (params: any): Promise<ApiResult<any>> =>
  httpClient.post('/api/issue/list', { ...params });

// 任务状态类型
export const getTaskStatusTypes = async (params: any): Promise<ApiResult<any>> =>
  httpClient.post('/api/issue/status', { ...params });

// 查询任务类型
export const fetchTrackerTypes = async (params: any): Promise<ApiResult<any>> =>
  httpClient.post('/api/tracker', { ...params });

// 查询任务优先级
export const fetchTaskLevel = async (params: any): Promise<ApiResult<any>> =>
  httpClient.post('/api/priority', { ...params });
