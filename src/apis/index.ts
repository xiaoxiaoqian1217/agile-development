import { httpClient } from '../utils/http-client';
export * from './task';
export * from './project';
export const loginIn = (params: any) => httpClient.post('/api/login', { username: 'xiaoqian', password: 'xiaoqian' });
