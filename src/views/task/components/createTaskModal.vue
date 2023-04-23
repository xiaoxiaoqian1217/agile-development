<template>
  <div>
    <Modal
      style="top: 50px; width: 600px"
      v-model:visible="visible"
      :title="`创建${seletedTrackerName}`"
      @ok="addTask"
      @cancel="handleCancel"
    >
      <template #footer>
        <Button key="back" @click="createNew" type="primary" ghost :loading="loading"
          >完成并创建下一个</Button
        >
        <Button key="submit" type="primary" :loading="loading" @click="addTask">完成</Button>
      </template>
      <Textarea class="w-full" v-model:value="formModel.subject" placeholder="输入标题" :rows="3" />

      <div class="flex py-2 my-2 cursor-pointer hover:text-blue-default">
        <div class="project-name"></div>
        <div class="flex tracker">
          <TaskTypeSelect :tracker_id="formModel.tracker_id" @change="handleTrackerChange">
            <span class="px-1">·</span>
          </TaskTypeSelect>
        </div>
        <div class="mr-5 status">
          <TaskStatusSelect
            :tracker_id="formModel.tracker_id"
            :status_id="formModel.status_id"
            @change="statusChange"
          >
            <span class="px-1">·</span>
          </TaskStatusSelect>
          <!-- <Dropdown :trigger="['click']">
            <span class="text-14px" @click.prevent>
              <span> {{ computedStatusName }} </span>
              <DownOutlined class="ml-1" />
            </span>
            <template #overlay>
              <Menu @click="statusChange" class="w-150px">
                <template v-for="status in getDefaultStatus()" :key="status.id">
                  <MenuItem>
                    <div class="flex justify-between">
                      <span>{{ status?.name }}</span>
                      <span v-if="formModel.status_id === status?.id"></span>
                    </div>
                  </MenuItem>
                </template>
              </Menu>
            </template>
          </Dropdown> -->
        </div>
      </div>
      <div class="h-1px bg-gray-100" />

      <!-- label项 -->
      <div class="">
        <div class="flex py-2 my-1 items-center">
          <div class="w-30 flex items-center">
            <UserOutlined /><span class="label ml-8px">执行者</span>
          </div>
          <div class="flex-auto">
            <SelectMember class="w-250px" @on-change="assignedMemeberChange"></SelectMember>
          </div>
        </div>
        <div class="flex py-2 my-1">
          <div class="w-30 flex"><FileTextOutlined /><span class="label ml-8px">备注</span></div>
          <div>
            <Textarea
              class="w-400px"
              v-model:value="formModel.description"
              placeholder="添加备注"
              :rows="4"
            />
          </div>
        </div>
        <!-- <div>
          <div><span class="label">状态</span></div>
          <div></div>
        </div> -->
        <div class="flex py-2 my-1 items-center">
          <div class="w-30 flex items-center">
            <i class="iconfont icon-circle text-12px"></i>
            <span class="label ml-8px">优先级</span>
          </div>

          <div class="flex-auto">
            <Dropdown :trigger="['click']" class="w-250px">
              <div @click.prevent>
                <Tag v-if="seletedLevelName" :color="LevelType[formModel?.priority_id]">
                  {{ seletedLevelName }}
                </Tag>
                <span v-else> 待添加</span>
              </div>
              <template #overlay>
                <Menu @click="levelChange">
                  <template v-for="level in levels" :key="level.id">
                    <MenuItem>
                      <div class="flex justify-between">
                        <Tag :color="LevelType[level.id]">
                          {{ level.name }}
                        </Tag>
                        <span v-if="formModel.priority_id === level.id">
                          <CheckOutlined />
                        </span>
                      </div>
                    </MenuItem>
                  </template>
                </Menu>
              </template>
            </Dropdown>
          </div>
        </div>
        <div class="flex py-2 my-1 items-center">
          <div class="inline-block w-30 flex items-center">
            <i class="iconfont icon-running text-gray-600"></i>
            <span class="label ml-8px">目标版本</span>
          </div>
          <div class="flex-auto">
            <Dropdown :trigger="['click']" class="w-250px">
              <a class="inline-block" @click.prevent>
                <span v-if="seletedVersionName">{{ seletedVersionName }}</span>
                <span v-else> 待添加</span>
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
        <div class="flex py-2 my-1">
          <div class="w-30 flex items-center">
            <CalendarOutlined /><span class="label ml-8px">日期</span>
          </div>
          <div class="w-250px items-center">
            <RangePicker
              :disabled-date="disabledDate"
              v-model:value="computedDateRange"
              @change="onRangeChange"
            />
          </div>
        </div>
        <div class="flex py-2 my-1 items-center">
          <div class="w-30 flex items-center">
            <ClockCircleOutlined /><span class="label ml-8px">预计工时</span>
          </div>
          <div class="flex-auto">
            <InputNumber
              class="w-250px"
              placeholder="请输入计划工时（小时）"
              v-model:value="formModel.estimated_hours"
              :min="0"
              :formatter="(val) => `${val}小时`"
              :parser="(val) => val.replace('小时', '')"
            />
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, computed, toRaw, inject, type Ref } from 'vue';
  import { useRoute } from 'vue-router';
  import dayjs, { Dayjs } from 'dayjs';
  import {
    MenuItem,
    Menu,
    Modal,
    Button,
    Dropdown,
    Textarea,
    InputNumber,
    notification,
    Tag,
    RangePicker,
  } from 'ant-design-vue';
  import {
    CheckOutlined,
    CheckSquareOutlined,
    UserOutlined,
    FileTextOutlined,
    ClockCircleOutlined,
    CalendarOutlined,
    CreditCardOutlined,
  } from '@ant-design/icons-vue';
  import { createTask } from '@apis/index';
  import { SelectMember, TaskTypeSelect, TaskStatusSelect } from '@/components';
  import { LevelType } from '../constants';
  import { FieldItem, Status, TrackerType, TaskItem } from '@/types';
  const route = useRoute();
  const projectId = route.params.projectId;
  const props = defineProps({
    visible: Boolean,
  });
  const emits = defineEmits(['onVisible']);
  const loading = ref<boolean>(false);
  const visible = computed(() => {
    return props.visible;
  });
  const defaultFormModel = {
    id: 0,
    author: '',
    description: '',
    subject: '',
    tracker_id: 1, // 任务类型
    status_id: 1,
    priority_id: 1, // 私有还是共有，默认是私有
    category_id: '',
    fixed_version_id: '', // 修改没有版本会错误
    is_private: 1,
    assigned_to_id: '',
    estimated_hours: '',
    done_ratio: '',
    start_date: undefined,
    due_date: undefined,
    watcher_user_ids: '',
    parent_issue_id: '',
  };
  const formModel = reactive<TaskItem>({ ...defaultFormModel });

  const levels = inject<Ref<FieldItem[]>>('levelList');
  const statusList = inject<Ref<FieldItem[]>>('statusList');
  const trackers = inject<Ref<FieldItem[]>>('trackersList');
  const versionList = inject<Ref<FieldItem[]>>('versionList');

  const getDefaultStatus = () => {
    if (formModel.tracker_id === TrackerType.error)
      return statusList?.value.filter(
        (item) => item.id === Status.new || item.id === Status.doing || item.id === Status.check
      );
    if (formModel.tracker_id === TrackerType.feature)
      return statusList?.value.filter((item) => item.id === Status.check);
    else return statusList?.value;
  };
  const seletedTrackerName = computed(() => {
    return trackers?.value?.find((tracker) => formModel.tracker_id === tracker.id)?.name;
  });
  const handleTrackerChange = (key: number) => {
    formModel.tracker_id = key;
  };
  const statusChange = (key) => {
    formModel.status_id = key;
  };

  const seletedLevelName = computed(() => {
    return levels?.value?.find((level) => formModel.priority_id === level.id)?.name;
  });

  const levelChange = ({ key }: { key: number }) => {
    formModel.priority_id = key;
  };

  // 获取版本列表
  const seletedVersionName = computed(() => {
    return versionList?.value?.find((version) => formModel.fixed_version_id === version.id)?.name;
  });
  const versionChange = ({ item, key }) => {
    formModel.fixed_version_id = key;
  };

  // 校验提交的内容
  const validateTitle = () => {
    if (!formModel['subject']) {
      notification.error({
        message: '创建失败',
        placement: 'bottomLeft',
        description: '标题不能为空',
      });
      return false;
    }
    return true;
  };
  const addTask = async () => {
    if (!validateTitle()) return false;
    await handleOk();
    emits('onVisible', false);
  };
  const handleOk = async () => {
    loading.value = true;
    const start_date = formModel.start_date
      ? dayjs(formModel.start_date).format('YYYY-MM-DD')
      : undefined;
    const due_date = formModel.due_date
      ? dayjs(formModel.due_date).format('YYYY-MM-DD')
      : undefined;
    try {
      await createTask({
        pid: projectId,
        token: sessionStorage.getItem('token'),
        ...toRaw(formModel),
        start_date,
        due_date,
      });
      loading.value = false;
      notification.success({
        message: `成功创建任务：${formModel.subject}`,
        placement: 'bottomLeft',
      });
      // emits('onVisible', false);
    } catch (error) {
      console.log(`output->error`, error);
    }
  };

  const handleCancel = () => {
    emits('onVisible', false);
  };
  const assignedMemeberChange = (value: string) => {
    formModel.assigned_to_id = Number(value);
  };
  const computedDateRange = computed(() => {
    if (!formModel.start_date && !formModel.due_date) return [];
    return [dayjs(formModel.start_date), dayjs(formModel.due_date)];
  });
  const disabledDate = (current: Dayjs) => {
    return current && current < dayjs().endOf('day');
  };

  const onRangeChange = (date: [Dayjs, Dayjs], dateString: [string, string]) => {
    formModel.start_date = date ? date?.[0] : undefined;
    formModel.due_date = date ? date?.[1] : undefined;
  };
  const createNew = async () => {
    if (!validateTitle()) return false;

    await handleOk();
    Object.keys(formModel).forEach((key) => {
      formModel[key] = defaultFormModel[key];
    });
  };
</script>

<style scoped></style>
