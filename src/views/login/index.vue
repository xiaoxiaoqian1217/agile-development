<template>
  <div class="flex justify-center items-center h-full">
    <div class="w-430px h-575px shadow-md py-60px px-36px">
      <p class="font-500 text-22px text-black mb-48px">登录以继续使用</p>
      <Form :model="formState" name="normal_login" class="login-form" @finish="onFinish">
        <FormItem label="" name="username" :rules="[{ required: true, message: '输入用户名' }]">
          <Input v-model:value="formState.username" placeholder="输入用户名"> </Input>
        </FormItem>

        <FormItem label="" name="password" :rules="[{ required: true, message: '密码' }]">
          <InputPassword v-model:value="formState.password" placeholder="密码"> </InputPassword>
        </FormItem>

        <!-- <a-form-item>
        <a class="login-form-forgot" href="">Forgot password</a>
      </a-form-item> -->
        <FormItem>
          <Button :disabled="disabled" type="primary" html-type="submit" class="w-full mt-48px">
            立即开始
          </Button>
        </FormItem>
      </Form>
      <!-- <Button :disabled="disabled" type="primary" html-type="submit" class="login-form-button"> 立即开始 </Button> -->
    </div>
  </div>
</template>

<script setup lang="ts">
  import { Form, FormItem, Input, InputPassword, Button } from 'ant-design-vue';
  import { computed, reactive, toRaw } from 'vue';
  import { loginIn } from '../../apis';
  import { useUserStore } from '../../stores';
  import { LoginUserInfo } from '@types';
  import { useRouter } from 'vue-router';
  const userStore = useUserStore();
  const router = useRouter();
  interface FormState {
    username: string;
    password: string;
  }
  const formState = reactive<FormState>({
    username: '',
    password: '',
  });
  const disabled = computed(() => {
    return !(formState.username && formState.password);
  });
  const onFinish = async (values: any) => {
    await login();
    router.push({
      name: 'home',
    });
  };
  const login = async () => {
    const loginResp = await loginIn({
      ...toRaw(formState),
    });
    sessionStorage.setItem('token', loginResp?.data?.token);
    userStore.setToken(loginResp.data.token);
    userStore.setUserInfo(loginResp.data.userInfo);
  };
</script>

<style scoped></style>
