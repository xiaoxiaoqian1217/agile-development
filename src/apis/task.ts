import { httpClient } from '../utils/http-client';

export const getTaskList = (params: any) => httpClient.post('/api/issue/list', { ...params });
