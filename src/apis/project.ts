import { httpClient } from '../utils/http-client';
export const getProjectList = (params: any) => httpClient.post('/api/projects', params);
export const getMembers = (params: any) => httpClient.post('/api/users', params);
