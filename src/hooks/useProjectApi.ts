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
  const getVersion = async () => {
    const resp = await fetchVersion({
      token: sessionStorage.getItem('token'),
      pid: projectId,
    });
    projectModel.versionList = resp.version;
  };
  const fetchProjectList = async () => {
    const res = await getProjectList({
      token: sessionStorage.getItem('token'),
    });
    projectModel.projectList = res.projects;
  };

  return { ...toRefs(projectModel), getVersion, fetchProjectList };
};
