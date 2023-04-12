<template>
  <div class="flex">
    <div class="py-2.5">
      <span class="mr-3 font-700 text-14px">
        <!-- {{ getStatusName(type)?.name }} -->
        {{ title }}
      </span>
      <span class="text-12px text-gray-500"> {{ computedList.length }} </span>
    </div>
    <!-- <span>...</span> -->
  </div>
  <draggable
    class="w-272px min-h-300px"
    v-model="computedList"
    group="taskList"
    @change="dragChange"
    item-key="id"
    @start="drag = true"
    @end="drag = false"
  >
    <template #item="{ element }">
      <div
        class="mb-2 pl-3.5 pt-3.5 bg-light-50 h-105px flex"
        :class="element.status_id === Status.solve && 'done'"
        @click="openTaskDetail(element)"
      >
        <div class="">
          <Checkbox v-if="element.status_id === Status.solve" disabled checked />
          <Checkbox v-else :checked="element.status_id === Status.close || element.status_id === Status.solve">
          </Checkbox>
        </div>
        <div class="ml-2 flex-1">
          <span class="text-14px block pt-4px">{{ element.subject }}</span>
          <div class="flex items-center mt-2">
            <img class="w-20px h-20px" :src="iconTypes[`type${element.status_id}`] || iconTypes.type3" />
            <span class="ml-1" v-if="element.description"><FileTextOutlined /></span>
            <span v-if="element.fixed_version_id">{{ element?.fixed_version_id }}</span>
          </div>

          <div v-if="element.estimated_hours">预期时间: {{ element?.estimated_hours }}小时</div>
        </div>
        <div class="ml-auto">
          <div class="w-6 h-6 bg-amber-200 mr-3 rounded-1/2 flex items-center justify-center text-xs text-light-50">
            <span>{{ assignedMember(element)?.slice(0, 1) }}</span>
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
  import { computed, ref, onMounted, reactive, watch } from 'vue';
  import { Checkbox } from 'ant-design-vue';
  import { FileTextOutlined, CheckSquareOutlined } from '@ant-design/icons-vue';
  import { useRouter, useRoute } from 'vue-router';
  import { Status, TaskItem } from '../../types';
  import draggable from 'vuedraggable';
  import { type1, type2, type3 } from './icon.ts';
  import { useCommonApis } from '../../hooks';
  const { userList } = useCommonApis();
  const iconTypes = {
    type1,
    type2,
    type3,
  };
  interface TaskListProps {
    title: string;
    list: TaskItem[];
    status: Status;
  }

  const props = withDefaults(defineProps<TaskListProps>(), {});
  const emits = defineEmits(['change', 'openDetail']);
  const { title, list, status } = props;
  const computedList = computed(() => props.list);

  const assignedMember = (element) => {
    return userList.value?.find((userInfo) => element.author === userInfo.user.id)?.user.name;
  };

  // 拖拽改变
  const dragChange = (evt) => {
    const todo = evt.added?.element;

    console.log(`output->todo`, todo);
    if (todo && todo.status_id !== props.status) {
      emits('change', props.status, todo);
      // const mutation = props.done ? M.DONE_TODO : M.UNDONE_TODO;
      // store.commit(mutation, todo);
    }
  };
  const openTaskDetail = (detail) => {
    console.log(`output->detail`, detail);
    emits('openDetail', detail);
  };
</script>

<style scoped>
  .done {
    color: #8c8c8c;
  }
</style>
