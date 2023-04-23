<template>
  <Select
    @change="handleChange"
    v-model:value="computedValue"
    placeholder="待添加"
    :options="computedMemberList"
    :filterOption="filterOption"
  >
    <template #option="{ value: val, label }">
      <div class="flex px-1 items-center">
        <div
          class="w-6 h-6 bg-amber-300 mr-3 rounded-1/2 flex items-center justify-center text-white"
        >
          <span>{{ label.slice(0, 1) }}</span>
        </div>
        <span class="truncate font-500 text-neutral-800">{{ label }}</span>
      </div>
    </template>
    <template #tagRender="{ value: val, label, closable, onClose, option }">
      <Tag :closable="closable" style="margin-right: 3px" @close="onClose">
        <span class="w-4 h-4 text-12px bg-amber-300 mr-3 rounded-1/2 text-white">
          <span>{{ label.slice(0, 1) }}</span>
        </span>
        <span class="truncate text-12px text-neutral-800">{{ label }}</span>
      </Tag>
    </template>
  </Select>
</template>

<script setup lang="ts">
  import { inject, computed, unref, ref } from 'vue';
  import { Select, Tag, type SelectProps } from 'ant-design-vue';

  const memberList = inject('memberList');
  const filterList = ref(unref(memberList));
  const emits = defineEmits(['onChange']);
  const props = defineProps({
    value: Number,
  });
  const computedMemberList = computed(() => {
    return memberList.value?.map((item) => ({
      value: item.user.id,
      label: item.user.name,
      text: item.user.name,
    }));
  });

  const computedValue = computed(() => {
    return props.value;
  });

  // const handleSearch = (val: string) => {
  //   let res: { value: string }[];
  //   if (!val) {
  //     res = [];
  //   } else {
  //     res = memberList.value;
  //   }
  //   filterList.value = res;
  // };
  const filterOption = (inputValue: string, option: SelectProps['options']) => {
    return option?.label.toUpperCase().indexOf(inputValue?.toUpperCase()) >= 0;
  };
  const handleChange = (value: string) => {
    console.log(`selected ${value}`);
    emits('onChange', value);
  };
</script>

<style scoped></style>
