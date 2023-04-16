export enum FilterType {
  status = 1,
  category = 2,
  level = 3,
  date = 4,
}

export const FILTER_DROP_DOWN_MENU = [
  {
    name: '按任务状态',
    id: 1,
    field: 'status_id',
  },
  {
    name: '按任务类型',
    id: 2,
    field: 'tracker_id',
  },
  {
    name: '按优先级',
    id: 3,
    field: 'priority_id',
  },
];
