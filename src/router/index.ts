import { createRouter, createWebHistory } from 'vue-router';
import { BasicLayout } from '../layouts';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'layout',
      component: BasicLayout,
    },
  ],
});

export default router;
