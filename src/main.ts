import { createApp } from 'vue';
import router from './router';
import App from './App.vue';
import { createPinia } from 'pinia';
import 'virtual:windi.css';
import './style.css';
import './assets/font/font_4019906_v7124okdz2/iconfont.css';
import 'virtual:windi.css';
const pinia = createPinia();

createApp(App)
  .use(router)
  .use(pinia)
  .mount('#app')
  .$nextTick(() => {
    postMessage({ payload: 'removeLoading' }, '*');
  });
