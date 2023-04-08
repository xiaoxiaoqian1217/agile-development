import Project from '../../views/project/index.vue';
import Task from '../../views/task/index.vue';
import AllTask from '../../views/all-task/index.vue';
import Test from '../../views/all-task/index.vue';

export default [
  {
    path: '/project/:projectId',
    name: 'project',
    component: Project,
    children: [
      {
        path: 'task',
        name: 'task',
        meta: {
          title: '任务',
          // parentRouteName: 'project',
        },
        component: Task,
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
      {
        path: 'test',
        name: 'test',
        meta: {
          title: '测试',
          // parentRouteName: 'project',
        },
        component: Test,
        // redirect: '/project/:projectId/task/allTask',
      },
    ],
  },
];
