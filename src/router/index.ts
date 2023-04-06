import { createRouter, createWebHistory } from 'vue-router';
import { BasicLayout } from '../layouts';
import Home from '../views/home/index.vue';
import bussinessRoutes from './modules';
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'basic-layout',
      component: BasicLayout,
      redirect: '/home',
      children: [
        {
          path: 'home',
          name: 'home',
          component: Home,
        },
        ...bussinessRoutes,
      ],
    },
  ],
});

export default router;
