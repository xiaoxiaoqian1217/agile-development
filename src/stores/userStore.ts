import { defineStore } from 'pinia';
import { type LoginUserInfo } from '../types';

export const useUserStore = defineStore('user', {
  state: () => ({ token: '', userInfo: {} }),
  getters: {
    getToken: (state) => state.token,
  },
  actions: {
    setToken(token: string) {
      this.token = token;
    },
    setUserInfo(userInfo: LoginUserInfo) {
      this.userInfo = userInfo;
      sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
    },
  },
});
