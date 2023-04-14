export const SIDER_MENU = [
  {
    name: '所有任务',
    id: 1,
    tag: 'all',
  },
  {
    name: '我创建的',
    id: 2,
    tag: 'author',
  },
  {
    name: '我执行的',
    id: 3,
    tag: 'assigned_to_id',
  },
];
export type SideMenuItem = (typeof SIDER_MENU)[0];
