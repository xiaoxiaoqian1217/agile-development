export enum Status {
  new = 1,
  doing = 2,
  solve = 3,
  feedback = 4,
  close = 5,
  reject = 6,
  check = 7,
}

export interface TaskItem {
  author: number;
  description: string;
  id: number;
  priority: number;
  status: number;
  subject: string;
  tracker: number;
}
