import Project from '../../views/project/index.vue';
import Task from '../../views/task/index.vue';
import TaskView from '../../views/task-view/index.vue';

export default [
  {
    path: '/project/:projectId',
    name: 'project',
    component: Project,
    children: [
      {
        path: 'task/:viewId?',
        name: 'task',
        meta: {
          title: '任务',
          // parentRouteName: 'project',
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
      // {
      //   path: 'test',
      //   name: 'test',
      //   meta: {
      //     title: '测试',
      //     // parentRouteName: 'project',
      //   },
      //   component: Test,
      //   // redirect: '/project/:projectId/task/allTask',
      // },
    ],
  },
];
