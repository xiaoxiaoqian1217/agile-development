<template>
  <div class="flex w-full relative">
    <!-- 侧栏 -->
    <div
      v-if="isVisiblePanel"
      class="w-300px flex-none task-sidebar absolute h-full z-40 bg-light-50"
    >
      <SideTaskPanel @task-panel-change="sidePanelChange"></SideTaskPanel>
    </div>
    <div class="w-full">
      <!-- 顶部操作栏 -->
      <div class="tool-bar flex h-48px px-24px py-12px" :class="isVisiblePanel && 'pl-310px'">
        <!-- 控制任面板图标 -->
        <div>
          <span class="cursor-pointer" @click="openTaskPanel">
            <MenuUnfoldOutlined v-if="isVisiblePanel" />
            <MenuFoldOutlined v-else />
            <!-- <DoubleLeftOutlined v-if="isVisiblePanel" />
            <DoubleRightOutlined v-else /> -->
          </span>
        </div>
        <Dropdown class="ml-4" :trigger="['click']">
          <a class="ant-dropdown-link" @click.prevent>
            {{ curSideMenuName }}
            <DownOutlined class="mt-0.5 ml-1" />
            <span class=""> </span>
          </a>
          <template #overlay>
            <Menu>
              <template v-for="menu in SIDER_MENU" :key="menu.id">
                <MenuItem @click="sidePanelChange(menu)">
                  <div class="flex justify-between">
                    <span>{{ menu.name }}</span>
                    <span v-if="activeMenuId === menu.id"></span>
                  </div>
                </MenuItem>
              </template>
            </Menu>
          </template>
        </Dropdown>

        <div class="flex flex-auto setting justify-center items-center">
          <!-- 搜索标题和ID -->
          <div class="">
            <Input v-model:value="searchValue" placeholder="搜索标题" @change="searchFromName">
              <template #prefix>
                <SearchOutlined />
              </template>
            </Input>
          </div>
          <!-- 如何分列查看 -->
          <Dropdown class="ml-3" :trigger="['click']">
            <a class="ant-dropdown-link" @click.prevent>
              <FilterOutlined />
              {{ `${filterTypeName}分列` }}
              <span class="filter"></span>
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
        </div>
      </div>
      <div class="flex h-full bg-gray-100 pr-6.5 w-full overflow-x-auto">
        <div class="pl-5 h-full task-list-handler">
          <SideTaskPanel
            v-if="!isVisiblePanel"
            class="task-list-panel absolute w-320px"
          ></SideTaskPanel>
        </div>
        <div class="flex flex-auto w-full">
          <div class="flex flex-col mr-5" v-for="[type, tasks] in taskBoard.groupMap" :key="type">
            <TaskList
              @open-detail="showTaskDetail"
              :title="getStatusName(type)?.name"
              :list="tasks.value"
              :field="activeFilterMenu.field"
              :fieldId="type"
              @change="drapStatusChange"
            >
              <template v-if="type === Status.new">
                <div class="shadow bg-light-50" @click="addTask">
                  <div class="text-center"><PlusOutlined /></div>
                </div>
              </template>
            </TaskList>
          </div>
          <!-- </div> -->
          <!-- <router-view v-slot="{ Component }">
        <component :is="Component" />
      </router-view> -->
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
  import { Tabs, Drawer, Dropdown, Menu, MenuItem, Checkbox, Input } from 'ant-design-vue';
  import {
    PlusOutlined,
    FilterOutlined,
    DownOutlined,
    SearchOutlined,
    DoubleLeftOutlined,
    DoubleRightOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
  } from '@ant-design/icons-vue';
  import { useRouter, useRoute } from 'vue-router';
  import { updateTask } from '@/apis';
  import { TaskList, SideTaskPanel } from '@/components';
  import CreateTaskModal from './components/createTaskModal.vue';
  import UpdateTaskModal from './components/updateTaskModal.vue';
  import { FILTER_DROP_DOWN_MENU, FilterType, SIDER_MENU, type SideMenuItem } from './constants';
  import { useProjectApi, useCommonApis } from '@/hooks';

  import { useTaskBusiness } from './hooks';
  import { Status, TaskItem } from '../../types';

  const route = useRoute();
  const router = useRouter();
  const projectId = route.params.projectId;
  const { getVersion, versionList, projectList, fetchProjectList } = useProjectApi();
  const { memberList, fetchMembers } = useCommonApis();

  const {
    searchTask,
    fetchTask,
    initTaskList,
    searchTaskList,
    getTaskLevel,
    getTrackerTypes,
    taskStatusTypes,
    levels,
    trackers,
    status,
    filterTask,
    filterList,
  } = useTaskBusiness();

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
  const activeMenuId = ref(SIDER_MENU[0]?.id);
  const filterTypeName = computed(() => {
    return FILTER_DROP_DOWN_MENU.find((item) => item.id === activeFilterMenu.id)?.name;
  });
  const curSideMenuName = computed(() => {
    return SIDER_MENU.find((item) => item.id === activeMenuId.value)?.name;
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

    classifyTask(searchValue.value ? searchTaskList.value : initTaskList.value);
  };
  const classifyTask = async (list) => {
    const { field } = activeFilterMenu;
    console.log(`output->initTaskList.value`, list);
    const groupMap = new Map();
    taskBoard.statusType?.forEach((type) => {
      if (!groupMap.has(type.id)) groupMap.set(type.id, ref([]));
    });
    list.forEach((issue) => {
      if (groupMap.has(issue[field])) groupMap.get(issue[field]).value?.push(issue);
    });
    taskBoard.groupMap = groupMap;
  };

  const getStatusName = (typeId: number) => {
    return taskBoard.statusType.find((item) => {
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
    if (!flag) await fetchTask();
    searchTypeChange(activeFilterMenu);
  };
  const showUpdateModal = (flag: boolean) => {
    isShowUpdateModal.value = flag;
    if (!flag) refeshTaskList();
  };
  const refeshTaskList = async () => {
    await fetchTask();
    searchTypeChange(activeFilterMenu);
  };
  // 更新任务状态
  const defaultUpdateParams = {
    fixed_version_id: '',
    is_private: '',
    assigned_to_id: 24,
    estimated_hours: 0,
  };
  const drapStatusChange = async (todo: TaskItem) => {
    await updateTask({
      token: localStorage.getItem('token'),
      ...todo,
    });
    await fetchTask();
    searchTypeChange(activeFilterMenu);
  };
  const isShowUpdateModal = ref(false);

  const taskdetail = reactive({});
  const showTaskDetail = (detail) => {
    Object.keys(detail).forEach((key) => {
      taskdetail[key] = detail[key];
    });
    isShowUpdateModal.value = true;
  };

  const isVisiblePanel = ref(false);
  // 打开 taskpanel
  const openTaskPanel = () => {
    isVisiblePanel.value = !isVisiblePanel.value;
  };

  const sidePanelChange = ({ tag, id, name }: SideMenuItem) => {
    activeMenuId.value = id;
    filterTask({
      tag,
    });
    console.log(`output->filterList`, filterList.value);
    if (searchValue.value) searchTask({ subject: searchValue.value });
    classifyTask(searchValue.value ? searchTaskList.value : filterList.value);
  };
</script>

<style scoped>
  .task-sidebar {
    box-shadow: 0px 10px 24px rgba(0, 0, 0, 0.1);
  }
  .task-board {
    width: calc(100% - 80px);
  }
  .task-list-panel {
    bottom: 0;
    left: 0;
    position: absolute;
    top: 60px;
    transition: all 0.2s ease-in-out;
    transform: translateX(-900px);
    z-index: 30;
    cursor: pointer;
  }
  .task-list-handler:hover .task-list-panel {
    transform: translateX(0px);
  }
</style>
