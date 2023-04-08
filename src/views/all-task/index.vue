<template>
  <div>根据视频,识别3种防御等级的目标</div>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  // import Draggble from 'vuedraggable';
  import { getTaskList, loginIn } from '../../apis';
  import { useUserStore } from '../../stores';
  import { useRoute } from 'vue-router';
  const route = useRoute();
  const store = useUserStore();
  const fetchTask = async () => {
    const taskResp = await getTaskList({
      pid: 5,
      token: store.token,
      sort: 'status:desc',
    });
  };
  onMounted(async () => {
    // await login();
    store.token && fetchTask();
  });
  // const login = async () => {
  //   const loginResp = await loginIn({
  //     username: 'xiaoqian',
  //     password: 'password',
  //   });
  //   token.value = loginResp.data.token;
  // };
  // onMounted(() => {
  //   fetchTask();
  // });
</script>

<style scoped></style>
