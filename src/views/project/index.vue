<template>
  <div class="h-full divide-y divide-gray-500 divide-opacity-10">
    <!--global-header -->
    <div class="global-nav flex h-70px pr-24px py-12px">
      <!-- left -->
      <!-- <div class="flex"> -->
      <div class="flex h-full w-24px justify-center items-center">
        <span @click="backToHome" class="cursor-pointer">
          <LeftOutlined />
        </span>
        <!-- 项目图片 -->
      </div>
      <div class="w-48px h-48px">
        <img class="w-full h-full rounded-md" :src="projectImg" alt="" />
      </div>
      <div class="ml-12px">
        <Dropdown :trigger="['click']">
          <a class="ant-dropdown-link text-14px" @click.prevent>
            {{ projectName }}
            <DownOutlined class="ml-1" />
          </a>
          <template #overlay>
            <Menu>
              <template v-for="project in projectList" :key="project.id">
                <MenuItem @click="projectChange(project.id)">
                  <div class="flex justify-between">
                    <span>{{ project.name }}</span>
                    <!-- <span v-if="curProjectId === project.id"></span> -->
                  </div>
                </MenuItem>
              </template>
            </Menu>
          </template>
        </Dropdown>

        <Tabs v-model:activeKey="activeTab" @change="toTask" sise="small">
          <TabPane v-for="item in tabsRoutes" :key="item?.name" :tab="item.meta?.title"> </TabPane>
        </Tabs>
      </div>
    </div>
    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
    <!-- 项目成员抽屉组件 -->
    <Drawer v-model:visible="visible" class="custom-class" title="全部成员" placement="right">
      <div>
        <template v-for="userInfo in userList" :key="userInfo.id">
          <div class="flex px-5 items-center">
            <div
              class="w-8 h-8 bg-amber-200 mr-3 rounded-1/2 flex items-center justify-center text-white"
            >
              <span>{{ userInfo.user.name?.slice(0, 2) }}</span>
            </div>
            <span class="truncate font-500 text-neutral-800">{{ userInfo?.user.name }}</span>
            <span></span>
          </div>
        </template>
      </div>
    </Drawer>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, onMounted, inject } from 'vue';
  import { DownOutlined, LeftOutlined } from '@ant-design/icons-vue';
  import { Tabs, Drawer, Dropdown, Menu, MenuItem } from 'ant-design-vue';
  import { useRouter, useRoute } from 'vue-router';
  import { Key } from 'ant-design-vue/lib/_util/type';
  import { getMembers } from '../../apis';
  import { useUserStore } from '../../stores';
  import { UserItem } from '../../types';
  import { PAGE_ROUTE_NAME } from '../../router/router.d';
  import { useProjectApi } from '@/hooks';
  import projectImg from '@/assets/project.png';

  const TabPane = Tabs.TabPane;
  const activeTab = ref<string>(PAGE_ROUTE_NAME.TASK);
  const router = useRouter();
  const route = useRoute();
  const reloadRoute = inject('reloadRoute');
  const curPath = computed(() => {
    return router.currentRoute.value;
  });
  const matchedRoutes = computed(() => {
    return router.currentRoute.value.matched;
  });
  const tabsRoutes = computed(() => {
    const curRoutes = router.currentRoute?.value.matched.filter(
      (item) => item.name === PAGE_ROUTE_NAME.PROJECT
    );
    return curRoutes[0].children;
  });
  const backToHome = () => {
    router.push({
      name: 'home',
    });
  };
  const toTask = (activeKey: Key) => {
    router.push({
      name: activeKey as string,
      params: {
        projectId: route.params.projectId,
      },
    });
  };
  const { fetchProjectList, projectList } = useProjectApi();

  const projectName = computed(() => {
    return projectList.value.find((item) => {
      return item.id === Number(route.params.projectId);
    })?.name;
  });

  onMounted(async () => {
    await fetchProjectList();
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
      pid: route.params.projectId,
      token: userStore.token,
    });
    userList.value = resp.users;
  };
  const projectId = ref();
  const projectChange = (id: number) => {
    projectId.value = id;
    router.push({
      name: 'project',
      params: {
        projectId: id,
      },
    });
    reloadRoute?.();
  };
</script>

<style>
  .ant-tabs-tab {
    padding: 8px 0;
  }
</style>
