<template>
  <div>
    <Modal v-model:visible="visible" :title="`${seletedTrackerName}`" @ok="handleOk" @cancel="handleCancel">
      <!-- 可编辑的标题 -->
      <div ref="titleElement" class="bg-gray-50 w-full h-12" contenteditable spellcheck="false" @blur="validate">
        {{ formModel.subject }}
      </div>
      <div class="">
        <div class="flex py-2 my-3 items-center">
          <div class="w-30"><span class="label">项目</span></div>
          <div class="flex-auto"></div>
        </div>
        <div class="flex py-2 my-3 items-center">
          <div class="w-30"><span class="label">项目类型</span></div>
          <div class="flex-auto">
            <Dropdown :trigger="['click']">
              <a class="ant-dropdown-link" @click.prevent>
                {{ seletedTrackerName }}
                <span class="filter"></span>
              </a>
              <template #overlay>
                <Menu @click="trackerChange">
                  <template v-for="tracker in trackers" :key="tracker.id">
                    <MenuItem>
                      <div class="flex justify-between">
                        <span>{{ tracker.name }}</span>
                        <span v-if="formModel.tracker_id === tracker.id"></span>
                      </div>
                    </MenuItem>
                  </template>
                </Menu>
              </template>
            </Dropdown>
          </div>
        </div>
        <div class="flex py-2 my-3 items-center">
          <div class="w-30"><span class="label">状态</span></div>
          <div class="flex-auto">
            <Dropdown :trigger="['click']">
              <a class="ant-dropdown-link" @click.prevent>
                {{ seletedStatusName }}
                <span class="filter"></span>
              </a>
              <template #overlay>
                <Menu @click="statusChange">
                  <template v-for="status in statusList" :key="status.id">
                    <MenuItem>
                      <div class="flex justify-between">
                        <span>{{ status.name }}</span>
                        <span v-if="formModel.status_id === status.id"></span>
                      </div>
                    </MenuItem>
                  </template>
                </Menu>
              </template>
            </Dropdown>
          </div>
        </div>
        <div class="flex py-2 my-3 items-center">
          <div class="w-30"><span class="label">执行者</span></div>
          <div class="flex-auto">
            <Dropdown :trigger="['click']">
              <a class="ant-dropdown-link" @click.prevent>
                {{ assignedMember }}
                <span class="filter"></span>
              </a>
              <template #overlay>
                <AutoComplete
                  allowClear
                  v-model:value="assignedMember"
                  style="width: 200px"
                  placeholder="input here"
                  :options="userList"
                  @search="handleSearch"
                  :defaultOpen="true"
                >
                  <template #option="{ value, label }">
                    <!-- <template v-for="userInfo in userList" :key="userInfo.id"> -->
                    <div class="flex px-5 items-center">
                      <div class="w-8 h-8 bg-amber-200 mr-3 rounded-1/2 flex items-center justify-center text-white">
                        <span>{{ userInfo.user.name?.slice(0, 2) }}</span>
                      </div>
                      <span class="truncate font-500 text-neutral-800">{{ userInfo?.user.name }}</span>
                      <span>{{ value }}</span>
                      <span>{{ label }}</span>
                    </div>
                    <!-- </template> -->
                  </template>
                </AutoComplete>
                <!-- <div>
                  <a-input v-model:value="searchMember" placeholder="搜索" />
                  <template v-for="userInfo in userList" :key="userInfo.id">
                    <div class="flex px-5 items-center">
                      <div class="w-8 h-8 bg-amber-200 mr-3 rounded-1/2 flex items-center justify-center text-white">
                        <span>{{ userInfo.user.name?.slice(0, 2) }}</span>
                      </div>
                      <span class="truncate font-500 text-neutral-800">{{ userInfo?.user.name }}</span>
                      <span></span>
                    </div>
                  </template>
                </div> -->
              </template>
            </Dropdown>
          </div>
        </div>
        <div class="flex py-2 my-3 items-center">
          <div class="inline-block w-30"><span class="label">优先级</span></div>
          <div class="flex-auto">
            <Dropdown :trigger="['click']">
              <a class="ant-dropdown-link" @click.prevent>
                {{ seletedLevelName }}
                <span class="filter"></span>
              </a>
              <template #overlay>
                <Menu @click="levelChange">
                  <template v-for="level in levels" :key="level.id">
                    <MenuItem>
                      <div class="flex justify-between">
                        <span>{{ level.name }}</span>
                        <span v-if="formModel.priority_id === level.id"></span>
                      </div>
                    </MenuItem>
                  </template>
                </Menu>
              </template>
            </Dropdown>
          </div>
        </div>
        <div class="flex py-2 my-3 items-center">
          <div class="inline-block w-30"><span class="label">目标版本</span></div>
          <div class="flex-auto">
            <Dropdown :trigger="['click']">
              <a class="ant-dropdown-link" @click.prevent>
                {{ seletedVersionName }}
                <span class="filter"></span>
              </a>
              <template #overlay>
                <Menu @click="versionChange">
                  <MenuItem key="">
                    <div class="flex justify-between">
                      <span>无</span>
                    </div>
                  </MenuItem>
                  <template v-for="version in versionList" :key="version.id">
                    <MenuItem>
                      <div class="flex justify-between">
                        <span>{{ version.name }}</span>
                        <span v-if="formModel.fixed_version_id === version.id"></span>
                      </div>
                    </MenuItem>
                  </template>
                </Menu>
              </template>
            </Dropdown>
          </div>
        </div>
        <div class="flex py-2 my-3 items-center">
          <div class="w-30"><span class="label">开始日期</span></div>
          <div class="flex-auto"><DatePicker v-model:value="formModel.start_date" /></div>
        </div>
        <div class="flex py-2 my-3">
          <div class="w-30"><span class="label">计划完成日期</span></div>
          <div class="flex-auto"><DatePicker v-model:value="formModel.due_date" /></div>
        </div>
        <div class="flex py-2 my-3 items-center">
          <div class="w-30"><span class="label">预期时间</span></div>
          <div class="flex-auto">
            <InputNumber
              placeholder="请输入计划工时（小时）"
              v-model:value="formModel.estimated_hours"
              :min="0"
              :formatter="(val) => `${val}小时`"
              :parser="(val) => val.replace('小时', '')"
            />
          </div>
        </div>
        <div class="flex py-2 my-3 items-center">
          <div class="w-30"><span class="label"></span></div>
          <div class="flex-auto"></div>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted, computed, defineProps, toRaw, unref } from 'vue';
  import { useRoute } from 'vue-router';
  import dayjs, { Dayjs } from 'dayjs';
  import {
    MenuItem,
    Menu,
    Divider,
    Modal,
    Button,
    Dropdown,
    Textarea,
    DatePicker,
    InputNumber,
    notification,
    AutoComplete,
  } from 'ant-design-vue';
  import { fetchTrackerTypes, getTaskStatusTypes, fetchTaskLevel, updateTask } from '@apis/index';
  import { useProjectApi, useCommonApis } from '@hooks/index';
  const route = useRoute();
  const projectId = route.params.projectId;
  const props = defineProps({
    visible: Boolean,
    detail: {},
  });
  const { detail } = props;
  console.log(`output->prosp detail`, detail, props.detail);
  const emits = defineEmits(['onVisible']);
  const loading = ref<boolean>(false);
  // const visible = ref<boolean>(false);
  const visible = computed(() => {
    return props.visible;
  });

  const defaultDetail = {
    fixed_version_id: '',
    is_private: '',
    assigned_to_id: '',
    estimated_hours: '',
    ...props.detail,
    start_date: dayjs(detail.start_date),
    due_date: dayjs(detail?.due_date),
  };

  const formModel = reactive(defaultDetail);

  onMounted(() => {
    getTrackerTypes();
    taskStatusTypes();
    getTaskLevel();
  });

  const showModal = () => {
    emits('onVisible', true);
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
  const seletedTrackerName = computed(() => {
    return trackers.value?.find((tracker) => formModel.tracker_id === tracker.id)?.name;
  });
  // const seletedTrackerId = ref();
  const trackerChange = ({ item, key }) => {
    formModel.tracker_id = key;
  };
  // 获取任务状态

  const statusList = ref();
  // const seletedStatusId = ref();

  const seletedStatusName = computed(() => {
    return statusList.value?.find((status) => formModel.status_id === status.id)?.name;
  });
  const taskStatusTypes = async () => {
    const resp = await getTaskStatusTypes({
      token: localStorage.getItem('token'),
    });
    statusList.value = resp.tracker;
    console.log(`output->resp`, resp);
  };
  const statusChange = ({ item, key }) => {
    formModel.status_id = key;
  };

  const taskName = ref('');
  const description = ref('');

  // 查询任务优先级
  const levels = ref([]);
  // const seletedLevelId = ref();
  const seletedLevelName = computed(() => {
    return levels.value?.find((level) => formModel.priority_id === level.id)?.name;
  });
  const getTaskLevel = async () => {
    const resp = await fetchTaskLevel({
      token: localStorage.getItem('token'),
      pid: projectId,
    });
    levels.value = resp.priority;
    console.log(`output->priority`, levels.value);
  };
  const levelChange = ({ item, key }) => {
    formModel.priority_id = key;
  };

  // 获取版本列表
  const seletedVersionName = computed(() => {
    return versionList.value?.find((version) => formModel.fixed_version_id === version.id)?.name || '请选择版本';
  });
  const versionChange = ({ item, key }) => {
    formModel.fixed_version_id = key;
  };

  const { versionList } = useProjectApi();
  const handleOk = async () => {
    loading.value = true;
    const resp = await updateTask({
      pid: projectId,
      token: localStorage.getItem('token'),
      ...toRaw(formModel),
      start_date: dayjs(formModel.start_date).format('YYYY-MM-DD'),
      due_date: dayjs(formModel.due_date).format('YYYY-MM-DD'),
    });
    loading.value = false;
    emits('onVisible', false);

    // setTimeout(() => {
    // }, 2000);
  };

  const handleCancel = () => {
    emits('onVisible', false);
  };
  const { userList } = useCommonApis();
  const filterList = ref(unref(userList));

  const titleElement = ref(null);

  function validate() {
    if (!titleElement.value.innerText.trim()) return false;
    formModel.subject = titleElement.value.innerText.trim();
  }

  const assignedMember = computed(() => {
    return userList.value?.find((userInfo) => formModel.assigned_to_id === userInfo.user.id)?.user?.name;
  });

  const handleSearch = (val: string) => {
    let res: { value: string }[];
    if (!val) {
      res = [];
    } else {
      res = userList.value;
    }
    filterList.value = res;
  };
</script>

<style scoped></style>
