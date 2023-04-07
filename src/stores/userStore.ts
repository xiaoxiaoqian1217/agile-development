import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({ token: '' }),
  getters: {
    getToken: (state) => state.token,
  },
  actions: {
    setToken(token: string) {
      this.token = token;
    },
  },
});
