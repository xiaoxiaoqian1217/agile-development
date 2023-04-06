<template>
  <div>
    <Tabs v-model:activeKey="activeKey">
      <TabPane key="1" tab="我的项目">
        <template v-for="item in [1, 2, 4, 5]" :key="item">
          <div class="w-224px animate-none" @click="toProject()">
            <div>
              <img
                src="https://tcs-ga.teambition.net/thumbnail/111tef9a0fbcb8a22b1ea0de47d85b9a52e0/w/600/h/300"
                alt=""
              />
            </div>
            <div class="py-2.5 px-4">
              <span class="font-600 truncate">敏捷研发</span>
            </div>
          </div>
        </template>
      </TabPane>
      <TabPane key="2" tab="项目">项目</TabPane>
      <template #rightExtra>
        <span>Right Extra Action</span>
      </template>
    </Tabs>
  </div>
</template>

<script setup lang="ts">
  import { Tabs, TabPane } from 'ant-design-vue';
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  const router = useRouter();
  const activeKey = ref('1');
  const toProject = () => {
    router.push({
      name: 'project',
      params: {
        projectId: '1',
      },
    });
  };
</script>

<style scoped></style>
