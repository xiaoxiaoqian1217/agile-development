<template>
  <div>
    <Modal
      v-model:visible="visible"
      :title="`创建${seletedTrackerName}`"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <template #footer>
        <Button key="back" @click="handleCancel">取消</Button>
        <Button key="submit" type="primary" :loading="loading" @click="handleOk">完成</Button>
      </template>
      <Textarea class="w-full" v-model:value="formModel.subject" placeholder="输入标题" :rows="4" />

      <div class="flex py-2 my-3">
        <div class="project-name"></div>
        <div class="tracker">
          <Dropdown :trigger="['click']">
            <div class="flex" @click.prevent>
              <img
                class="w-20px h-20px mr-1"
                :src="iconTypes[`type${formModel.tracker_id}`] || iconTypes.type3"
              />
              {{ seletedTrackerName }}
              <span class="px-1">·</span>
            </div>
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
        <div class="mr-5 status">
          <Dropdown :trigger="['click']">
            <a class="ant-dropdown-link" @click.prevent>
              {{ defaultStatus?.name }}
              <span class="filter"></span>
            </a>
            <template #overlay>
              <Menu @click="statusChange">
                <template v-for="status in [defaultStatus]" :key="status.id">
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
      <Divider />

      <!-- label项 -->
      <div class="">
        <div class="flex py-2 my-3 items-center">
          <div class="inline-block w-30"><span class="label">执行者</span></div>
          <div class="flex-auto">
            <SelectMember @on-change="assignedMemeberChange"></SelectMember>
          </div>
        </div>
        <div class="flex py-2 my-3">
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
        <!-- <div>
          <div><span class="label">状态</span></div>
          <div></div>
        </div> -->
        <div class="flex py-2 my-3 items-center">
          <div class="inline-block w-30"><span class="label">优先级 </span></div>

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
        <!-- <div class="flex py-2 my-3 items-center">
          <div class="w-30"><span class="label">开始日期</span></div>
          <div class="flex-auto">
            <DatePicker class="w-250px" v-model:value="formModel.start_date" />
          </div>
        </div> -->
        <div class="flex py-2 my-3">
          <div class="w-30"><span class="label">计划完成日期</span></div>
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
        <div>
          <div><span class="label"></span></div>
          <div></div>
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
    Tag,
    RangePicker,
  } from 'ant-design-vue';
  import { createTask } from '@apis/index';
  import { SelectMember } from '@/components';
  import { iconTypes } from '@/components/task-list/icon';
  import { LevelType } from '../constants';

  const route = useRoute();
  const projectId = route.params.projectId;
  const props = defineProps({
    visible: Boolean,
  });
  const emits = defineEmits(['onVisible']);
  const loading = ref<boolean>(false);
  // const visible = ref<boolean>(false);
  const visible = computed(() => {
    return props.visible;
  });
  const formModel = reactive({
    author: '',
    description: '',
    priority: 2,
    subject: '',
    tracker_id: 1, // 任务类型
    status_id: 1,
    priority_id: 1, // 私有还是共有，默认是私有
    category_id: '',
    fixed_version_id: '', // 修改没有版本会错误
    is_private: 1,
    assigned_to_id: -1,
    estimated_hours: '',
    done_ratio: '',
    start_date: dayjs(),
    due_date: dayjs(),
    watcher_user_ids: '',
    parent_issue_id: '',
  });

  const levels = inject('levelList');
  const statusList = inject('statusList');
  const trackers = inject('trackersList');
  const versionList = inject('versionList');
  const memberList = inject('memberList');
  console.log(`output->trackers`, trackers, levels);

  const defaultStatus = computed(() => {
    return statusList.value[0];
  });
  const seletedTrackerName = computed(() => {
    return trackers.value?.find((tracker) => formModel.tracker_id === tracker.id)?.name;
  });
  const trackerChange = ({ item, key }) => {
    formModel.tracker_id = key;
  };

  // const seletedStatusName = computed(() => {
  //   return statusList.value?.find((status) => formModel.status_id === status.id)?.name;
  // });
  const statusChange = ({ item, key }) => {
    formModel.status_id = key;
  };

  // 查询任务优先级
  // const seletedLevelId = ref();
  const seletedLevelName = computed(() => {
    return levels.value?.find((level) => formModel.priority_id === level.id)?.name;
  });

  const levelChange = ({ item, key }) => {
    formModel.priority_id = key;
  };

  // 获取版本列表
  const seletedVersionName = computed(() => {
    return versionList.value?.find((version) => formModel.fixed_version_id === version.id)?.name;
  });
  const versionChange = ({ item, key }) => {
    formModel.fixed_version_id = key;
  };

  // 校验提交的内容
  const validate = (type = 'error', title = '失败', tip = '标题不能为空') => {
    if (!formModel['subject']) {
      notification.error({
        message: title,
        placement: 'bottomLeft',
        description: tip,
      });
      return false;
    } else return true;
  };

  const handleOk = async () => {
    if (!validate()) return false;
    loading.value = true;
    const start_date = dayjs(formModel.start_date).format('YYYY-MM-DD');
    const due_date = dayjs(formModel.due_date).format('YYYY-MM-DD');
    await createTask({
      pid: projectId,
      token: localStorage.getItem('token'),
      ...toRaw(formModel),
      start_date,
      due_date,
    });
    loading.value = false;
    emits('onVisible', false);
  };

  const handleCancel = () => {
    emits('onVisible', false);
  };
  const assignedMemeberChange = (value: string) => {
    formModel.assigned_to_id = Number(value);
  };
  const computedDateRange = computed(() => {
    return [dayjs(formModel.start_date), dayjs(formModel.due_date)];
  });
  const disabledDate = (current: Dayjs) => {
    return current && current < dayjs().endOf('day');
  };

  const onRangeChange = (date: [Dayjs, Dayjs], dateString: [string, string]) => {
    const [start_date, due_date] = date;
    formModel.start_date = start_date;
    formModel.due_date = due_date;
  };
</script>

<style scoped></style>
