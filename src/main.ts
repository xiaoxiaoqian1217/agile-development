import { createApp } from 'vue';
import router from './router';
import App from './App.vue';
import { createPinia } from 'pinia';
import './style.css';
import 'virtual:windi.css';
const pinia = createPinia();

createApp(App)
  .use(router)
  .use(pinia)
  .mount('#app')
  .$nextTick(() => {
    postMessage({ payload: 'removeLoading' }, '*');
  });
