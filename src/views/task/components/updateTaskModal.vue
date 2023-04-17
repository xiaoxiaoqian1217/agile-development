<template>
  <div>
    <Modal
      v-model:visible="visible"
      :title="`${seletedTrackerName}`"
      @cancel="handleCancel"
      :footer="null"
    >
      <!-- 可编辑的标题 -->
      <div
        ref="titleElement"
        class="bg-gray-50 w-full h-12"
        contenteditable
        spellcheck="false"
        @blur="subjectChange"
      >
        {{ formModel.subject }}
      </div>
      <div class="">
        <!-- <div class="flex py-2 my-3 items-center">
          <div class="w-30"><span class="label">项目</span></div>
          <div class="flex-auto"></div>
        </div> -->
        <div class="flex py-2 my-3 items-center">
          <div class="w-30"><span class="label">任务类型</span></div>
          <div class="flex-auto">
            <Dropdown :trigger="['click']">
              <div class="flex" @click.prevent>
                <img
                  class="w-20px h-20px mr-1"
                  :src="iconTypes[`type${formModel.tracker_id}`] || iconTypes.type3"
                />
                {{ seletedTrackerName }}
              </div>
              <template #overlay>
                <Menu @click="({ key }) => onChange(key, 'tracker_id')">
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
            <Dropdown :trigger="['click']" class="w-250px">
              <a class="ant-dropdown-link" @click.prevent>
                {{ seletedStatusName }}
                <span class="filter"></span>
              </a>
              <template #overlay>
                <Menu class="w-250px" @click="({ key }) => onChange(key, 'status_id')">
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
            <SelectMember
              class="w-250px"
              @on-change="(value) => onChange(value, 'assigned_to_id')"
              :value="formModel.assigned_to_id"
            ></SelectMember>
          </div>
        </div>
        <div class="flex py-2 my-3 items-center">
          <div class="w-30"><span class="label">备注</span></div>
          <div>
            <Textarea
              class="w-250px"
              v-model:value="formModel.description"
              placeholder="添加备注"
              :rows="4"
            />
          </div>
        </div>
        <div class="flex py-2 my-3 items-center">
          <div class="w-30"><span class="label">优先级</span></div>
          <div class="flex-auto">
            <Dropdown :trigger="['click']" class="w-250px">
              <div>
                <Tag v-if="seletedLevelName" :color="LevelType[formModel?.priority_id]">
                  {{ seletedLevelName }}
                </Tag>
              </div>

              <template #overlay>
                <Menu @click="({ key }) => onChange(key, 'priority_id')">
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
            <Dropdown :trigger="['click']" class="w-250px">
              <a class="ant-dropdown-link" @click.prevent>
                <span v-if="seletedVersionName">{{ seletedVersionName }}</span>
                <span v-else> 待添加</span>
              </a>
              <template #overlay>
                <Menu @click="({ key }) => onChange(key, 'fixed_version_id')">
                  <MenuItem key="">
                    <div class="flex justify-between">
                      <span>无</span>
                    </div>
                  </MenuItem>
                  <template v-for="version in versionList" :key="version.id">
                    <MenuItem class="w-250px">
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

        <div class="flex py-2 my-3">
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
        <div class="flex py-2 my-3 items-center">
          <div class="w-30"><span class="label">预期时间</span></div>
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
        <div class="flex py-2 my-3 items-center">
          <div class="w-30"><span class="label"></span></div>
          <div class="flex-auto"></div>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted, computed, defineProps, toRaw, inject } from 'vue';
  import { useRoute } from 'vue-router';
  import dayjs, { Dayjs } from 'dayjs';
  import {
    Divider,
    Modal,
    MenuItem,
    Menu,
    Dropdown,
    Textarea,
    Tag,
    DatePicker,
    InputNumber,
    notification,
    RangePicker,
  } from 'ant-design-vue';
  import { SelectMember } from '@/components';
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
    start_date: dayjs(detail?.start_date),
    due_date: dayjs(detail?.due_date),
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
  // const trackerChange = (value, idKey: string) => {
  //   formModel[idKey] = value;
  //   updateTaskDetail({ [idKey]: formModel[idKey] });
  // };

  // const statusChange = ({ item, key }) => {
  //   formModel.status_id = key;

  //   updateTaskDetail({ status_id: formModel.status_id });
  // };
  // const levelChange = () => {
  //   formModel.priority_id = key;

  //   updateTaskDetail({ priority_id: formModel.priority_id });
  // };
  // const versionChange = ({ item, key }) => {
  //   formModel.fixed_version_id = key;

  //   // emits('updateTaskList', { fixed_version_id: key });
  //   updateTaskDetail({ fixed_version_id: formModel.fixed_version_id });
  // };
  const seletedVersionName = computed(() => {
    return versionList.value?.find((version) => formModel.fixed_version_id === version.id)?.name;
  });

  // const assignedMemeberChange = (value: string) => {
  //   updateTaskDetail({ assigned_to_id: Number(value) });
  // };

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
    return [dayjs(formModel.start_date), dayjs(formModel.due_date)];
  });
  const disabledDate = (current: Dayjs) => {
    return current && current < dayjs().endOf('day');
  };

  const onRangeChange = (date: [Dayjs, Dayjs], dateString: [string, string]) => {
    console.log(date, dateString);
    const [start_date, due_date] = date;
    formModel.start_date = start_date;
    formModel.due_date = due_date;
    updateTaskDetail({ start_date: dateString[0], due_date: dateString[1] });
  };
</script>

<style scoped></style>
