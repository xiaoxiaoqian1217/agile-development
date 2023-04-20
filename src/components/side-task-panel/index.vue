<template>
  <div class="bg-light-50">
    <div class="h-48px pl-20px flex items-center">视图</div>
    <div class="h-1px bg-gray-100" />

    <template v-for="sideItem in SIDER_MENU" :key="sideItem.tag">
      <div
        class="flex px-4 py-1 mt-1 items-center text-14px cursor-pointer hover:bg-gray-50"
        :class="activePanelMenuId === sideItem.tag && 'bg-gray-50'"
        @click="changeMenu(sideItem)"
      >
        <div class="mr-3 py-1">
          <ProjectTwoTone />
        </div>
        <span class="truncate text-neutral-800">{{ sideItem.name }}</span>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue';
  import { SIDER_MENU, type SideMenuItem } from '../../views/task/constants';
  import { ProjectTwoTone, HeartTwoTone, CheckCircleTwoTone } from '@ant-design/icons-vue';

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
