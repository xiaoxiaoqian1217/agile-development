<template>
  <div class="flex h-full">
    <div style="width: 80px" class="side-menu flex flex-col items-center">
      <div class="h-70px flex justify-center items-center">
        <img :src="logoImg" class="w-30px h-30px" />
      </div>
      <div>
        <div
          class="flex flex-col text-center py-8px w-60px text-12px bg-gray-lightHex text-blue-default rounded-md"
        >
          <i class="iconfont icon-home-station text-20px"></i>
          <div class="w-full mt-1" :style="{ opacity: 1 }">项目</div>
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
          class="w-8 h-8 cursor-pointer rounded-1/2 flex items-center justify-center text-xs text-light-50 bg-amber-300"
        >
          <span>{{ userInfo?.name?.slice(0, 1) }}</span>
        </div>

        <template #overlay>
          <Menu>
            <MenuItem>
              <div class="flex items-center" @click="logOut">
                <LogoutOutlined /> <span class="ml-2">退出登录</span>
              </div>
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
  import { provide, ref, nextTick } from 'vue';
  import { Dropdown, Menu, MenuItem } from 'ant-design-vue';
  import { LogoutOutlined } from '@ant-design/icons-vue';
  import { useRouter } from 'vue-router';
  import logoImg from '@/assets/logo.png';
  const selectedKeys = ref(['1']);
  const router = useRouter();
  const userInfo = JSON.parse(sessionStorage.getItem('userInfo') || '{}');
  const logOut = () => {
    sessionStorage.removeItem('token');
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
