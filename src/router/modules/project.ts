import Project from '../../views/project/index.vue';
import Task from '../../views/task/index.vue';
import AllTask from '../../views/all-task/index.vue';

export default [
  {
    path: '/project/:projectId',
    name: 'project',
    component: Project,
    // redirect: '/project/:projectId/task',
    children: [
      {
        path: 'task',
        name: 'task',
        meta: {
          title: '任务',
          // parentRouteName: 'project',
        },
        component: Task,
        // redirect: '/project/:projectId/task/allTask',
        children: [
          {
            path: 'allTask',
            name: 'allTask',
            meta: {
              title: '所有任务',
              // parentRouteName: 'project',
            },
            component: AllTask,
          },
        ],
      },
    ],
  },
];
