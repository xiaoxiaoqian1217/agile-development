<template>
  <div class="bg-light-50">
    <div class="h-48px pl-20px flex items-center">视图</div>
    <div class="h-1px bg-gray-100" />

    <template v-for="sideItem in SIDER_MENU" :key="sideItem.tag">
      <div
        class="flex px-4 py-1 mt-1 items-center text-14px cursor-pointer hover:bg-gray-lightHex"
        :class="activePanelMenuId === sideItem.tag && 'bg-gray-50'"
        @click="changeMenu(sideItem)"
      >
        <div class="mr-3 py-1">
          <img :src="chartPng" class="w-20px h-20px" />
        </div>
        <span class="truncate text-neutral-800">{{ sideItem.name }}</span>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import { SIDER_MENU, type SideMenuItem } from '../../views/task/constants';
  import chartPng from '@/assets/chart.png';

  const emits = defineEmits(['taskPanelChange']);
  const props = defineProps({
    visible: Boolean,
    activePanelMenuId: String,
  });
  const activePanelMenuId = computed(() => {
    return props.activePanelMenuId;
  });
  const changeMenu = (sideItem: SideMenuItem) => {
    emits('taskPanelChange', sideItem);
  };
  const visible = computed(() => {
    return props.visible;
  });
</script>

<style scoped></style>
