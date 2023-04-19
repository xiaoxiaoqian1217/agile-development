<template>
  <div class="relative" ref="boxRef">
    <span class="flex items-center" @click="openFilter">
      <FilterOutlined class="mr-1" :class="filterNum && 'text-blue-400'" />
      <span v-if="filterNum" class="text-sky-500">{{ filterNum }}</span>
      <span v-else>筛选</span>
    </span>
    <div
      v-if="isShow"
      class="absolute top-full mt-15px -left-654px z-30 flex flex-col bg-light-50 py-16px px-20px shadow-lg"
    >
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
                class="w-full"
                @change="(date, dateString) => dateChange(group, date, dateString)"
                v-model:value="date[group.type.field].value"
                :ranges="date[group.type.field].ranges"
              />
            </div>
            <!-- <div v-else-if="group.type.field.includes?.(FilterTypeField.due_date)">
              <RangePicker
                class="w-full"
                v-model:value="group.type.value"
                :ranges="rangePicker.ranges"
              />
            </div> -->
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
          <span class="ml-14px" @click="deleteOption(group.id)">
            <CloseOutlined />
          </span>
        </div>
      </template>

      <div class="">
        <a class="flex items-center ant-btn-link text-link-50" @click="addCondition">
          <PlusOutlined class="mr-2" />添加条件</a
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, inject, computed, reactive, unref, watch, onMounted, onUnmounted } from 'vue';
  import { Select, SelectOption, SelectOptGroup, RangePicker } from 'ant-design-vue';
  import { cloneDeep } from 'lodash';
  import { FilterTypeField, type FieldItem } from '@/types';
  import { CloseOutlined, FilterOutlined, PlusOutlined } from '@ant-design/icons-vue';
  import { SelectMember } from '..';
  import dayjs, { Dayjs } from 'dayjs';
  import { useTaskBusiness } from '@/views/task/hooks';

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
      value: '2',
      label: '早于(含)',
    },
    {
      value: '3',
      label: '晚于',
    },
  ];

  type optionConfig = typeof filterOptionConfig;
  const filterOptionConfig = {
    type: {
      value: undefined,
      field: FilterTypeField.priority_id,
    },
    flag: {
      value: 1,
    },
    orAndFlag: {
      value: 'and',
    },
    id: Date.now(),
  };
  const date = reactive({
    start_date: {
      id: '',
      value: undefined,
      ranges: { Today: [dayjs(), dayjs()], 'This Month': [dayjs(), dayjs().endOf('month')] },
    },
    due_date: {
      id: '',
      value: undefined,
      ranges: { Today: [dayjs(), dayjs()], 'This Month': [dayjs(), dayjs().endOf('month')] },
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
        // field: [FilterTypeField.assigned_to_id, FilterTypeField.author],
      },
      {
        label: '时间',
        options: DateList,
        // field: [FilterTypeField.start_date, FilterTypeField.due_date],
      },
    ];
  });
  const handleChange = (value: string, typeItem: optionConfig) => {
    console.log(`selected ${value}`, typeItem);
    typeItem.value = dayjs();
    // let list = typeItem.type.f
    // if(typeItem.field === )
  };
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
    optionGroup.value.push({ ...cloneDeep(filterOptionConfig), id: Date.now() });
    if (optionGroup.value.length > 0)
      optionGroup.value.forEach((item) => {
        console.log(`output->orAndFlag`, optionGroup.value[1].orAndFlag.value);
        item.orAndFlag.value = optionGroup.value[1].orAndFlag.value;
      });
  };
  const deleteOption = (id: number) => {
    optionGroup.value = optionGroup.value.filter((item) => item.id !== id);
    if (optionGroup.value.length === 1) optionGroup.value[0].flag = 'and';

    emits('change', {}, unref(optionGroup));
  };
  const isShow = ref(false);
  const openFilter = () => {
    isShow.value = !isShow.value;
  };
  const memeberChange = (group: optionConfig, value) => {
    group.type.value = value;
    emits('change', group, unref(optionGroup));
  };

  const dateChange = (group: optionConfig, date: [Dayjs, Dayjs], dateString: [string, string]) => {
    group.type.value = date;
    emits('change', group, unref(optionGroup));
  };

  const orAndFlagChange = (group: optionConfig, value: string) => {
    // group.orAndFlag.value = value;
    group.orAndFlag.value = value;
    if (optionGroup.value.length > 0)
      optionGroup.value.forEach((item) => (item.orAndFlag.value = value));

    // emits('change', group, unref(optionGroup));
  };
  const computedIsShow = computed(() => {
    return props.visible;
  });
  const yesOrNoChange = (group: optionConfig, value: string) => {
    console.log(`output->group`, value);
    group.flag.value = value;
    emits('change', group, unref(optionGroup));
  };

  // 点击组件以外的元素需要隐藏下拉框
  let handler: (e: any) => void;
  const boxRef = ref();
  onMounted(() => {
    handler = (e) => {
      // 记得在.select-box那边加上ref="selectBox"
      const selectBox = boxRef.value;
      // 重点来了：selectBox里是否包含点击的元素，不包含点击的元素就隐藏面板
      if (!selectBox.contains(e.target)) {
        isShow.value = false;
      }
    };
    document.addEventListener('click', handler);
  });
  onUnmounted(() => {
    document.removeEventListener('click', handler);
  });

  const handleVisible = () => {
    emits('on-visible');
  };
</script>

<style scoped></style>
