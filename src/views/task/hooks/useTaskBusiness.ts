import {
  getTaskStatusTypes,
  getTaskList,
  updateTask,
  fetchTaskLevel,
  fetchTrackerTypes,
} from '@/apis';
import { computed, ref, onMounted, reactive, unref } from 'vue';
import { TaskItem, SidePanelMapType } from '@/types';
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from '@/stores';
import { SideTaskPanel } from '@/components';
import { cloneDeep } from 'lodash-es';

export const useTaskBusiness = () => {
  const route = useRoute();
  const router = useRouter();
  const userStore = useUserStore();
  const projectId = route.params.projectId;
  const taskList = ref();
  const searchTaskList = ref(); // 根据标题收索
  const filterList = ref(); // 根据侧边面板筛选
  const levels = ref();
  const activePanelMenu = reactive({
    field: 'all',
    value: '',
  });
  const searchTask = (params: {
    id?: number;
    subject: string;
    // author: number;
    // assigned_to_id: number;
  }) => {
    const list = activePanelMenu.field !== 'all' ? filterList : taskList;
    console.log(`output->filterList`, activePanelMenu.value);
    const str = new RegExp(`${params.subject}`, 'g');
    searchTaskList.value = list.value.filter((item: TaskItem) => str.test(item.subject));
    if (!params.subject) searchTaskList.value = list.value;
  };
  // else taskList.value = [];

  // : { author?: number; assigned_to_id?: number }
  const filterTask = (fieldItem) => {
    activePanelMenu.field = fieldItem.field;
    activePanelMenu.value = fieldItem.value;
    filterList.value = taskList.value.filter((item: TaskItem) => {
      return item[fieldItem.field] === fieldItem.value;
    });
    console.log(`output-> filterList.value`, filterList.value);
  };

  function multiFilter(array, filters) {
    const filterKeys = Object.keys(filters);
    console.log(`output->filters`, filters);
    // filters all elements passing the criteria
    return array.filter((item) => {
      // dynamically validate all filter criteria
      return filters.every((filter) => {
        //ignore when the filter is empty Anne
        if (!filter.type.value) return true;
        console.log(
          `output->filters[key]`,
          filter.flag,
          filter.type.value,
          item[filter.type.field],
          filter.type.value === item[filter.type.field]
        );
        return filter.flag
          ? filter.type.value === item[filter.type.field]
          : filter.type.value !== item[filter.type.field];
      });
    });
  }
  function multiFilter2(array, filters) {
    const filterKeys = Object.keys(filters);
    // filters all elements passing the criteria
    return array.filter((item) => {
      // dynamically validate all filter criteria
      return filters.some((filter) => {
        //ignore when the filter is empty Anne
        // if (!filterKeys.length) return true;
        if (!filter.type.value) return true;

        // console.log(
        //   `output->filters[key]`,
        //   filter.flag,
        //   filter.type.value,
        //   item[filter.type.field],
        //   filter.type.value === item[filter.type.field]
        // );
        if (filters[key].flag === 0 || filters[key].flag === 1)
          return filter.flag
            ? filter.type.value === item[filter.type.field]
            : filter.type.value !== item[filter.type.field];
        // if (dateFlag === 2)
        //   item[key].flag
        //     ? !!~filters[key].value === item[key]
        //     : !!~filters[key].value !== item[key];
      });
    });
  }
  // [{
  //   flag: value.flag.value,
  //   orAnd: value.orAndFlag.value,
  //   type: value.type,
  // }]
  const moreFilterType = (params) => {
    console.log(`output->params`, params);
    // if (activePanelMenu.value !== 'all' && params.length === 1)
    const list = activePanelMenu.field !== 'all' ? filterList : taskList;
    const copyList = cloneDeep(unref(list));
    // // 1 且 0 或
    const one = params.length === 1 ? 'and' : params[1]?.orAnd;
    const obj = {};
    const resetFlag = params.every((param) => !param.type.value);
    //
    if (resetFlag) {
      if (activePanelMenu.field !== 'all')
        filterTask({ field: activePanelMenu.field, value: activePanelMenu.value });
      else filterList.value = taskList.value;
      return false;
    }
    console.log(`output->one`, one);
    if (one === 'and') {
      const list = multiFilter(copyList, params);
      console.log(`output->list one1`, list);
    } else {
      // or
      const list = multiFilter2(copyList, params);
      console.log(`output->list one2 `, list);
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
    moreFilterType,
  };
};
