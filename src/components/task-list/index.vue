<template>
  <div class="flex">
    <div class="py-2.5">
      <span class="mr-3 font-700 text-14px">
        {{ computedtitle }}
      </span>
      <span class="text-12px text-gray-500">
        {{ computedList.length }}
      </span>
    </div>
  </div>
  <draggable
    class="min-h-400px w-272px draggable-container overflow-y-auto h-full pr-5px"
    v-model="computedList"
    group="taskList"
    @change="dragChange"
    item-key="id"
    @start="drag = true"
    @end="drag = false"
  >
    <template #item="{ element }">
      <div
        class="mb-2 bg-light-50 task-item-wrap flex relative cursor-pointer"
        :class="element.status_id === Status.solve && 'done'"
        @click="openTaskDetail(element)"
      >
        <div
          class="pl-4px task-item-priority opacity-100"
          :class="`bg-${LevelType[element.priority_id]}`"
        ></div>
        <div class="ml-3.5 py-14px h-105px flex flex-1 pr-2">
          <div class="">
            <Checkbox v-if="element.status_id === Status.solve" disabled checked />
            <Checkbox
              v-else
              :checked="element.status_id === Status.close || element.status_id === Status.solve"
            >
            </Checkbox>
          </div>
          <div class="ml-2 flex-1">
            <div class="text-14px pt-4px flex justify-between">
              {{ element.subject }}

              <div class="ml-auto align-top" v-if="assignedMember(element)">
                <div
                  class="w-5 h-5 bg-amber-200 mr-3 rounded-1/2 flex items-center justify-center text-xs text-light-50 -mt-8px"
                >
                  <span class="text-12px">{{ assignedMember(element)?.slice(0, 1) }}</span>
                </div>
              </div>
            </div>
            <div class="flex flex-wrap items-center mt-2">
              <Tag
                v-if="computedfield !== FilterTypeField.status_id"
                :color="StatusColor[element.status_id]"
              >
                {{ getStatusName(element.status_id) }}
              </Tag>
              <!-- <span :class="`text-${StatusColor[element.status_id]}`">{{}}</span> -->
              <img
                class="w-20px mr-8px h-20px inline-block"
                :src="iconTypes[`type${element.tracker_id}`] || iconTypes.type3"
              />
              <!-- 显示日期 -->
              <span class="mr-8px text-12px text-gray-500 bg-gray-100 p-4px"
                >{{ dayjs(element.start_date).format('MM-DD') }}月-{{
                  dayjs(element.due_date).format('MM-DD')
                }}日</span
              >
              <FileTextOutlined v-if="element.description" class="text-gray-500 text-12px mr-8px" />
              <span v-if="element.fixed_version_id" class="text-12px text-gray-500 mt-1px mr-8px">
                <i class="iconfont icon-running text-gray-400"></i>
                <span class="-mt-2px inline-block">{{
                  getVersionName(element?.fixed_version_id)
                }}</span>
              </span>
              <span v-if="element.estimated_hours" class="mr-8px text-12px text-gray-500 mt-1">
                预期时间: {{ element?.estimated_hours }}小时
              </span>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <slot></slot>
      <!-- <template v-if="status === Status.new">
        <div class="shadow bg-light-50" @click="addTask">
          <div class="text-center"><PlusOutlined /></div>
        </div>
      </template> -->
    </template>
  </draggable>
</template>

<script setup lang="ts">
  import { computed, inject, type Ref } from 'vue';
  import { Checkbox, Tag } from 'ant-design-vue';
  import { FileTextOutlined } from '@ant-design/icons-vue';
  import { FieldItem, Status, TaskItem, FilterTypeField } from '../../types';
  import draggable from 'vuedraggable';
  import { iconTypes } from './icon';
  import { LevelType, StatusColor } from '../../views/task/constants';
  import dayjs from 'dayjs';

  interface TaskListProps {
    field: string;
    title: string;
    list: TaskItem[];
    fieldId: number;
  }

  const props = withDefaults(defineProps<TaskListProps>(), {});
  const emits = defineEmits(['change', 'openDetail']);
  const { field } = props;
  console.log(`output->`, props);
  const computedList = computed(() => props.list);
  const computedtitle = computed(() => props.title);
  const computedfield = computed(() => props.field);
  const computedfieldiD = computed(() => props.fieldId);
  const versionList = inject<Ref<FieldItem[]>>('versionList');
  const memberList = inject<Ref<FieldItem[]>>('memberList');
  const statusList = inject<Ref<FieldItem[]>>('statusList');

  const assignedMember = (element: TaskItem) => {
    return memberList?.value?.find((userInfo) => element.assigned_to_id === userInfo.user.id)?.user
      .name;
  };
  const getVersionName = (id: number) => {
    return versionList?.value?.find((item) => item.id === id)?.name;
  };
  const getStatusName = (id: number) => {
    return statusList?.value?.find((item) => item.id === id)?.name;
  };
  // 拖拽改变
  const dragChange = (evt) => {
    const todo = evt.added?.element;
    if (todo && todo[field] !== props.fieldId) {
      console.log(`output->dragChange`, field, todo[field], props.fieldId);
      emits('change', {
        id: todo.id,
        [computedfield.value]: computedfieldiD.value,
      });
    }
  };
  const openTaskDetail = (detail) => {
    emits('openDetail', detail);
  };
</script>

<style scoped>
  .done {
    color: #8c8c8c;
  }
  .task-item-priority {
    border-bottom-left-radius: 4px;
    border-top-left-radius: 4px;
  }

  .task-item-wrap {
    cursor: pointer;
    border-radius: 10px;
    box-shadow: 0 1px 5px rgba(154, 153, 153, 0.2);
    transition: all 0.3s cubic-bezier(0.44, 0.9, 0.6, 0.94);
    transition-property: transform, box-shadow, background, border-color;
  }
  .task-item-wrap:hover {
    box-shadow: 0 6px 16px rgba(154, 153, 153, 0.2);
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    transform: translate3d(0, 0, 0) translateY(-2px);
  }
</style>
