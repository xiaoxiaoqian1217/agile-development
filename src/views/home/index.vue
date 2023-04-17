<template>
  <div class="px-24px">
    <Tabs v-model:activeKey="activeKey">
      <TabPane key="1" tab="我的项目">
        <div class="flex flex-wrap items-start pb-20px">
          <template v-for="project in projectList" :key="project.id">
            <div
              class="w-213px shadow-md rounded-1xl m-2 overflow-hidden project-item"
              @click="toProject(project)"
            >
              <div class="project-img-wrap"></div>
              <!-- <img :src="projectImg" alt="" class="rounded-2xl" /> -->
              <div class="py-2.5 px-4">
                <span class="font-600 truncate">{{ project.name }}</span>
              </div>
            </div>
          </template>
        </div>
      </TabPane>
      <!-- <TabPane key="2" tab="项目">项目</TabPane> -->
      <!-- <template #rightExtra>
        <span>Right Extra Action</span>
      </template> -->
    </Tabs>
  </div>
</template>

<script setup lang="ts">
  import { Tabs, TabPane } from 'ant-design-vue';
  import { onMounted, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useProjectApi } from '@/hooks';
  import projectImg from '@/assets/project.png';

  const router = useRouter();
  const activeKey = ref('1');
  const { projectList, fetchProjectList } = useProjectApi();
  const toProject = (project) => {
    router.push({
      name: 'project',
      params: {
        projectId: project.id,
      },
      query: {
        projectName: project.name,
      },
    });
  };

  onMounted(async () => {
    fetchProjectList();
  });
</script>

<style scoped>
  .project-img-wrap {
    height: 90px;
    background-size: cover;
    background-image: url('../../assets/project.png');
  }
</style>
