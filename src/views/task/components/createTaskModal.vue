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
      <div>
        <div class="member">
          <SelectMember></SelectMember>
        </div>
      </div>
      <div class="flex">
        <div class="mr-5 project-name"></div>
        <div class="mr-5 tracker">
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
        <div class="flex py-2 my-3">
          <div class="w-30"><span class="label">备注</span></div>
          <div>
            <Textarea v-model:value="formModel.description" placeholder="添加备注" :rows="4" />
          </div>
        </div>
        <!-- <div>
          <div><span class="label">状态</span></div>
          <div></div>
        </div> -->
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
                  <MenuItem key="0">
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
  } from 'ant-design-vue';
  import { createTask } from '@apis/index';
  import { SelectMember } from '@/components';

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
    tracker_id: 1,
    status_id: 1,
    priority_id: 1,
    category_id: 11,
    fixed_version_id: '',
    is_private: 1,
    assigned_to_id: '',
    estimated_hours: '',
    done_ratio: '81',
    start_date: dayjs('2023-04-01'),
    due_date: dayjs('2023-04-02'),
    watcher_user_ids: '',
    parent_issue_id: '',
  });

  const levels = inject('levelList');
  const statusList = inject('statusList');
  const trackers = inject('trackersList');
  const versionList = inject('versionList');
  const memberList = inject('memberList');
  console.log(`output->trackers`, trackers);

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
    return (
      versionList.value?.find((version) => formModel.fixed_version_id === version.id)?.name ||
      '待添加'
    );
  });
  const versionChange = ({ item, key }) => {
    formModel.fixed_version_id = key;
  };

  // 校验提交的内容
  const validate = (type = 'error', title = '失败', tip = '标题不能为空') => {
    if (!formModel['subject'])
      notification.error({
        message: title,
        placement: 'bottomLeft',
        description: tip,
      });
    return false;
  };

  const handleOk = async () => {
    validate();
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
</script>

<style scoped></style>
