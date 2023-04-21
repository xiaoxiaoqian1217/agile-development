<template>
  <ConfigProvider :locale="zhCN">
    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
  </ConfigProvider>
  <!-- <Button type="primary" @click="$router.back()">Go back</Button> -->
</template>
<script setup lang="ts">
  import { ConfigProvider } from 'ant-design-vue';
  import dayjs from 'dayjs';
  import 'dayjs/locale/zh-cn';
  import weekday from 'dayjs/plugin/weekday';
  import zhCN from 'ant-design-vue/es/locale/zh_CN';
  dayjs.extend(weekday);
  dayjs.locale('zhCN');
  console.log('dayjs.localeData()', dayjs().weekday());
  // import { Tabs, TabPane, Button } from 'ant-design-vue';
  // import { loginIn } from './apis';
  // import { useUserStore } from './stores';
  // const store = useUserStore();
  // import { onMounted } from 'vue';

  // const login = async () => {
  //   const loginResp = await loginIn({
  //     username: 'xiaoqian',
  //     password: 'password',
  //   });

  //   useLocalStorage('token', loginResp?.data?.token);

  //   store.setToken(loginResp?.data?.token);
  // };
  // onMounted(() => {
  //   login();
  // });
</script>
