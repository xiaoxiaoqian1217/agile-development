import axios, { AxiosRequestConfig } from 'axios';

let isShowError = true;

const FailCode: any = {
  1000001: (resData: any) => {
    // 可以在这里添加错误提示
    return Promise.reject(resData);
  },
  '-1': (resData: any) => {
    return Promise.reject(resData);
  },
  default: (resData: any) => {
    return Promise.reject(resData);
  },
};

const instance = axios.create({
  timeout: 60000,
});

instance.interceptors.request.use(
  function (config: AxiosRequestConfig<any>) {
    isShowError = !config.headers?.isHideError;
    return {
      ...config,
      headers: {
        // Authorization: 'Bearer 8be5db2ffa0a4acda60bd528b95d4ce4',
        ...config.headers,
      },
    };
  },
  function (error) {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  function (response) {
    const { headers, status, data } = response;
    if (status === 200) {
      // const { ret } = data;
      // if (ret !== 0 && !config.headers?.isHideError) {
      //   return FailCode[ret] ? FailCode[ret](data) : FailCode.default(data);
      // }
      return data;
    } else {
      isShowError && console.error(`接口出错：${status}`);
      return Promise.reject(response);
    }
  },
  function (error) {
    isShowError && console.error(`接口出错：${error?.message}`);
    return Promise.reject(error);
  }
);

export const httpClient = instance;
