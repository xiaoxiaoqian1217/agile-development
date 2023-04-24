import { createRouter, createWebHistory } from 'vue-router';
import { BasicLayout } from '../layouts';
import Login from '../views/login/index.vue';
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
      meta: {
        title: '首页',
      },
      children: [
        {
          path: 'home',
          name: 'home',
          component: Home,
        },
        ...bussinessRoutes,
      ],
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
  ],
});
router.beforeEach(async (to, from, next) => {
  document.title = to.meta.title;
  if (
    // 检查用户是否已登录
    !sessionStorage.getItem('token') &&
    // ❗️ 避免无限重定向
    to.name !== 'login'
  ) {
    // 将用户重定向到登录页面
    next({ name: 'login' });
  } else next();
  // next();
});
export default router;
