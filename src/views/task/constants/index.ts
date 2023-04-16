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

const SELECT_OPTIONS_GROUP = [
  {
    label: '优先级',
    id: 1,
    field: 'status_id',
  },
  {
    label: '任务状态',
    id: 2,
    field: 'status_id',
  },
  {
    label: '任务类型',
    id: 3,
    field: 'tracker_id',
  },
  {
    label: '迭代',
    id: 4,
    field: 'fixed_version_id',
  },
  {
    label: '成员',
    id: 5,
    fields: ['assigned_to_id', 'author'],
  },
  {
    label: '时间',
    id: 6,
    tag: ['start_date', 'endDate'],
  },
];
