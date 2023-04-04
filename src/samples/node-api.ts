// import { lstat } from 'node:fs/promises'
// import { cwd } from 'node:process'
import { ipcRenderer } from 'electron';
import { ipcApiMessage, ipcApiMethod } from '../api/main';

// ipcRenderer.on('main-process-message', (_event, ...args) => {
//   console.log('[Receive Main-process message]:', ...args)
// })

// lstat(cwd()).then(stats => {
//   console.log('[fs.lstat]', stats)
// }).catch(err => {
//   console.error(err)
// })

const useNodeApi: () => INodeApi = () => {
  return {
    onNoInternet(handle: (event: Electron.IpcRendererEvent, ...args: any[]) => void) {
      ipcRenderer.on(ipcApiMessage.noInternet, handle);
    },
    oninternetAvailable(handle: (event: Electron.IpcRendererEvent, ...args: any[]) => void) {
      ipcRenderer.on(ipcApiMessage.internetAvailable, handle);
    },
    onGetToken(handle: (event: Electron.IpcRendererEvent, ...args: any[]) => void) {
      ipcRenderer.on(ipcApiMessage.deviceRegist, handle);
    },
    on(msg: string, handle: (event: Electron.IpcRendererEvent, ...args: any[]) => void) {
      ipcRenderer.on(msg, handle);
    },
    pageLoaded() {
      ipcRenderer.invoke(ipcApiMessage.pageLoaded, ['home']);
    },
    getWirelessList(param: any[]) {
      return ipcRenderer.invoke(ipcApiMethod.getWirelessList, param);
    },
    setWireless(ssid: string, passphrase: string) {
      return ipcRenderer.invoke(ipcApiMethod.setWireless, [ssid, passphrase]);
    },
    getQRCode() {
      return ipcRenderer.invoke(ipcApiMethod.doTest, [ipcApiMethod.getQRCode]);
    },
    getToken() {
      return ipcRenderer.invoke(ipcApiMethod.getToken, [ipcApiMethod.getToken]);
    },
    getDeviceInfo() {
      return ipcRenderer.invoke(ipcApiMethod.doTest, [ipcApiMethod.getDeviceInfo]);
    },
    getTopCamera() {
      return ipcRenderer.invoke(ipcApiMethod.doTest, [ipcApiMethod.changeTopVideoMode]);
    },
  };
};

export default useNodeApi;
