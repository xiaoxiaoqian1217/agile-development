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
        <div class="flex">
          <div class="mr-5" v-for="[type, values] in taskBoard.groupMap" :key="type">
            <div class="flex">
              <div class="py-2.5">
                <span class="mr-3 font-500 text-sm">
                  {{ getStatusName(type)?.name }}
                </span>
                <span class="text-xs text-gray-500"> {{ values.length }} </span>
              </div>
              <!-- <span>...</span> -->
            </div>
            <div class="flex flex-col w-272px">
              <div class="mb-2 bg-light-50 h-90px" v-for="task in values" :key="task.id">
                <div class="ml-3.5 mt-3.5">
                  <Checkbox :checked="task.status === Status.close || task.stats === Status.solve">
                    <span class="ml-3 text-sm">{{ task.subject }}</span>
                  </Checkbox>
                </div>
                <div></div>
              </div>
              <template v-if="type === Status.new">
                <div class="shadow bg-light-50" @click="addTask">
                  <div class="text-center"><PlusOutlined /></div>
                </div>
              </template>
            </div>
          </div>
        </div>
        <!-- <router-view v-slot="{ Component }">
        <component :is="Component" />
      </router-view> -->
      </div>
    </div>
    <!--  -->
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, onMounted, reactive } from 'vue';
  import { Tabs, Drawer, Dropdown, Menu, MenuItem, Checkbox } from 'ant-design-vue';
  import { PlusOutlined, FilterOutlined } from '@ant-design/icons-vue';
  import { useRouter, useRoute } from 'vue-router';
  import { Status } from '../../types';
  import { getTaskStatusTypes, getTaskList } from '../../apis';

  const route = useRoute();
  const router = useRouter();
  const projectId = route.params.projectId;
  onMounted(() => {
    toAllTask();
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
      pid: 5,
      token: localStorage.getItem('token'),
      sort: 'status:desc',
    });
    const groupMap = taskBoard.groupMap;
    taskBoard.statusType.forEach((type) => {
      if (!groupMap.has(type.id)) groupMap.set(type.id, []);
    });
    taskResp.issues.forEach((issue) => {
      if (groupMap.has(issue.status)) groupMap.get(issue.status)?.push(issue);
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
  const addTask = () => {};
</script>

<style scoped>
  .task-sidebar {
    box-shadow: 0px 10px 24px rgba(0, 0, 0, 0.1);
  }
</style>
