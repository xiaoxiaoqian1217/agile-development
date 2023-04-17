<template>
  <div class="flex h-full">
    <div style="width: 80px" class="side-menu flex flex-col items-center">
      <div class="h-70px"></div>
      <div>
        <div class="flex flex-col text-center pt-8px w-60px text-12px hover:bg-gray-50">
                <AppstoreOutlined class="text-24px" />
                <div class="w-full mt-1 " :style="{ opacity: 1 }">项目</div>
       </div>
        <!-- <Menu v-model:selectedKeys="selectedKeys" mode="inline" :inline-collapsed="true">
          <template #overflowedIndicator> </template>
          <MenuItem key="1" title="项目">
            <template #icon>
             
            </template>
          </MenuItem>
       
        </Menu> -->
      </div>

      <Dropdown class="mb-30px mt-auto" placement="topLeft">
        <div
          class="w-8 h-8 cursor-pointer rounded-1/2 flex items-center justify-center text-xs text-light-50 bg-amber-200"
        >
          <span>{{ userInfo?.name?.slice(0, 1) }}</span>
        </div>

        <template #overlay>
          <Menu>
            <MenuItem>
              <div @click="logOut"><LogoutOutlined /> <span>退出登录</span></div>
            </MenuItem>
          </Menu>
        </template>
      </Dropdown>
    </div>
    <div class="layout-container">
      <router-view v-if="isRouterAlive" v-slot="{ Component }">
        <component :is="Component" />
      </router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, provide, ref, nextTick } from 'vue';
  import { Tabs, Drawer, Dropdown, Menu, MenuItem } from 'ant-design-vue';
  import { AppstoreOutlined, DesktopOutlined, LogoutOutlined } from '@ant-design/icons-vue';
  import { useRouter } from 'vue-router';
  const selectedKeys = ref(['1']);
  const router = useRouter();
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  const logOut = () => {
    localStorage.removeItem('token');
    router.push({
      name: 'login',
    });
  };
  const isRouterAlive = ref(true);
  const reload = () => {
    isRouterAlive.value = false;
    nextTick(() => {
      isRouterAlive.value = true;
    });
  };
  provide('reloadRoute', reload);
</script>

<style scoped>
  .side-menu {
    border-right: 1px solid #f0f0f0;
  }
  .layout-container {
    width: calc(100% - 80px);
  }
</style>
