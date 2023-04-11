import { ref, onMounted, reactive, toRefs } from 'vue';
import { useRoute } from 'vue-router';
import { fetchVersion } from '@apis/index';
export const useProjectApi = () => {
  const route = useRoute();
  const projectId = route.params.projectId; // 获取版本列表
  const projectModel = reactive({
    versionList: [],
  });
  onMounted(() => {
    getVersion();
  });
  const getVersion = async () => {
    const resp = await fetchVersion({
      token: localStorage.getItem('token'),
      pid: projectId,
    });
    projectModel.versionList = resp.version;
    console.log(`output->resp`, resp);
  };
  return { ...toRefs(projectModel), getVersion };
};
