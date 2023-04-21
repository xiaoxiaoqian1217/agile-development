<template>
  <div>
    <Modal
      style="top: 50px"
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
        <div class="w-30"><span class="label">任务类型</span></div>
        <div class="flex-auto">
          <TaskTypeSelect
            :tracker_id="formModel.tracker_id"
            @change="handleTrackerChange"
          ></TaskTypeSelect>
        </div>
      </div>
      <div class="flex py-2 my-1 items-center">
        <div class="w-30"><span class="label">状态</span></div>
        <div class="flex-auto">
          <Dropdown :trigger="['click']">
            <a class="ant-dropdown-link" @click.prevent>
              {{ seletedStatusName }}
              <span class="filter"></span>
            </a>
            <template #overlay>
              <Menu class="w-200px" @click="({ key }) => onChange(key, 'status_id')">
                <template v-for="status in statusList" :key="status.id">
                  <MenuItem>
                    <div class="flex justify-between">
                      <span>{{ status.name }}</span>
                      <span v-if="formModel.status_id === status.id">
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
        <div class="w-30"><span class="label">执行者</span></div>
        <div class="flex-auto">
          <SelectMember
            class="w-250px"
            @on-change="(value) => onChange(value, 'assigned_to_id')"
            :value="formModel.assigned_to_id"
          ></SelectMember>
        </div>
      </div>
      <div class="flex py-2 my-1 items-center">
        <div class="w-30"><span class="label">备注</span></div>
        <div>
          <Textarea
            class="w-250px"
            @blur="(value) => onChange(formModel.description, 'description')"
            v-model:value="formModel.description"
            placeholder="添加备注"
            :rows="4"
          />
        </div>
      </div>
      <div class="flex py-2 my-1 items-center">
        <div class="w-30"><span class="label">优先级</span></div>
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
        <div class="inline-block w-30"><span class="label">目标版本</span></div>
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
        <div class="w-30"><span class="label">日期</span></div>
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
        <div class="w-30"><span class="label">预计工时</span></div>
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
  import { ref, reactive, onMounted, computed, toRaw, inject } from 'vue';
  import { useRoute } from 'vue-router';
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
  import { CheckOutlined } from '@ant-design/icons-vue';
  import { SelectMember, TaskTypeSelect } from '@/components';
  import { updateTask } from '@apis/index';
  import { LevelType } from '../constants';
  import { iconTypes } from '@/components/task-list/icon';

  const route = useRoute();
  const projectId = route.params.projectId;
  const props = defineProps({
    visible: Boolean,
    detail: {},
  });
  const { detail } = props;
  const emits = defineEmits(['onVisible']);
  const visible = computed(() => {
    return props.visible;
  });
  const versionList = inject('versionList');

  const defaultDetail = {
    ...props.detail,
    start_date: detail?.start_date ? dayjs(detail.start_date) : undefined,
    due_date: detail?.due_date ? dayjs(detail?.due_date) : undefined,
  };

  const formModel = reactive(defaultDetail);
  const levels = inject('levelList');
  const statusList = inject('statusList');
  const trackers = inject('trackersList');

  const seletedTrackerName = computed(() => {
    return trackers.value?.find((tracker) => formModel.tracker_id === tracker.id)?.name;
  });

  const seletedStatusName = computed(() => {
    return statusList.value?.find((status) => formModel.status_id === status.id)?.name;
  });

  const seletedLevelName = computed(() => {
    return levels.value?.find((level) => formModel.priority_id === level.id)?.name;
  });
  const onChange = (value, idKey: string) => {
    formModel[idKey] = value;
    updateTaskDetail({ [idKey]: formModel[idKey] });
  };
  const handleTrackerChange = (tracker_id: number) => {
    formModel.tracker_id = tracker_id;
    updateTaskDetail({ tracker_id: tracker_id });
  };
  const seletedVersionName = computed(() => {
    return versionList.value?.find((version) => formModel.fixed_version_id === version.id)?.name;
  });

  const updateTaskDetail = async (params) => {
    await updateTask({
      id: formModel.id,
      token: localStorage.getItem('token'),
      ...params,
    });
  };

  const handleCancel = () => {
    emits('onVisible', false);
  };

  const titleElement = ref(null);
  const validate = (title = '更新失败', tip = '标题不能为空') => {
    if (!formModel['subject']) {
      notification.error({
        message: title,
        placement: 'bottomLeft',
        description: tip,
      });
      return false;
    } else return true;
  };
  function subjectChange() {
    const text = titleElement.value.innerText.trim();
    formModel.subject = text;
    if (!validate()) return false;

    updateTaskDetail({ subject: formModel.subject });
  }
  const computedDateRange = computed(() => {
    return [formModel.start_date, formModel.due_date];
  });
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
