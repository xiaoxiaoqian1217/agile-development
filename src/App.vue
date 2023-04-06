<template>
  <router-view v-slot="{ Component }">
    <component :is="Component" />
  </router-view>
  <Button type="primary" @click="$router.back()">Go back</Button>
</template>
<script setup lang="ts">
  import { Tabs, TabPane, Button } from 'ant-design-vue';
</script>
