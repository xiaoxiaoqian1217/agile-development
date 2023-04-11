import { ref, onMounted, reactive, toRefs } from 'vue';
import { useRoute } from 'vue-router';
import { getMembers } from '@apis/index';
import { UserItem, Users } from '../types';
export const useCommonApis = () => {
  const route = useRoute();
  const projectId = route.params.projectId; // 获取版本列表
  const commonModel = reactive({
    versionList: [],
  });
  onMounted(() => {
    fetchMembers();
  });
  const userList = ref<UserItem[]>();
  //  展示项目成员

  const fetchMembers = async () => {
    const resp = await getMembers({
      pid: projectId,
      token: localStorage.getItem('token'),
    });
    userList.value = resp.users;
  };
  return { userList, fetchMembers };
};
