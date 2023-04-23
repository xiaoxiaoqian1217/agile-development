import axios, { AxiosRequestConfig } from 'axios';

let isShowError = true;

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
