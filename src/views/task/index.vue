<template>
  <div class="flex h-full w-full overflow-x-auto">
    <!-- 侧栏 -->
    <div v-if="isVisiblePanel" class="w-300px flex-none task-sidebar">
      <SideTaskPanel></SideTaskPanel>
    </div>
    <div class="flex flex-1 flex-col h-full">
      <!-- 顶部操作栏 -->
      <div class="tool-bar flex h-48px px-24px py-12px">
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
            <Menu @click="searchTypeChange">
              <template v-for="menu in SIDER_MENU" :key="menu.id">
                <MenuItem>
                  <div class="flex justify-between">
                    <span>{{ menu.name }}</span>
                    <span v-if="activeMenuId === menu.id"></span>
                  </div>
                </MenuItem>
              </template>
            </Menu>
          </template>
        </Dropdown>

        <!-- 如何分列查看 -->
        <div class="flex setting ml-auto items-center">
          <!-- 搜索标题和ID -->
          <div class="">
            <Input v-model:value="searchValue" placeholder="搜索标题" @change="searchTask">
              <template #prefix>
                <SearchOutlined />
              </template>
            </Input>
          </div>
          <Dropdown class="ml-3" :trigger="['click']">
            <a class="ant-dropdown-link" @click.prevent>
              <FilterOutlined />
              {{ `${filterTypeName}分列` }}
              <span class="filter"></span>
            </a>
            <template #overlay>
              <Menu @click="searchTypeChange">
                <template v-for="item in FILTER_DROP_DOWN_MENU" :key="item.id">
                  <MenuItem>
                    <div class="flex justify-between">
                      <span>{{ item.name }}</span>
                      <span v-if="isActiveType === item.id"></span>
                    </div>
                  </MenuItem>
                </template>
              </Menu>
            </template>
          </Dropdown>
        </div>
      </div>
      <div class="flex h-full bg-gray-100 pr-6.5">
        <div class="w-5 h-full task-list-handler">
          <SideTaskPanel
            v-if="!isVisiblePanel"
            class="task-list-panel fixed w-320px"
          ></SideTaskPanel>
        </div>
        <div class="flex flex-auto h-full w-full">
          <div class="flex flex-col mr-5" v-for="[type, tasks] in taskBoard.groupMap" :key="type">
            <TaskList
              @open-detail="showTaskDetail"
              :title="getStatusName(type)?.name"
              :list="tasks.value"
              :status="type"
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
  <CreateTaskModal @on-visible="showCreateModal" :visible="isShowCreateModal"></CreateTaskModal>
  <UpdateTaskModal
    v-if="isShowUpdateModal"
    :detail="taskdetail"
    @on-visible="updateTaskList"
    :visible="isShowUpdateModal"
  ></UpdateTaskModal>
</template>

<script setup lang="ts">
  import { computed, ref, onMounted, reactive } from 'vue';
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
  import { getTaskStatusTypes, getTaskList, updateTask } from '@apis';
  import { TaskList, SideTaskPanel } from '@components';
  import CreateTaskModal from './components/createTaskModal.vue';
  import UpdateTaskModal from './components/updateTaskModal.vue';
  import { FILTER_DROP_DOWN_MENU, type FilterType, SIDER_MENU } from './constants';
  import { useTaskBusiness } from './hooks';
  import { Status, TaskItem } from '../../types';

  const route = useRoute();
  const router = useRouter();
  const projectId = route.params.projectId;

  const { filterTask, fetchTask, initTaskList, filterTaskList } = useTaskBusiness();

  const isActiveType = ref(FILTER_DROP_DOWN_MENU[0]?.id);
  const searchValue = ref('');

  onMounted(() => {
    toAllTask();
    searchTypeChange({
      item: FILTER_DROP_DOWN_MENU[0],
      key: FILTER_DROP_DOWN_MENU[0]?.id,
    });
  });
  const searchTask = () => {
    const value = searchValue.value;
    filterTask({ subject: value });
    // else filterTask({ id: value });
    classifyTask(filterTaskList.value);
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
    return FILTER_DROP_DOWN_MENU.find((item) => item.id === isActiveType.value)?.name;
  });
  const curSideMenuName = computed(() => {
    return SIDER_MENU.find((item) => item.id === activeMenuId.value)?.name;
  });
  const searchTypeChange = async ({ item, key }) => {
    // 根据任务状态筛选任务列表
    await taskStatusTypes();
    await fetchTask();
    classifyTask(initTaskList.value);
  };
  const classifyTask = async (list) => {
    const groupMap = new Map();
    taskBoard.statusType.forEach((type) => {
      if (!groupMap.has(type.id)) groupMap.set(type.id, ref([]));
    });
    console.log(`output->initTaskList.value`, list);
    list.forEach((issue) => {
      if (groupMap.has(issue.status_id)) groupMap.get(issue.status_id).value?.push(issue);
    });
    taskBoard.groupMap = groupMap;
  };
  const taskStatusTypes = async () => {
    const resp = await getTaskStatusTypes({
      token: localStorage.getItem('token'),
    });
    taskBoard.statusType = resp.tracker;
  };

  const getStatusName = (typeId: number) => {
    return taskBoard.statusType.find((item) => item.id === typeId);
  };
  // 新建任务
  const addTask = () => {
    isShowCreateModal.value = true;
  };

  const isShowCreateModal = ref(false);
  const showCreateModal = (flag: boolean) => {
    isShowCreateModal.value = flag;
    if (!flag)
      searchTypeChange({
        item: 1,
        key: 1,
      });
  };
  const updateTaskList = (flag: boolean) => {
    isShowUpdateModal.value = flag;
    if (!flag)
      searchTypeChange({
        item: 1,
        key: 1,
      });
  };
  // 更新任务状态
  const defaultUpdateParams = {
    fixed_version_id: '',
    is_private: '',
    assigned_to_id: 24,
    estimated_hours: 1,
  };
  const drapStatusChange = async (status: Status, todo: TaskItem) => {
    const resp = await updateTask({
      token: localStorage.getItem('token'),
      pid: projectId,
      ...todo,
      ...defaultUpdateParams,
      status_id: status,
    });
    console.log(`output->drapStatusChange`, resp);
    searchTypeChange({
      item: 1,
      key: 1,
    });
  };
  const isShowUpdateModal = ref(false);

  const taskdetail = reactive({});
  const showTaskDetail = (detail) => {
    console.log(`output->showTaskDetail`, detail);
    Object.keys(detail).forEach((key) => {
      console.log(`output->`, key);
      taskdetail[key] = detail[key];
    });
    console.log(`output->`, taskdetail);
    isShowUpdateModal.value = true;
  };

  const isVisiblePanel = ref(false);
  // 打开 taskpanel
  const openTaskPanel = () => {
    isVisiblePanel.value = !isVisiblePanel.value;
  };
</script>

<style scoped>
  .task-sidebar {
    box-shadow: 0px 10px 24px rgba(0, 0, 0, 0.1);
  }
  .task-list-panel {
    bottom: 0;
    left: 0;
    position: absolute;
    top: 130px;
    transition: all 0.2s ease-in-out;
    transform: translateX(-320px);
  }
  .task-list-handler:hover .task-list-panel {
    transform: translateX(80px);
  }
</style>
