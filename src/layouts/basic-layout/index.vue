<template>
  <!-- <div class="h-full"> -->
  <router-view v-slot="{ Component }">
    <component :is="Component" />
  </router-view>
  <!-- </div> -->
</template>

<script setup lang="ts">
  import { onMounted } from 'vue';
  // import { loginIn } from '../../apis';
  // onMounted(() => {
  //   login();
  // });
  // const login = async () => {
  //   const loginResp = await loginIn({
  //     username: 'xiaoqian',
  //     password: 'password',
  //   });
  // };
</script>

<style scoped></style>
