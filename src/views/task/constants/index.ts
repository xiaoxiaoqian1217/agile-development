import { Level, Status } from '@/types/index';
export * from './filter-types';
export * from './sider-menu';

export const LevelType = {
  [Level.low]: 'default',
  [Level.default]: 'processing',
  [Level.high]: 'success',
  [Level.urgent]: 'warning',
  [Level.rightNow]: 'error',
};

export const StatusColor = {
  [Status.new]: 'default',
  [Status.doing]: 'processing',
  [Status.check]: 'processing',
  [Status.close]: 'success',
  [Status.feedback]: 'success',
  [Status.reject]: 'warning',
};
