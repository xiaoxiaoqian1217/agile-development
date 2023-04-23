<template>
  <div>
    <Modal
      style="top: 50px; width: 600px"
      v-model:visible="visible"
      :title="`${seletedTrackerName}`"
      @cancel="handleCancel"
      :footer="null"
    >
      <!-- 可编辑的标题 -->
      <div
        ref="titleElement"
        class="bg-gray-50 w-full h-12 p-2 outline-none"
        contenteditable
        spellcheck="false"
        @blur="subjectChange"
      >
        {{ formModel.subject }}
      </div>
      <div class="flex py-2 my-1 items-center">
        <div class="w-30 flex items-center">
          <CreditCardOutlined /><span class="label ml-8px">任务类型</span>
        </div>
        <div class="flex-auto">
          <TaskTypeSelect
            :tracker_id="formModel.tracker_id"
            @change="handleTrackerChange"
          ></TaskTypeSelect>
        </div>
      </div>
      <div class="flex py-2 my-1 items-center">
        <div class="w-30 flex items-center">
          <CheckSquareOutlined /><span class="label ml-8px">状态</span>
        </div>
        <div class="flex-auto">
          <TaskStatusSelect
            :tracker_id="formModel.tracker_id"
            :status_id="formModel.status_id"
            @change="(key) => onChange(key, 'status_id')"
          />
        </div>
      </div>
      <div class="flex py-2 my-1 items-center">
        <div class="w-30 flex items-center">
          <UserOutlined /><span class="label ml-8px">执行者</span>
        </div>
        <div class="flex-auto">
          <SelectMember
            class="w-250px"
            @on-change="(value) => onChange(value, 'assigned_to_id')"
            :value="formModel.assigned_to_id"
          ></SelectMember>
        </div>
      </div>
      <div class="flex py-2 my-1 items-center">
        <div class="w-30 flex"><FileTextOutlined /><span class="label ml-8px">备注</span></div>
        <div>
          <Textarea
            class="w-400px"
            @blur="(value) => onChange(formModel.description, 'description')"
            v-model:value="formModel.description"
            placeholder="添加备注"
            :rows="4"
          />
        </div>
      </div>
      <div class="flex py-2 my-1 items-center">
        <div class="w-30 flex items-center">
          <i class="iconfont icon-circle text-gray-600 text-12px"></i>
          <span class="label ml-8px">优先级</span>
        </div>
        <div class="flex-auto">
          <Dropdown :trigger="['click']" class="w-150px">
            <div>
              <Tag v-if="seletedLevelName" :color="LevelType[formModel?.priority_id]">
                {{ seletedLevelName }}
              </Tag>
            </div>

            <template #overlay>
              <Menu class="w-200px" @click="({ key }) => onChange(key, 'priority_id')">
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
          <Dropdown :trigger="['click']">
            <a class="ant-dropdown-link" @click.prevent>
              <span v-if="seletedVersionName">{{ seletedVersionName }}</span>
              <span v-else> 待添加</span>
            </a>
            <template #overlay>
              <Menu class="w-200px" @click="({ key }) => onChange(key, 'fixed_version_id')">
                <MenuItem key="">
                  <div class="flex justify-between">
                    <span>无</span>
                  </div>
                </MenuItem>
                <template v-for="version in versionList" :key="version.id">
                  <MenuItem>
                    <div class="flex justify-between">
                      <span>{{ version.name }}</span>
                      <span v-if="formModel.fixed_version_id === version.id">
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

      <div class="flex py-2 my-1">
        <div class="w-30 flex items-center">
          <CalendarOutlined /><span class="label ml-8px">日期</span>
        </div>
        <div class="flex-auto">
          <RangePicker
            :disabled-date="disabledDate"
            class="w-250px"
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
            @change="(value) => onChange(value, 'estimated_hours')"
            :min="0.5"
            :formatter="(val) => `${val}小时`"
            :parser="(val) => val.replace('小时', '')"
          />
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, computed, inject, Ref } from 'vue';
  import dayjs, { Dayjs } from 'dayjs';
  import {
    Modal,
    MenuItem,
    Menu,
    Dropdown,
    Textarea,
    Tag,
    InputNumber,
    notification,
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
  import { SelectMember, TaskTypeSelect, TaskStatusSelect } from '@/components';
  import { updateTask } from '@apis/index';
  import { LevelType } from '../constants';
  import { FieldItem, TaskItem } from '@/types';
  const props = defineProps<{ visible: boolean; detail: TaskItem }>();
  const { detail } = props;
  const emits = defineEmits(['onVisible']);
  const visible = computed(() => {
    return props.visible;
  });
  const versionList = inject<Ref<FieldItem[]>>('versionList');

  const defaultDetail = {
    ...props.detail,
    start_date: detail?.start_date ? dayjs(detail.start_date) : undefined,
    due_date: detail?.due_date ? dayjs(detail.due_date) : undefined,
  };

  const formModel = reactive(defaultDetail);
  const levels = inject<Ref<FieldItem[]>>('levelList');
  const trackers = inject<Ref<FieldItem[]>>('trackersList');

  const seletedTrackerName = computed(() => {
    return trackers?.value.find((tracker) => formModel.tracker_id === tracker.id)?.name;
  });

  const seletedLevelName = computed(() => {
    return levels?.value?.find((level) => formModel.priority_id === level.id)?.name;
  });
  const onChange = (value, idKey: string) => {
    formModel[idKey] = value;
    updateTaskDetail({ [idKey]: formModel[idKey] });
  };
  const handleTrackerChange = (tracker_id: number) => {
    formModel.tracker_id = tracker_id;
    updateTaskDetail({ tracker_id: tracker_id });
  };
  const handleCancel = () => {
    emits('onVisible', false);
  };
  const seletedVersionName = computed(() => {
    return versionList?.value?.find(
      (version: FieldItem) => formModel.fixed_version_id === version.id
    )?.name;
  });

  const subjectChange = () => {
    const text = titleElement.value?.innerText?.trim();
    formModel.subject = text;
    if (!validate()) return false;
    updateTaskDetail({ subject: formModel.subject });
  };
  const computedDateRange = computed(() => {
    return [formModel.start_date, formModel.due_date];
  });

  const titleElement = ref(null);
  const validate = (title = '更新失败', tip = '标题不能为空') => {
    if (!formModel['subject']) {
      notification.error({
        message: '更新失败',
        placement: 'bottomLeft',
        description: '标题不能为空',
      });
      return false;
    } else return true;
  };
  const updateTaskDetail = async (params) => {
    const token = localStorage.getItem('token');
    await updateTask({
      id: formModel.id,
      token,
      ...params,
    });
  };
  const disabledDate = (current: Dayjs) => {
    return current && current < dayjs().endOf('day');
  };

  const onRangeChange = (date: [Dayjs, Dayjs], dateString: [string, string]) => {
    let start_date = undefined;
    let due_date = undefined;
    if (date) {
      start_date = date[0];
      due_date = date[1];
    }
    formModel.start_date = start_date;
    formModel.due_date = due_date;
    date && updateTaskDetail({ start_date: dateString[0], due_date: dateString[1] });
  };
</script>

<style scoped></style>
