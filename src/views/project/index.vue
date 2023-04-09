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
      <!-- <div class="tool-bar flex h-48px px-24px py-12px">
        <div class="setting ml-auto">
          <Dropdown :trigger="['click']">
            <a class="ant-dropdown-link" @click.prevent>
              <FilterOutlined />
              {{ filterTypeName }}
              <span class="filter"></span>
            </a>
            <template #overlay>
              <Menu @click="searchTypeChange">
                <template v-for="item in ['1', '2']" :key="item">
                  <MenuItem>
                    <div class="flex justify-between">
                      <span>{{ item }}</span>
                      <span v-if="isActiveType === item"></span>
                    </div>
                  </MenuItem>
                </template>
              </Menu>
            </template>
          </Dropdown>
        </div>
      </div> -->
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
              <span>{{ userInfo.user.name?.slice(0, 2) }}</span>
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
  import { Tabs, Drawer, Dropdown, Menu, MenuItem } from 'ant-design-vue';

  import { useRouter, useRoute } from 'vue-router';
  import { Key } from 'ant-design-vue/lib/_util/type';
  import { getMembers, getTaskStatusTypes } from '../../apis';
  import { useUserStore } from '../../stores';
  import { UserItem } from '../../types';
  import { PAGE_ROUTE_NAME } from '../../router/router.d';
  const TabPane = Tabs.TabPane;
  const activeTab = ref<string>(PAGE_ROUTE_NAME.TASK);
  const router = useRouter();
  const route = useRoute();

  const curPath = computed(() => {
    return router.currentRoute.value;
  });
  const matchedRoutes = computed(() => {
    return router.currentRoute.value.matched;
  });
  const tabsRoutes = computed(() => {
    const curRoutes = router.currentRoute?.value.matched.filter((item) => item.name === PAGE_ROUTE_NAME.PROJECT);
    return curRoutes[0].children;
  });
  const toTask = (activeKey: Key) => {
    router.push({
      name: activeKey as string,
      params: {
        projectId: route.params.projectId,
      },
    });
  };
  onMounted(() => {
    // 刷新时以当前路由为准
    const activeRoute =
      curPath.value?.name === PAGE_ROUTE_NAME.PROJECT
        ? activeTab.value
        : matchedRoutes.value[matchedRoutes.value.length];
    activeTab.value = activeRoute as string;
    toTask(activeRoute as Key);
  });
  //  获取项目成员相关
  const userStore = useUserStore();
  const visible = ref<boolean>(false);
  const userList = ref<UserItem[]>();
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
