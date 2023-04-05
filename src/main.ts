import { createApp } from 'vue';
import router from './router';
import App from './App.vue';
import 'virtual:windi.css'
import './samples/node-api';
import './style.css';

createApp(App)
  .use(router)
  .mount('#app')
  .$nextTick(() => {
    postMessage({ payload: 'removeLoading' }, '*');
  });
