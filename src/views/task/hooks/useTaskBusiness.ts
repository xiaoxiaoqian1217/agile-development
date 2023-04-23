import { getTaskStatusTypes, getTaskList, fetchTaskLevel, fetchTrackerTypes } from '@/apis';
import { computed, ref, onMounted, reactive, unref } from 'vue';
import { TaskItem, FilterTypeField } from '@/types';
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from '@/stores';
import dayjs from 'dayjs';
import { FilterType } from '../constants';
import { FilterOptionConfig } from '@/components/task-filter-group/type';

export const useTaskBusiness = () => {
  const route = useRoute();
  const projectId = route.params.projectId;
  const taskList = ref();
  const searchTaskList = ref(); // 根据标题收索
  const filterList = ref(); // 根据侧边面板筛选
  const levels = ref();
  type MenuAttr = 'assigned_to_id' | 'author' | 'all';
  type PanelMenuItem = { field: MenuAttr; value: number };
  const activePanelMenu = reactive<PanelMenuItem>({
    field: 'all',
    value: 1,
  });
  const searchTask = (params: {
    id?: number;
    subject: string;
    // author: number;
    // assigned_to_id: number;
  }) => {
    searchTaskList.value = filterList.value.filter((item: TaskItem) => {
      return item.subject.includes(params.subject);
      // str.test(item.subject);
    });
    if (!params.subject) searchTaskList.value = filterList.value;
  };
  // else taskList.value = [];

  // : { author?: number; assigned_to_id?: number }
  const filterTask = (fieldItem: PanelMenuItem) => {
    if (fieldItem.field) {
      activePanelMenu.field = fieldItem.field;
      activePanelMenu.value = fieldItem.value;
    }
    if (activePanelMenu.field == 'all') filterList.value = taskList.value;
    else
      filterList.value = taskList.value.filter((item: TaskItem) => {
        return item[activePanelMenu.field as keyof TaskItem] === fieldItem?.value;
      });
  };

  function multiFilterForAnd(array: TaskItem[], filtersConfig: FilterOptionConfig[]) {
    console.log(`output->filters`, filtersConfig);
    return array.filter((taskItem) => {
      return filtersConfig.every((option) => filterFunc(taskItem, option));
    });
  }
  function multiFilterForOr(filterTaskList: TaskItem[], filterConfig: FilterOptionConfig[]) {
    return filterTaskList.filter((taskItem) => {
      return filterConfig.some((option) => filterFunc(taskItem, option));
    });
  }
  const filterFunc = (item: TaskItem, option: FilterOptionConfig) => {
    if (
      option.type.field !== FilterTypeField.start_date &&
      option.type.field !== FilterTypeField.due_date
    ) {
      return (
        (option.flag.value === 0 && option.type.value !== item[option.type.field]) ||
        (option.flag.value === 1 && option.type.value == item[option.type.field])
      );
    } else {
      if (option.type.value instanceof Array) {
        const [start_date, due_date] = option.type.value;
        if (option.flag.value === 0 && item[option.type.field]) {
          // isBefore加上 'day' ，4月23与4月23比较不会返回本身4月25
          return (
            dayjs(item[option.type.field]).isBefore(start_date, 'day') ||
            dayjs(item[option.type.field]).isAfter(due_date)
          );
        }
        if (option.flag.value === 1 && item[option.type.field]) {
          return (
            dayjs(item[option.type.field]).isAfter(dayjs(start_date).subtract(1, 'days')) &&
            dayjs(item[option.type.field]).isBefore(due_date)
          );
        }
      } else {
        if (option.flag.value == 2 && item[option.type.field]) {
          return dayjs(item[option.type.field]).isBefore(option.type.value);
        }
        if (option.flag.value == 3 && item[option.type.field]) {
          return dayjs(item[option.type.field]).isAfter(option.type.value, 'day');
        }
      }
    }
  };

  const multFilterType = (params: FilterOptionConfig[]) => {
    const resetFlag = params.every((param) => !param.type.value);
    if (resetFlag) {
      filterTask({ field: activePanelMenu.field, value: activePanelMenu.value });
      return false;
    }
    // 过滤没有选择类型z
    const newParams = params.filter((param) => param.type.value);
    // // 1 且 0 或
    const isAnd = params.length === 1 ? 'and' : params[1]?.orAndFlag.value;
    filterTask({ field: activePanelMenu.field, value: activePanelMenu.value });
    let list = [];
    if (isAnd === 'and') list = multiFilterForAnd(filterList.value, newParams);
    else list = multiFilterForOr(filterList.value, newParams);
    console.log(`output->filterList`, filterList.value, list);
    filterList.value = list;
  };

  const fetchTask = async () => {
    const taskResp = await getTaskList({
      pid: projectId,
      token: localStorage.getItem('token'),
      sort: 'status:desc',
    });
    taskList.value = taskResp.issues;
    filterList.value = taskResp.issues;
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
    levels.value = resp.priority.reverse();
  };
  const status = ref();
  const taskStatusTypes = async () => {
    const resp = await getTaskStatusTypes({
      token: localStorage.getItem('token'),
    });
    status.value = resp.tracker;
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
    multFilterType,
  };
};
