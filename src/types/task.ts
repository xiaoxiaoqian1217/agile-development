export enum Status {
  new = 1,
  doing = 2,
  solve = 3,
  feedback = 4, // 反馈
  close = 5,
  reject = 6, // 已拒绝
  check = 7, // 待查验
}
export enum Level {
  low = 1,
  default = 2,
  high = 3,
  urgent = 4,
  rightNow = 5,
}
// 任务类型
export enum TrackerType {
  error = 1,
  feature = 2,
  support = 3,
  localization = 4,
}

export enum Color {
  default = 'default',
  processing = 'processing',
  success = 'success',
  warning = 'warning',
  error = 'error',
}
export type SidePanelMapType = 'author' | 'assigned_to_id' | 'all';
// export enum PanelMenuType {
//   all = 'all',
//   processing = 'author',
//   success = 'success',
//   warning = 'warning',
//   error = 'error',
// }

// export interface TaskItem {
//   author: number;
//   description: string;
//   id: number;
//   priority_id: number;
//   status: number;
//   subject: string;
//   tracker: number;
//   assigned_to_id: number;

// }

export enum FilterTypeField {
  status_id = 'status_id', // 状态
  tracker_id = 'tracker_id', //任务类型
  priority_id = 'priority_id', // 优先级
  start_date = 'start_date', // 开始日期
  due_date = 'due_date', //  预期完成时间
  fixed_version_id = 'fixed_version_id', // 迭代
  category_id = 'category_id',
  assigned_to_id = 'assigned_to_id',
  author = 'author',
}

export interface FieldItem {
  id: number;
  name: string;
}
export interface TaskItem {
  author: string;
  description: string;
  id: number;
  subject: string;
  tracker_id: number;
  status_id: number;
  priority_id: number;
  category_id: string;
  fixed_version_id: number | string;
  is_private: number;
  assigned_to_id: string;
  estimated_hours: string;
  done_ratio: string;
  start_date: undefined;
  due_date: undefined;
  watcher_user_ids: string;
  parent_issue_id: string;
}
