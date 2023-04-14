export enum Status {
  new = 1,
  doing = 2,
  solve = 3,
  feedback = 4,
  close = 5,
  reject = 6,
  check = 7,
}
export enum Level {
  low = 1,
  default = 2,
  high = 3,
  urgent = 4,
  rightNow = 5,
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
export interface TaskItem {
  author: number;
  description: string;
  id: number;
  priority: number;
  status: number;
  subject: string;
  tracker: number;
  assigned_to_id: number;
}
