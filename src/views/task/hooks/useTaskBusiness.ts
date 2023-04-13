import {
  getTaskStatusTypes,
  getTaskList,
  updateTask,
  fetchTaskLevel,
  fetchTrackerTypes,
} from '@/apis';
import { computed, ref, onMounted, reactive } from 'vue';
import { TaskItem } from '@/types';
import { useRouter, useRoute } from 'vue-router';

export const useTaskBusiness = () => {
  const route = useRoute();
  const router = useRouter();
  const projectId = route.params.projectId;
  const taskList = ref();
  const filterTaskList = ref();
  const levels = ref();

  const filterTask = (params: { id?: number; subject: string }) => {
    console.log(`output-params`, params);
    if (params.id)
      filterTaskList.value = taskList.value.filter((item: TaskItem) => item.id === params.id);
    else if (params.subject) {
      const str = new RegExp(`${params.subject}`, 'g');
      filterTaskList.value = taskList.value.filter((item: TaskItem) => str.test(item.subject));
    }
    if (!params.id && !params.subject) filterTaskList.value = taskList.value;
    // else taskList.value = [];
  };

  const fetchTask = async () => {
    const taskResp = await getTaskList({
      pid: projectId,
      token: localStorage.getItem('token'),
      sort: 'status:desc',
    });
    taskList.value = taskResp.issues;
  };
  const trackers = ref();
  // 获取任务类型
  const getTrackerTypes = async () => {
    const resp = await fetchTrackerTypes({
      token: localStorage.getItem('token'),
      pid: projectId,
    });
    trackers.value = resp.tracker;
  };
  const getTaskLevel = async () => {
    const resp = await fetchTaskLevel({
      token: localStorage.getItem('token'),
      pid: projectId,
    });
    levels.value = resp.priority;
  };
  const status = ref();
  const taskStatusTypes = async () => {
    const resp = await getTaskStatusTypes({
      token: localStorage.getItem('token'),
    });
    status.value = resp.tracker;
    // taskBoard.statusType = resp.tracker;
  };
  return {
    filterTask,
    fetchTask,
    filterTaskList,
    initTaskList: taskList,
    getTaskLevel,
    getTrackerTypes,
    taskStatusTypes,
    trackers,
    levels,
    status,
  };
};
