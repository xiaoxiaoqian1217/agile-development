<template>
  <div class="bg-light-50">
    <template v-for="sideItem in SIDER_MENU" :key="sideItem.tag">
      <div
        class="flex px-4 py-2 items-center text-14px"
        :class="activePanelMenuId === sideItem.tag && 'bg-sky-100'"
        @click="changeMenu(sideItem)"
      >
        <div class="w-6 h-6 bg-amber-200 mr-3 rounded-1/2"></div>
        <span class="truncate font-500 text-neutral-800">{{ sideItem.name }}</span>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, defineProps } from 'vue';
  import { SIDER_MENU, type SideMenuItem } from '../../views/task/constants';
  const emits = defineEmits(['taskPanelChange']);
  const props = defineProps({
    visible: Boolean,
    activePanelMenuId: String,
  });
  const activePanelMenuId = computed(() => {
    console.log(`output-> props.activePanelMenuId`, props.activePanelMenuId);
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
