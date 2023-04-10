<template>
  <div class="h-full">
    <div class="tool-bar flex h-48px px-24px py-12px">
      <div class="setting ml-auto">
        <Dropdown :trigger="['click']">
          <a class="ant-dropdown-link" @click.prevent>
            <FilterOutlined />
            {{ filterTypeName }}
            <span class="filter"></span>
          </a>
          <template #overlay>
            <Menu @click="searchTypeChange">
              <template v-for="item in ['1', '2']" :key="item">
                <MenuItem>
                  <div class="flex justify-between">
                    <span>{{ item }}</span>
                    <span v-if="isActiveType === item"></span>
                  </div>
                </MenuItem>
              </template>
            </Menu>
          </template>
        </Dropdown>
      </div>
    </div>
    <div class="w-full h-full overflow-x-auto bg-gray-100 px-6.5">
      <!-- 侧栏 -->
      <!-- <div class="w-300px flex-none task-sidebar">
        <div class="flex py-2.5 px-4 justify-between"><span>视图</span></div>
        <div class="flex py-2.5 px-4 cursor-auto" @click="toAllTask(1)">
          <span class="mr-2"><UnorderedListOutlined /></span><span>所有任务</span>
        </div>
        <div class="flex py-2.5 px-4 cursor-auto" @click="toAllTask(2)">
          <span class="mr-2"><UnorderedListOutlined /></span><span>所有任务</span>
        </div>
      </div> -->
      <div class="flex flex-auto">
        <!-- 工具栏 -->
        <!-- 这里展示动态的view -->
        <!-- <div class="flex"> -->
        <div class="mr-5 flex flex-col" v-for="[type, values] in taskBoard.groupMap" :key="type">
          <div class="flex">
            <div class="py-2.5">
              <span class="mr-3 font-500 text-sm">
                {{ getStatusName(type)?.name }}
              </span>
              <span class="text-xs text-gray-500"> {{ values.value.length }} </span>
            </div>
            <!-- <span>...</span> -->
          </div>
          <draggable
            class="w-272px min-h-100px"
            v-model="values.value"
            group="taskList"
            @change="dragChange"
            item-key="id"
            @start="drag = true"
            @end="drag = false"
          >
            <template #item="{ element }">
              <div class="mb-2 bg-light-50 h-90px">
                <div class="ml-3.5 mt-3.5">
                  <Checkbox :checked="element.status_id === Status.close || element.status_id === Status.solve">
                    <span class="ml-3 text-sm">{{ element.subject }}</span>
                  </Checkbox>
                </div>
                <div></div></div
            ></template>
            <template #footer>
              <template v-if="type === Status.new">
                <div class="shadow bg-light-50" @click="addTask">
                  <div class="text-center"><PlusOutlined /></div>
                </div>
              </template>
            </template>
          </draggable>
        </div>
        <!-- </div> -->
        <!-- <router-view v-slot="{ Component }">
        <component :is="Component" />
      </router-view> -->
      </div>
    </div>
    <!-- 创建任务弹出层 -->
    <CreateTaskModal @on-visible="showCreateModal" :visible="isShowCreateModal"></CreateTaskModal>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, onMounted, reactive } from 'vue';
  import { Tabs, Drawer, Dropdown, Menu, MenuItem, Checkbox } from 'ant-design-vue';
  import { PlusOutlined, FilterOutlined } from '@ant-design/icons-vue';
  import { useRouter, useRoute } from 'vue-router';
  import { Status } from '../../types';
  import { getTaskStatusTypes, getTaskList } from '../../apis';
  import draggable from 'vuedraggable';
  import CreateTaskModal from './components/createTaskModal.vue';
  const names = ref([1, 2]);
  const route = useRoute();
  const router = useRouter();
  const projectId = route.params.projectId;
  onMounted(() => {
    toAllTask();
    searchTypeChange({
      item: 1,
      key: 1,
    });
  });
  const toAllTask = (viewId = 1) => {
    router.push({
      name: 'task',
      params: {
        viewId: viewId,
      },
    });
  };
  // 根据筛选类型查询项目
  const isActiveType = ref('1');
  const taskBoard = reactive({
    statusType: [],
    groupMap: new Map(),
  });
  const filterTypeName = computed(() => {
    return '按任务状态选';
  });
  const searchTypeChange = async ({ item, key }) => {
    console.log(`output->item`, item, key);
    // 根据任务状态
    taskBoard.groupMap = new Map();
    await taskStatusTypes();
    await fetchTask();
  };
  const fetchTask = async () => {
    const taskResp = await getTaskList({
      pid: 11,
      token: localStorage.getItem('token'),
      sort: 'status:desc',
    });
    const groupMap = taskBoard.groupMap;
    taskBoard.statusType.forEach((type) => {
      if (!groupMap.has(type.id)) groupMap.set(type.id, ref([]));
    });
    taskResp.issues.forEach((issue) => {
      if (groupMap.has(issue.status_id)) groupMap.get(issue.status_id).value?.push(issue);
    });
    taskBoard.groupMap = groupMap;
    // taskBoard.groupMap = groupMap;
    // console.log('groupMap', groupMap);
  };
  const taskStatusTypes = async () => {
    const resp = await getTaskStatusTypes({
      token: localStorage.getItem('token'),
    });
    taskBoard.statusType = resp.tracker;
    console.log(`output->resp`, resp);
  };

  const getStatusName = (typeId: number) => {
    return taskBoard.statusType.find((item) => item.id === typeId);
  };
  // 新建任务
  const addTask = () => {
    isShowCreateModal.value = true;
  };

  // 拖拽改变
  const dragChange = (evt) => {
    const todo = evt.added?.element;

    console.log(`output->todo`, todo);
    // if (todo && todo.done !== props.done) {
    //   const mutation = props.done ? M.DONE_TODO : M.UNDONE_TODO;
    //   store.commit(mutation, todo);
    // }
  };
  const isShowCreateModal = ref(false);
  const showCreateModal = (flag: boolean) => {
    isShowCreateModal.value = flag;
  };
</script>

<style scoped>
  .task-sidebar {
    box-shadow: 0px 10px 24px rgba(0, 0, 0, 0.1);
  }
</style>
