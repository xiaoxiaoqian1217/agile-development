<template>
  <Dropdown :trigger="['click']">
    <span class="text-14px" @click.prevent>
      <span> {{ seletedStatusName }} </span>
      <!-- <DownOutlined class="ml-1" /> -->
    </span>
    <template #overlay>
      <Menu @click="statusChange" class="w-150px">
        <template v-for="status in getDefaultStatus()" :key="status.id">
          <MenuItem>
            <div class="flex justify-between">
              <span>{{ status?.name }}</span>
              <span v-if="computedStatusId === status?.id"></span>
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
  import { CheckOutlined, DownOutlined } from '@ant-design/icons-vue';
  import { FieldItem, Status, TrackerType, TaskItem } from '@/types';
  const props = defineProps({
    status_id: Number,
    tracker_id: Number,
  });
  const emits = defineEmits(['change']);

  const computedStatusId = computed(() => {
    return props.status_id;
  });
  const computedTrackerId = computed(() => {
    return props.tracker_id;
  });
  const seletedStatusName = computed(() => {
    return statusList?.value?.find((tracker: FieldItem) => computedStatusId.value === tracker.id)
      ?.name;
  });
  const statusChange = ({ item, key }) => {
    emits('change', key);
    // formModel.tracker_id = key;
  };
  const statusList = inject<Ref<FieldItem[]>>('statusList');

  const getDefaultStatus = () => {
    if (computedTrackerId.value === TrackerType.error)
      return statusList?.value.filter(
        (item) => item.id === Status.new || item.id === Status.doing || item.id === Status.check
      );
    if (computedTrackerId.value === TrackerType.feature)
      return statusList?.value.filter((item) => item.id === Status.check);
    else return statusList?.value;
  };
</script>

<style scoped></style>
