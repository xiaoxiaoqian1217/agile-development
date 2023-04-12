import { getTaskStatusTypes, getTaskList, updateTask } from '@apis';
import { computed, ref, onMounted, reactive } from 'vue';
import { TaskItem } from '@/types';
import { useRouter, useRoute } from 'vue-router';

export const useTaskBusiness = () => {
  const route = useRoute();
  const router = useRouter();
  const projectId = route.params.projectId;
  const taskList = ref();
  const filterTaskList = ref();
  const filterTask = (params: { id: number; subject: string }) => {
    console.log(`output-params`, params);
    if (params.id) filterTaskList.value = taskList.value.filter((item: TaskItem) => item.id === params.id);
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
    // const groupMap = taskBoard.groupMap;
    // taskBoard.statusType.forEach((type) => {
    //   if (!groupMap.has(type.id)) groupMap.set(type.id, ref([]));
    // });
    // taskResp.issues.forEach((issue) => {
    //   if (groupMap.has(issue.status_id)) groupMap.get(issue.status_id).value?.push(issue);
    // });
    // taskBoard.groupMap = groupMap;
    // taskBoard.groupMap = groupMap;
    // console.log('groupMap', groupMap);
  };

  return {
    filterTask,
    fetchTask,
    filterTaskList,
    initTaskList: taskList,
  };
};
