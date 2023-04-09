<template>
  <div>
    <div>{{ title }}</div>
    <div>
      <ul>
        <li v-for="task in list" :key="task.id">
          {{ item }}
        </li>
      </ul>
      <!-- 任务状态为开发中时可以添加 -->
      <div v-if="status === Status.new" class="w-272px">
        <div></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  enum Status {
    new = 1,
    doing = 2,
    solve = 3,
    feedback = 4,
    close = 5,
    reject = 6,
  }
  interface TaskItem {
    author: number;
    description: string;
    id: number;
    priority: number;
    status: number;
    subject: string;
    tracker: number;
  }
  interface TaskListProps {
    title: string;
    list: TaskItem[];
    status: Status;
  }

  const props = withDefaults(defineProps<TaskListProps>(), {});
  const { title, list, status } = props;
</script>

<style scoped></style>
