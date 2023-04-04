/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

interface INodeApi {
  onNoInternet: (handle: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => void;
  oninternetAvailable: (handle: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => void;
  onGetToken: (handle: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => void;
  on: (msg: string, handle: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => void;
  pageLoaded: () => void;
  getWirelessList: (param: any[]) => Promise<any>;
  setWireless: (ssid: string, passphrase: string) => Promise<any>;
  getQRCode: () => Promise<string>;
  getToken: () => Promise<string>;
  getDeviceInfo: () => Promise<any>;
  getTopCamera: () => Promise<any>;
}

interface IRouterManager {
  isLoaded: boolean;
  router: Router;
  nodeapi: INodeApi;
  init: () => void;
  registSystemEventListener: () => void;
  goBack: () => void;
}
