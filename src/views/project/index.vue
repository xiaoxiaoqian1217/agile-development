<template>
  <div>
    <!--global-header -->
    <div class="divide-y divide-gray-500 divide-opacity-10">
      <div class="global-nav flex h-48px px-24px py-12px">
        <!-- left -->
        <div class="">
          <div></div>
          <div>
            <div class="inline-block">独立应用</div>
            <span class="ml-3"> <ExclamationCircleOutlined /> </span>
            <span class="ml-3"> <StarOutlined /> </span>
          </div>
        </div>
        <!-- right -->
        <div class="ml-auto">
          <span class="user"><UserOutlined /></span>
        </div>
      </div>
      <!-- 工具栏 -->
      <div class="tool-bar flex h-48px px-24px py-12px">
        <span class="setting ml-auto"><FilterOutlined /> 111</span><span class="filter"></span>
      </div>
    </div>
    <!-- 项目下的tab切换 -->
    <Tabs v-model:activeKey="activeTab">
      <div v-for="item in tabsRoutes" :key="item.name">
        {{ item.meta?.title }}
      </div>
      <TabPane key="1" tab="我的项目"> </TabPane>
    </Tabs>
    {{ $route.params.projectId }}
    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue';

  import { ExclamationCircleOutlined, StarOutlined, UserOutlined, FilterOutlined } from '@ant-design/icons-vue';
  import { Tabs, TabPane, Button } from 'ant-design-vue';
  import { useRouter, useRoute } from 'vue-router';
  const activeTab = ref('task');
  const route = useRoute();
  const router = useRouter();
  let matchedRoutes = router.currentRoute?.value.matched;
  console.log(`output->matchedRoutes`, matchedRoutes, router.currentRoute?.value.name);

  const tabsRoutes = computed(() => {
    const curRoutes = router.currentRoute?.value.matched.filter(
      (item) => item.name === router.currentRoute?.value.name
    );
    console.log(`output->curRoutes`, curRoutes);
    return curRoutes[0].children;
  });
</script>

<style scoped></style>
