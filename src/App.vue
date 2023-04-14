<template>
  <router-view v-slot="{ Component }">
    <component :is="Component" />
  </router-view>
  <!-- <Button type="primary" @click="$router.back()">Go back</Button> -->
</template>
<script setup lang="ts">
  
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
