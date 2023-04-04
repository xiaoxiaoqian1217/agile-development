
/**
 * 路由定义（主进程与渲染进程通信频道定义）
 */
const ipcApiMessage = {
  test: 'controller.example.test',
  pageLoaded: 'page.loaded',
  noInternet: 'controller.internet.noInternet',
  internetAvailable: 'controller.internet.internetAvailable',
  deviceRegist: 'controller.device.registCode',
  deviceInfo: 'controller.device.deviceInfo',
  topCamerasImage: 'controller.ros.topCameras'
}

const ipcApiMethod = {
  doTest: 'service',
  getWirelessList: 'service.internet.getWirelessList',
  setWireless: 'service.internet.setWireless',
  getQRCode: 'service.device.getQRCode',
  getToken: 'service.device.registCode',
  getDeviceInfo: 'service.device.deviceInfo',
  changeTopVideoMode: 'service.test.changeMode'
}

export {
  ipcApiMessage,
  ipcApiMethod,
}