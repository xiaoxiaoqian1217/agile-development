<template>
  <div class="flex">
    <div class="py-2.5">
      <span class="mr-3 font-500 text-sm">
        <!-- {{ getStatusName(type)?.name }} -->
        {{ title }}
      </span>
      <span class="text-xs text-gray-500"> {{ list.length }} </span>
    </div>
    <!-- <span>...</span> -->
  </div>
  <draggable
    class="w-272px min-h-300px"
    v-model="list"
    group="taskList"
    @change="dragChange"
    item-key="id"
    @start="drag = true"
    @end="drag = false"
  >
    <template #item="{ element }">
      <div class="mb-2 bg-light-50 h-90px" @click="openTaskDetail(element)">
        <div class="ml-3.5 mt-3.5">
          <Checkbox :checked="element.status_id === Status.close || element.status_id === Status.solve">
            <span class="ml-3 text-sm">{{ element.subject }}</span>
          </Checkbox>
        </div>
        <div></div></div
    ></template>
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
  import { computed, ref, onMounted, reactive } from 'vue';
  import { Checkbox } from 'ant-design-vue';
  import { PlusOutlined } from '@ant-design/icons-vue';
  import { useRouter, useRoute } from 'vue-router';
  import { Status, TaskItem } from '../../types';
  import draggable from 'vuedraggable';

  interface TaskListProps {
    title: string;
    list: TaskItem[];
    status: Status;
  }

  const props = withDefaults(defineProps<TaskListProps>(), {});
  const emits = defineEmits(['change', 'openDetail']);
  const { title, list, status } = props;

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

<style scoped></style>
