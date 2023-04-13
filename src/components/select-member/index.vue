<template>
  <div>
    <!-- <div class="w-30"><span class="label">执行者</span></div> -->
    <div class="flex-auto">
      <Select
        v-model:value="value"
        style="width: 300px"
        placeholder="待添加"
        mode="multiple"
        :options="computedMemberList"
        :filterOption="filterOption"
      >
        <template #option="{ value: val, label }">
          <div class="flex px-5 items-center">
            <div
              class="w-6 h-6 bg-amber-200 mr-3 rounded-1/2 flex items-center justify-center text-white"
            >
              <span>{{ label.slice(0, 1) }}</span>
            </div>
            <span class="truncate font-500 text-neutral-800">{{ label }}</span>
          </div>
        </template>
        <template #tagRender="{ value: val, label, closable, onClose, option }">
          <Tag :closable="closable" style="margin-right: 3px" @close="onClose">
            <span class="w-4 h-4 text-12px bg-amber-200 mr-3 rounded-1/2 text-white">
              <span>{{ label.slice(0, 1) }}</span>
            </span>
            <span class="truncate text-12px text-neutral-800">{{ label }}</span>
          </Tag>
        </template>
      </Select>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { inject, computed, unref, ref } from 'vue';
  import { Select, Tag } from 'ant-design-vue';
  const memberList = inject('memberList');
  console.log(`output->memberList`, memberList);
  const filterList = ref(unref(memberList));
  const value = ref([]);

  const computedMemberList = computed(() => {
    return memberList.value?.map((item) => ({
      value: item.user.id,
      label: item.user.name,
      text: item.user.name,
    }));
  });

  const handleSearch = (val: string) => {
    let res: { value: string }[];
    if (!val) {
      res = [];
    } else {
      res = memberList.value;
    }
    filterList.value = res;
  };
  const filterOption = (inputValue: string, option: Option) => {
    return option.label.toUpperCase().indexOf(inputValue?.toUpperCase()) >= 0;
  };
</script>

<style scoped></style>
