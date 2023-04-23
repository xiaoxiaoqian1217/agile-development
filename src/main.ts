import { createApp } from 'vue';
import { createPinia } from 'pinia';
import Antd from 'ant-design-vue';

import router from './router';
import App from './App.vue';
import './assets/font/iconfont.css';
import 'ant-design-vue/dist/antd.css';
import './style.css';
import 'virtual:windi.css';
const pinia = createPinia();

createApp(App)
  .use(Antd)
  .use(router)
  .use(pinia)
  .mount('#app')
  .$nextTick(() => {
    postMessage({ payload: 'removeLoading' }, '*');
  });
