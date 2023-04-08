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
          <span class="user" @click="showMembers"><UserOutlined /></span>
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
    <!-- 项目成员抽屉组件 -->
    <Drawer v-model:visible="visible" class="custom-class" title="全部成员" placement="right">
      <div>
        <template v-for="userInfo in userList" :key="userInfo.id">
          <div class="flex px-5 items-center">
            <div class="w-8 h-8 bg-amber-200 mr-3 rounded-1/2 flex items-center justify-center text-white">
              <span>{{ userInfo?.user.name?.slice(0, 2) }}</span>
            </div>
            <span class="truncate font-500 text-neutral-800">{{ userInfo?.user.name }}</span
            ><span></span>
          </div>
        </template>
      </div>
    </Drawer>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, onMounted } from 'vue';
  import { ExclamationCircleOutlined, StarOutlined, UserOutlined, FilterOutlined } from '@ant-design/icons-vue';
  import { Tabs, Drawer } from 'ant-design-vue';

  import { useRouter, useRoute } from 'vue-router';
  import { Key } from 'ant-design-vue/lib/_util/type';
  import { getMembers } from '../../apis';
  import { useUserStore } from '../../stores';
  import { UserInfo } from '../../types';
  const TabPane = Tabs.TabPane;
  const activeTab = ref<Key>('');
  const router = useRouter();
  const route = useRoute();
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
  onMounted(() => {
    console.log(`output->route`, route.params.projectId);
    router.push({
      name: 'task',
      params: {
        pId: route.params.projectId,
      },
    });
  });

  const userStore = useUserStore();
  const visible = ref<boolean>(false);
  const userList = ref<UserInfo[]>();
  //  展示项目成员
  const showMembers = () => {
    visible.value = true;
    fetchProjectMembers();
  };

  const fetchProjectMembers = async () => {
    const resp = await getMembers({
      pid: '5' || route.params.projectId,
      token: userStore.token,
    });
    userList.value = resp.users;
  };
</script>

<style scoped></style>
