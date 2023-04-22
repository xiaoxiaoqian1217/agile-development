<template>
  <div class="flex w-full relative">
    <!-- 侧栏 -->
    <div
      class="task-sidebar flex-none absolute z-40 bg-light-50"
      :class="isVisiblePanel && 'active'"
    >
      <SideTaskPanel
        :activePanelMenuId="activePanelMenuId"
        @task-panel-change="sidePanelChange"
      ></SideTaskPanel>
    </div>
    <div class="w-full" :class="isVisiblePanel && 'ml-300px'">
      <!-- 顶部操作栏 -->
      <div class="tool-bar flex h-48px px-24px py-12px">
        <!-- 控制任面板图标 -->
        <span class="cursor-pointer flex items-center" @click="openTaskPanel">
          <DoubleLeftOutlined v-if="isVisiblePanel" />
          <MenuOutlined v-else />
        </span>
        <Dropdown class="ml-4" :trigger="['click']">
          <a class="ant-dropdown-link flex items-center" @click.prevent>
            <!-- two-tone-color="#41b7fd" -->
            <ProjectTwoTone class="mr-2" />
            <span>{{ curSideMenuName }}</span>
            <DownOutlined class="mt-0.5 ml-1" />
            <span class=""> </span>
          </a>
          <template #overlay>
            <Menu class="p-10px w-250px right-16px">
              <template v-for="menu in SIDER_MENU" :key="menu.tag">
                <MenuItem class="my-4px px-6px" @click="sidePanelChange(menu)">
                  <div class="flex items-center">
                    <ProjectTwoTone class="mr-2" />

                    <span>{{ menu.name }}</span>
                    <span v-if="activePanelMenuId === menu.tag"></span>
                  </div>
                </MenuItem>
              </template>
            </Menu>
          </template>
        </Dropdown>

        <div class="flex flex-1 setting items-center justify-center">
          <!-- 搜索标题和ID -->
          <Input
            class="custome-input w-300px bg-gray-light border-none"
            v-model:value="searchValue"
            placeholder="搜索标题"
            @change="searchFromName"
          >
            <template #prefix>
              <SearchOutlined :style="{ color: '#8c8c8c' }" />
            </template>
          </Input>
          <!-- 如何分列查看 -->
        </div>
        <div class="flex items-center justify-end">
          <Dropdown class="mr-3" :trigger="['click']">
            <a class="ant-dropdown-link flex items-center" @click.prevent>
              <i class="mr-1 iconfont icon-ic24-column-2-vertical"></i>
              {{ `${filterTypeName}分列` }}
            </a>
            <template #overlay>
              <Menu>
                <MenuItem
                  v-for="item in FILTER_DROP_DOWN_MENU"
                  :key="`${item.field}-${item.id}`"
                  @click="searchTypeChange(item)"
                >
                  <div class="flex justify-between">
                    <span>{{ item.name }}</span>
                    <span v-if="activeFilterMenu.id === item.id"></span>
                  </div>
                </MenuItem>
              </Menu>
            </template>
          </Dropdown>
          <!-- 多条件筛选 -->
          <div>
            <TaskFilterGroup
              :activePanelMenuId="activePanelMenuId"
              @change="filterGroupChange"
            ></TaskFilterGroup>
          </div>
        </div>
      </div>
      <div class="flex task-board pr-6.5 w-full overflow-x-auto bg-gray-100">
        <div class="pl-5 task-list-handler relative mt-2">
          <SideTaskPanel
            v-if="!isVisiblePanel"
            @task-panel-change="sidePanelChange"
            :activePanelMenuId="activePanelMenuId"
            class="task-list-panel absolute w-320px"
          ></SideTaskPanel>
        </div>
        <div class="flex flex-auto w-full mb-2">
          <div class="flex flex-col mr-5" v-for="[type, tasks] in taskBoard.groupMap" :key="type">
            <TaskList
              @open-detail="showTaskDetail"
              :title="getStatusName(type)?.name"
              :list="tasks.value"
              :field="activeFilterMenu.field"
              :fieldId="type"
              @change="drapStatusChange"
            >
              <template
                v-if="
                  type === Status.new ||
                  activeFilterMenu.id === FilterType.category ||
                  activeFilterMenu.id === FilterType.level
                "
              >
                <div class="shadow bg-light-50 h-25px" @click="addTask">
                  <div class="text-center"><PlusOutlined /></div>
                </div>
              </template>
            </TaskList>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 创建任务弹出层 -->

  <CreateTaskModal
    v-if="isShowCreateModal"
    @on-visible="showCreateModal"
    :visible="isShowCreateModal"
  ></CreateTaskModal>
  <UpdateTaskModal
    v-if="isShowUpdateModal"
    :detail="taskdetail"
    @on-visible="showUpdateModal"
    :visible="isShowUpdateModal"
  ></UpdateTaskModal>
</template>

<script setup lang="ts">
  import { computed, ref, onMounted, reactive, provide } from 'vue';
  import { Dropdown, Menu, MenuItem, Input } from 'ant-design-vue';
  import {
    PlusOutlined,
    DownOutlined,
    SearchOutlined,
    DoubleLeftOutlined,
    MenuOutlined,
    ProjectTwoTone,
  } from '@ant-design/icons-vue';
  import { useRouter } from 'vue-router';
  import { updateTask } from '@/apis';
  import { TaskList, SideTaskPanel, TaskFilterGroup } from '@/components';
  import { CreateTaskModal, UpdateTaskModal } from './components';
  import { FILTER_DROP_DOWN_MENU, FilterType, SIDER_MENU, type SideMenuItem } from './constants';
  import { useProjectApi, useCommonApis, useScrollX } from '@/hooks';
  import { useTaskBusiness } from './hooks';
  import { FieldItem, Status, TaskItem } from '@/types';
  import { FilterOptionConfig } from '@/components/task-filter-group/type';
  import 'ant-design-vue/lib/date-picker/style';
  const router = useRouter();
  const { getVersion, versionList, projectList, fetchProjectList } = useProjectApi();
  const { memberList, fetchMembers } = useCommonApis();
  const {
    searchTask,
    fetchTask,
    searchTaskList,
    getTaskLevel,
    getTrackerTypes,
    taskStatusTypes,
    levels,
    trackers,
    status,
    filterTask,
    filterList,
    multFilterType,
  } = useTaskBusiness();
  const { bindEle } = useScrollX();

  const activeFilterMenu = reactive({ ...FILTER_DROP_DOWN_MENU[0] });
  const searchValue = ref('');
  provide('versionList', versionList);
  provide('memberList', memberList);
  provide('levelList', levels);
  provide('trackersList', trackers);
  provide('statusList', status);
  provide('projectList', projectList);

  onMounted(async () => {
    // todo 优化成循环并发
    await fetchTask();
    await taskStatusTypes();
    getVersion();
    fetchMembers();
    getTaskLevel();
    getTrackerTypes();
    toAllTask();
    fetchProjectList();
    searchTypeChange(activeFilterMenu);
    bindEle();
  });
  const searchFromName = () => {
    const value = searchValue.value;
    searchTask({ subject: value });
    classifyTask(searchTaskList.value);
  };

  const toAllTask = (viewId = 1) => {
    router.push({
      name: 'task',
      params: {
        viewId: viewId,
      },
    });
  };
  // 根据筛选类型查询项目
  const taskBoard = reactive({
    statusType: [],
    groupMap: new Map(),
  });
  const activePanelMenuId = ref(SIDER_MENU[0]?.tag);
  const filterTypeName = computed(() => {
    return FILTER_DROP_DOWN_MENU.find((item) => item.id === activeFilterMenu.id)?.name;
  });
  const curSideMenuName = computed(() => {
    return SIDER_MENU.find((item) => item.tag === activePanelMenuId.value)?.name;
  });

  const searchTypeChange = async (menuItem) => {
    if (menuItem.id === FilterType.status) {
      // await taskStatusTypes();
      taskBoard.statusType = status.value;
    }
    if (menuItem.id === FilterType.category) {
      // await getTrackerTypes();
      taskBoard.statusType = trackers.value;
    }
    if (menuItem.id === FilterType.level) {
      // await getTaskLevel();
      taskBoard.statusType = levels.value;
    }
    Object.keys(menuItem).forEach((key) => {
      activeFilterMenu[key] = menuItem[key];
    });
    // 根据任务状态筛选任务列表
    if (searchValue.value) searchTask({ subject: searchValue.value });
    classifyTask(searchValue.value ? searchTaskList.value : filterList.value);
  };
  const classifyTask = async (list: TaskItem) => {
    const { field } = activeFilterMenu;
    const groupMap = new Map();
    taskBoard.statusType?.forEach((type: FieldItem) => {
      if (!groupMap.has(type.id)) groupMap.set(type.id, ref([]));
    });
    list.forEach((issue) => {
      if (groupMap.has(issue[field])) groupMap.get(issue[field]).value?.push(issue);
    });
    taskBoard.groupMap = groupMap;
  };

  const getStatusName = (typeId: number) => {
    return taskBoard.statusType.find((item: FieldItem) => {
      return item.id === typeId;
    });
  };
  // 新建任务
  const addTask = () => {
    isShowCreateModal.value = true;
  };

  const isShowCreateModal = ref(false);
  const showCreateModal = async (flag: boolean) => {
    isShowCreateModal.value = flag;
    if (!flag) refreshTaskList();
  };
  const showUpdateModal = (flag: boolean) => {
    isShowUpdateModal.value = flag;
    if (!flag) refreshTaskList();
  };
  const refreshTaskList = async () => {
    await fetchTask();
    if (savedFilterConfig.value?.length) multFilterType(savedFilterConfig.value);
    if (searchValue.value) searchTask({ subject: searchValue.value });
    classifyTask(searchValue.value ? searchTaskList.value : filterList.value);
  };
  const drapStatusChange = async (todo: TaskItem) => {
    await updateTask({
      token: localStorage.getItem('token'),
      ...todo,
    });
    refreshTaskList();
  };
  const isShowUpdateModal = ref(false);

  const taskdetail = reactive({});
  const showTaskDetail = (detail: TaskItem) => {
    Object.keys(detail).forEach((key) => {
      taskdetail[key] = detail[key as keyof TaskItem];
    });
    isShowUpdateModal.value = true;
  };

  const isVisiblePanel = ref(false);
  // 打开 taskpanel
  const openTaskPanel = () => {
    isVisiblePanel.value = !isVisiblePanel.value;
  };

  const sidePanelChange = ({ tag, id, name }: SideMenuItem) => {
    activePanelMenuId.value = tag;
    searchValue.value = '';
    // 这里需要重置筛选框中保留的参数

    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    filterTask({
      field: tag,
      value: userInfo.id,
    });

    classifyTask(filterList.value);
  };
  const savedFilterConfig = ref<FilterOptionConfig[]>();

  const filterGroupChange = (values: FilterOptionConfig, filters: FilterOptionConfig[]) => {
    savedFilterConfig.value = filters;
    multFilterType(filters);
    if (searchValue.value) searchTask({ subject: searchValue.value });
    console.log(`output->params`, filters);
    classifyTask(searchValue.value ? searchTaskList.value : filterList.value);
  };
</script>

<style>
  .task-sidebar {
    box-shadow: 0px 10px 24px rgba(0, 0, 0, 0.1);
    height: calc(100vh - 85px);
    bottom: 0;
    left: 0;
    position: absolute;
    top: 0px;
    transition: all 0.1s ease-in-out;
    transform: translateX(-400px);
    z-index: 30;
    cursor: pointer;
    width: 300px;
  }
  .task-sidebar.active {
    transform: translateX(0px);
  }
  .task-board {
    height: calc(100vh - 120px);
  }
  .task-list-panel {
    bottom: 0;
    left: 0;
    position: absolute;
    top: 0px;
    transition: all 0.1s ease-in-out;
    transform: translateX(-600px);
    z-index: 30;
    cursor: pointer;
  }
  .task-list-handler:hover .task-list-panel {
    transform: translateX(0px);
  }
  .custome-input .ant-input {
    background-color: inherit;
    border-radius: 6px;
  }
  .custome-input.ant-input-affix-wrapper:focus,
  .ant-input-affix-wrapper-focused {
    border-color: transparent;
    box-shadow: none;
  }
</style>
