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
  import zhCN from 'ant-design-vue/es/locale/zh_CN';
  dayjs.locale('zh-cn');
</script>
