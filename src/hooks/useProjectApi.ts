import { computed, onMounted, reactive, toRefs } from 'vue';
import { useRoute } from 'vue-router';
import { fetchVersion, getProjectList } from '@apis/index';
export const useProjectApi = () => {
  const route = useRoute();
  const projectId = route.params.projectId; // 获取版本列表
  const projectModel = reactive({
    versionList: [],
    projectList: [],
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
  const fetchProjectList = async () => {
    const res = await getProjectList({
      token: localStorage.getItem('token'),
    });
    projectModel.projectList = res.projects;
  };

  return { ...toRefs(projectModel), getVersion, fetchProjectList };
};
