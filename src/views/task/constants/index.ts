import { Level } from '@/types/index';
export * from './filter-types';
export * from './sider-menu';

export const LevelType = {
  [Level.low]: 'default',
  [Level.default]: 'processing',
  [Level.high]: 'success',
  [Level.urgent]: 'warning',
  [Level.rightNow]: 'error',
};
