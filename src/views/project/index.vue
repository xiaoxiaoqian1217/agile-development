<template>
  <div class="h-full">
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
          <!--  tab-routes-切换 -->
          <Tabs v-model:activeKey="activeTab" @change="toTask">
            <TabPane v-for="item in tabsRoutes" :key="item?.name" :tab="item.meta?.title"> </TabPane>
          </Tabs>
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

    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue';
  import { RouterLink } from 'vue-router';

  import { ExclamationCircleOutlined, StarOutlined, UserOutlined, FilterOutlined } from '@ant-design/icons-vue';
  import { Tabs, Button } from 'ant-design-vue';

  import { useRouter, useRoute } from 'vue-router';
  import { Key } from 'ant-design-vue/lib/_util/type';
  const TabPane = Tabs.TabPane;
  const activeTab = ref<Key>('');
  const router = useRouter();
  let matchedRoutes = router.currentRoute?.value.matched;
  console.log(`output->matchedRoutes`, matchedRoutes, router.currentRoute?.value.name);
  const curPath = computed(() => {
    return router.currentRoute.value.path;
  });
  const tabsRoutes = computed(() => {
    const curRoutes = router.currentRoute?.value.matched.filter(
      (item) => item.name === router.currentRoute?.value.name
    );
    console.log(`output->curRoutes`, curRoutes, router.currentRoute?.value, router);
    return curRoutes[0].children;
  });
  const toTask = (activeKey: Key) => {
    console.log(`output->`, activeKey);
    activeTab.value = activeKey;
    router.push(`${curPath.value}/${activeKey}`);
  };
</script>

<style scoped></style>
