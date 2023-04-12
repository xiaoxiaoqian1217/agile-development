<template>
  <div class="px-24px">
    <Tabs v-model:activeKey="activeKey">
      <TabPane key="1" tab="我的项目">
        <div class="flex flex-wrap items-start">
          <template v-for="project in projectList" :key="project.id">
            <div class="w-224px animate-none m-2" @click="toProject(project)">
              <div>
                <img
                  src="https://tcs-ga.teambition.net/thumbnail/111tef9a0fbcb8a22b1ea0de47d85b9a52e0/w/600/h/300"
                  alt=""
                />
              </div>
              <div class="py-2.5 px-4">
                <span class="font-600 truncate">{{ project.name }}</span>
              </div>
            </div>
          </template>
        </div>
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
  import { onMounted, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { loginIn } from '../../apis';
  import { useUserStore } from '../../stores';
  import { useProjectApi } from '@hooks';
  const userStore = useUserStore();
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
  const login = async () => {
    const loginResp = await loginIn({
      username: 'xiaoqian',
      password: 'xiaoqian',
    });
    localStorage.setItem('token', loginResp?.data?.token);
    // useStorage('token', loginResp?.data?.token);
    userStore.setToken(loginResp.data.token);
  };
  // const fetchProjectList = async () => {
  //   const res = await getProjectList({
  //     token: userStore.token,
  //   });
  //   projectList.value = res.projects;
  // };
  onMounted(async () => {
    console.log(`output->`, userStore.token);
    await login();
    userStore.token && fetchProjectList();
  });
</script>

<style scoped></style>
