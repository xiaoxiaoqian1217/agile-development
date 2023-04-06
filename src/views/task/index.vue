<template>
  <div class="flex h-full">
    <!-- 侧栏 -->
    <div class="w-300px task-sidebar">
      <div class="flex py-2.5 px-4 justify-between"><span>视图</span></div>
      <div class="flex py-2.5 px-4">
        <span class="mr-2"><UnorderedListOutlined /></span><span>所有任务</span>
      </div>
    </div>
    <div class="flex flex-auto bg-gray-100">
      <router-view v-slot="{ Component }">
        <component :is="Component" />
      </router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { UnorderedListOutlined } from '@ant-design/icons-vue';
</script>

<style scoped>
  .task-sidebar {
    box-shadow: 0px 10px 24px rgba(0, 0, 0, 0.1);
  }
</style>
