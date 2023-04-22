<template>
  <div class="mask fixed" v-if="isShow" @click="hideMask"></div>
  <div class="relative filter-box">
    <div class="flex items-center" @click="openFilter">
      <FilterOutlined class="mr-1" :class="filterNum && 'text-blue-400'" />
      <div>
        <span v-if="filterNum" class="text-sky-500">{{ filterNum }}</span>
        <span v-else>筛选</span>
      </div>
    </div>
    <div>
      <div
        class="absolute w-705px top-full mt-15px -left-654px z-500 flex flex-col bg-light-50 py-16px px-20px shadow-lg"
        v-if="isShow"
      >
        <template v-if="!optionGroup.length">
          <span>在这里添加筛选条件，精准过滤出你需要查看的任务</span>
        </template>
        <template v-else>
          <template v-for="(group, index) in optionGroup" :key="group.id">
            <div class="flex items-center mb-4">
              <div class="w-60px mr-14px">
                <span class="px-1" v-if="index === 0">满足</span>
                <Select
                  class="mr-14px"
                  v-else
                  v-model:value="group.orAndFlag.value"
                  :disabled="index > 1 ? true : false"
                  @change="(value) => orAndFlagChange(group, value)"
                >
                  <SelectOption v-for="flag in orAnd" :value="flag.value" :key="flag.value">
                    {{ flag.label }}
                  </SelectOption>
                </Select>
              </div>
              <Select
                class="mr-14px"
                v-model:value="group.type.field"
                style="width: 150px"
                @change="(value, option) => handleChange(value, group)"
              >
                <template v-for="typeItem in typesOptions" :key="typeItem.field">
                  <SelectOptGroup>
                    <template #label>
                      <span>
                        <!-- <user-outlined /> -->
                        {{ typeItem.label }}
                      </span>
                    </template>
                    <template v-for="optionItem in typeItem.options" :key="optionItem.value">
                      <SelectOption :value="optionItem.value">{{ optionItem.label }}</SelectOption>
                    </template>
                  </SelectOptGroup>
                </template>
              </Select>
              <!-- 条件组合 -->
              <div>
                <Select
                  v-if="
                    group.type.field === FilterTypeField.start_date ||
                    group.type.field === FilterTypeField.due_date
                  "
                  class="mr-14px w-85px"
                  v-model:value="group.flag.value"
                  @change="(value) => yesOrNoChange(group, value)"
                >
                  <SelectOption v-for="flag in DateFlags" :value="flag.value" :key="flag.value">
                    {{ flag.label }}
                  </SelectOption>
                </Select>

                <Select
                  v-else
                  class="mr-14px w-85px"
                  v-model:value="group.flag.value"
                  @change="(value) => yesOrNoChange(group, value)"
                >
                  <SelectOption v-for="flag in Flags" :value="flag.value" :key="flag.value">
                    {{ flag.label }}
                  </SelectOption>
                </Select>
              </div>

              <div class="w-300px">
                <div
                  v-if="
                    group.type.field === FilterTypeField.start_date ||
                    group.type.field === FilterTypeField.due_date
                  "
                >
                  <RangePicker
                    v-if="group.flag.value === 0 || group.flag.value === 1"
                    class="w-full"
                    @change="(date, dateString) => dateChange(group, date, dateString)"
                    v-model:value="group.type.value"
                    :ranges="date[group.type.field].ranges"
                  />
                  <!-- 早于和晚于只能选择一个日期 -->
                  <DatePicker
                    class="w-full"
                    v-else
                    v-model:value="group.type.value"
                    @change="(date, dateString) => dateChange(group, date, dateString)"
                  />
                </div>
                <div
                  v-else-if="
                    group.type.field === FilterTypeField.assigned_to_id ||
                    group.type.field === FilterTypeField.author
                  "
                >
                  <SelectMember
                    class="w-full"
                    :value="group.type.value || undefined"
                    @on-change="(value) => memeberChange(group, value)"
                  ></SelectMember>
                </div>
                <!-- 下拉框 -->
                <Select
                  v-else
                  class="w-full"
                  @change="(value) => memeberChange(group, value)"
                  v-model:value="group.type.value"
                  placeholder="待添加"
                >
                  <SelectOption
                    v-for="option in getOptions(group.type.field)"
                    :value="option.id"
                    :key="option.id"
                    >{{ option.name }}
                  </SelectOption>
                </Select>
              </div>
              <span class="ml-14px" @click="(e) => deleteOption(e, group.id)">
                <CloseOutlined />
              </span>
            </div>
          </template>
        </template>

        <!-- <div class=""> -->
        <span class="flex w-100px items-center ant-btn-link text-link-50" @click="addCondition">
          <PlusOutlined class="mr-2" />添加条件
        </span>
        <!-- </div> -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, inject, computed, reactive, unref, watch } from 'vue';
  import { Select, SelectOption, SelectOptGroup, RangePicker, DatePicker } from 'ant-design-vue';
  import { CloseOutlined, FilterOutlined, PlusOutlined } from '@ant-design/icons-vue';
  import { cloneDeep } from 'lodash';
  import dayjs, { Dayjs } from 'dayjs';
  import { SelectMember } from '..';
  import { FilterTypeField, type FieldItem } from '@/types';
  import type { FilterOptionConfig } from './type';
  import { filterOptionConfig } from './config';
  import locale from 'ant-design-vue/es/date-picker/locale/zh_CN';
  interface Props {
    activePanelMenuId: string;
  }
  const props = defineProps<Props>();
  const emits = defineEmits(['change', 'on-visible']);
  const DateList = [
    {
      label: '开始时间',
      value: 'start_date',
    },
    {
      label: '预期完成时间',
      value: 'due_date',
    },
  ];
  const orAnd = [
    { value: 'or', label: '或', disabled: true },
    { value: 'and', label: '且', disabled: true },
  ];
  const Flags = [
    {
      value: 1,
      label: '是',
    },
    {
      value: 0,
      label: '不是',
    },
  ];
  const DateFlags = [
    ...Flags,
    {
      value: 2,
      label: '早于(含)',
    },
    {
      value: 3,
      label: '晚于',
    },
  ];
  const dateRanges = {
    昨天: [dayjs().add(-1, 'day'), dayjs().add(-1, 'day')],
    今天: [dayjs(), dayjs()],
    上周: [dayjs().add(-1, 'week').startOf('week'), dayjs().add(-1, 'week').endOf('week')],
    本周: [dayjs().startOf('week'), dayjs().endOf('week')],
    下周: [dayjs().add(1, 'week').startOf('week'), dayjs().add(1, 'week').endOf('week')],
    上月: [dayjs().add(-1, 'month').startOf('month'), dayjs().add(-1, 'month').endOf('month')],
    本月: [dayjs().startOf('month'), dayjs().endOf('month')],
    下月: [dayjs().add(1, 'month').startOf('month'), dayjs().add(1, 'month').endOf('month')],
  };

  const date = reactive({
    start_date: {
      id: '',
      value: undefined,
      ranges: { ...cloneDeep(dateRanges) },
    },
    due_date: {
      id: '',
      value: undefined,
      ranges: { ...cloneDeep(dateRanges) },
    },
  });
  const levels = inject<FieldItem[]>('levelList');
  const statusList = inject('statusList');
  const trackers = inject('trackersList');
  const versionList = inject('versionList');
  const memberList = inject('memberList');
  watch(
    () => props.activePanelMenuId,
    (newValue: string, oldValue: string) => {
      if (newValue !== oldValue) {
        optionGroup.value = [cloneDeep(filterOptionConfig)];
      }
    }
  );
  const typesOptions = computed(() => {
    return [
      {
        label: '推荐',
        options: [
          {
            label: '优先级',
            value: FilterTypeField.priority_id,
          },
          {
            label: '任务状态',
            value: FilterTypeField.status_id,
          },
          {
            label: '任务类型',
            value: FilterTypeField.tracker_id,
          },
          {
            label: '迭代',
            // options: versionList.value,
            value: FilterTypeField.fixed_version_id,
          },
        ],
      },
      {
        label: '成员',
        options: [
          {
            label: '创建者',
            value: FilterTypeField.author,
          },
          {
            label: '执行者',
            value: FilterTypeField.assigned_to_id,
          },
        ].filter((item) => item.value !== props.activePanelMenuId),
      },
      {
        label: '时间',
        options: DateList,
      },
    ];
  });
  const handleChange = (value: string, typeItem: FilterOptionConfig) => {};
  const getOptions = (type: string) => {
    if (type === FilterTypeField.assigned_to_id) return memberList.value;
    if (type === FilterTypeField.priority_id) return levels.value;
    if (type === FilterTypeField.tracker_id) return trackers.value;
    if (type === FilterTypeField.fixed_version_id) return versionList.value;
    if (type === FilterTypeField.status_id) return statusList.value;
  };
  const filterNum = computed(() => {
    return optionGroup.value.filter((item) => item.type.value)?.length;
  });

  const optionGroup = ref([cloneDeep(filterOptionConfig)]);
  const addCondition = () => {
    optionGroup.value.push(reactive({ ...cloneDeep(filterOptionConfig), id: Date.now() }));
    console.log(`output-> optionGroup.value`, optionGroup.value);
    if (optionGroup.value.length < 2) optionGroup.value[0].orAndFlag = { value: 'and' };
    else
      optionGroup.value.forEach((item) => {
        item.orAndFlag = optionGroup.value[1].orAndFlag;
      });
  };
  const deleteOption = (e: any, id: number) => {
    console.log(`output->e`, e, id);
    e.stopPropagation();
    optionGroup.value = optionGroup.value.filter((item) => item.id !== id);
    if (optionGroup.value.length === 1) optionGroup.value[0].orAndFlag = { value: 'and' };
    emits('change', {}, unref(optionGroup));
  };
  const isShow = ref(false);
  const openFilter = () => {
    isShow.value = !isShow.value;
  };
  const memeberChange = (group: FilterOptionConfig, value) => {
    group.type.value = value;
    emits('change', group, unref(optionGroup));
  };

  const dateChange = (
    group: FilterOptionConfig,
    date: [Dayjs, Dayjs] | Dayjs,
    dateString: [string, string] | string
  ) => {
    group.type.value = date;
    console.log(`output->dateString`, date, dateString);
    emits('change', group, unref(optionGroup));
  };

  const orAndFlagChange = (group: FilterOptionConfig, value: string) => {
    group.orAndFlag.value = value;
    if (optionGroup.value.length > 0)
      optionGroup.value.forEach((item) => (item.orAndFlag.value = value));
    if (group.type.value !== undefined) emits('change', group, unref(optionGroup));
  };
  const computedIsShow = computed(() => {
    return props.visible;
  });
  const yesOrNoChange = (group: FilterOptionConfig, value: number) => {
    if (
      group.type.field === FilterTypeField.start_date ||
      group.type.field === FilterTypeField.due_date
    ) {
      group.type.value = undefined;
    }
    group.flag.value = value;
    if (group.type.value !== undefined) emits('change', group, unref(optionGroup));
  };

  const hideMask = () => {
    isShow.value = false;
  };
</script>

<style scoped>
  .mask {
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 500;
  }
</style>
