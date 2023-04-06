import Project from '../../views/project/index.vue';
import Task from '../../views/task/index.vue';
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
        },
        component: Task,
      },
    ],
  },
];
