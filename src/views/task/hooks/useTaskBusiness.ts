import {
  getTaskStatusTypes,
  getTaskList,
  updateTask,
  fetchTaskLevel,
  fetchTrackerTypes,
} from '@/apis';
import { computed, ref, onMounted, reactive } from 'vue';
import { TaskItem, SidePanelMapType } from '@/types';
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from '@/stores';
import { SideTaskPanel } from '@/components';

export const useTaskBusiness = () => {
  const route = useRoute();
  const router = useRouter();
  const userStore = useUserStore();
  const projectId = route.params.projectId;
  const taskList = ref();
  const searchTaskList = ref(); // 根据标题收索
  const filterList = ref(); // 根据侧边面板筛选
  const levels = ref();
  const activePanelMenu = ref('all');
  const searchTask = (params: {
    id?: number;
    subject: string;
    // author: number;
    // assigned_to_id: number;
  }) => {
    const list = activePanelMenu.value !== 'all' ? filterList : taskList;
    console.log(`output->filterList`, filterList, taskList);
    if (params.subject) {
      const str = new RegExp(`${params.subject}`, 'g');
      searchTaskList.value = list.value.filter((item: TaskItem) => str.test(item.subject));
    }
    if (!params.subject) searchTaskList.value = list.value;
    // else taskList.value = [];
  };
  // : { author?: number; assigned_to_id?: number }
  const filterTask = ({ tag }: { tag: SidePanelMapType }) => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    activePanelMenu.value = tag;
    if (tag == 'all') filterList.value = taskList.value;
    else {
      filterList.value = taskList.value.filter((item: TaskItem) => {
        return item[tag] === userInfo.id;
      });
    }
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
    searchTask,
    fetchTask,
    searchTaskList,
    initTaskList: taskList,
    getTaskLevel,
    getTrackerTypes,
    taskStatusTypes,
    trackers,
    levels,
    status,
    filterTask,
    filterList,
  };
};
