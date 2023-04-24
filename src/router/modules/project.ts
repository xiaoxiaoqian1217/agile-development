import Project from '../../views/project/index.vue';
import Task from '../../views/task/index.vue';
import TaskView from '../../views/task-view/index.vue';

export default [
  {
    path: '/project/:projectId',
    name: 'project',
    component: Project,
    meta: {
      title: '项目',
    },
    children: [
      {
        path: 'task/:viewId?',
        name: 'task',
        meta: {
          title: '项目',
        },
        component: Task,
        children: [
          {
            path: 'taskView',
            name: 'allTask',
            meta: {
              title: '所有任务',
              // parentRouteName: 'project',
            },
            component: TaskView,
          },
        ],
      },
    ],
  },
];
