<template>
  <div class="flex h-full">
    <div style="width: 80px" class="side-menu flex flex-col items-center justify-between">
      <Menu v-model:selectedKeys="selectedKeys" mode="inline" :inline-collapsed="true">
        <template #overflowedIndicator> </template>
        <MenuItem key="1" title="项目">
          <template #icon>
            <div class="flex flex-col justify-center">
              <PieChartOutlined />
              <div class="w-full" :style="{ opacity: 1 }">项目</div>
            </div>
          </template>
        </MenuItem>
        <MenuItem key="2">
          <template #icon>
            <DesktopOutlined />
          </template>
          <span>Option 2</span>
        </MenuItem>
      </Menu>
      <Dropdown placement="topLeft">
        <div
          class="w-8 h-8 cursor-pointer bg-amber-200 rounded-1/2 flex items-center justify-center text-xs text-light-50"
        >
          <span>{{ 1 }}</span>
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
    <div class="flex-auto">
      <router-view v-slot="{ Component }">
        <component :is="Component" />
      </router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import { Tabs, Drawer, Dropdown, Menu, MenuItem } from 'ant-design-vue';
  import { PieChartOutlined, DesktopOutlined, LogoutOutlined } from '@ant-design/icons-vue';
  import { useRouter } from 'vue-router';
  const selectedKeys = ref(['1']);
  const router = useRouter();
  const logOut = () => {
    localStorage.removeItem('token');
    router.push({
      name: 'login',
    });
  };
  // import { loginIn } from '../../apis';
  // onMounted(() => {
  //   login();
  // });
  // const login = async () => {
  //   const loginResp = await loginIn({
  //     username: 'xiaoqian',
  //     password: 'password',
  //   });
  // };
</script>

<style scoped>
  .side-menu {
    border-right: 1px solid #f0f0f0;
  }
</style>
