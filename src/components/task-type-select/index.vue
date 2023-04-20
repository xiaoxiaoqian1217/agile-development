<template>
  <Dropdown :trigger="['click']">
    <div class="flex" @click.prevent>
      <img
        class="w-20px h-20px mr-1"
        :src="iconTypes[`type${computedTrackerId}`] || iconTypes.type3"
      />
      {{ seletedTrackerName }}
      <slot></slot>
    </div>
    <template #overlay>
      <Menu class="w-200px" @click="trackerChange">
        <template v-for="tracker in trackers" :key="tracker.id">
          <MenuItem>
            <div class="flex items-center justify-between">
              <div class="text-center">
                <img
                  class="w-20px h-20px mr-1 inline-block align-top"
                  :src="iconTypes[`type${tracker.id}`] || iconTypes.type3"
                />
                <span class="text-center">{{ tracker.name }}</span>
              </div>
              <CheckOutlined v-if="computedTrackerId === tracker.id" />
            </div>
          </MenuItem>
        </template>
      </Menu>
    </template>
  </Dropdown>
</template>

<script setup lang="ts">
  import { computed, inject, type Ref } from 'vue';
  import { MenuItem, Menu, Dropdown } from 'ant-design-vue';
  import { CheckOutlined } from '@ant-design/icons-vue';
  import { iconTypes } from '@components/task-list/icon';
  import { FieldItem } from '@/types';
  const props = defineProps({
    tracker_id: Number,
  });
  const emits = defineEmits(['change']);
  const trackers = inject<Ref<FieldItem[]>>('trackersList');

  const computedTrackerId = computed(() => {
    return props.tracker_id;
  });
  const seletedTrackerName = computed(() => {
    return trackers?.value?.find((tracker: FieldItem) => computedTrackerId.value === tracker.id)
      ?.name;
  });
  const trackerChange = ({ item, key }) => {
    emits('change', key);
    // formModel.tracker_id = key;
  };
</script>

<style scoped></style>
