import { Router } from 'vue-router';
import useNodeApi from '../samples/node-api';
import { ipcApiMessage, ipcApiMethod } from '../api/main';
// import usePeerjsHelper from '../utils/peerjsHelper'

let routerManager: IRouterManager;

const useRouterManager = (router?: Router) => {
  if (routerManager == null && router !== null) {
    routerManager = {
      isLoaded: true,
      router,
      nodeapi: useNodeApi(),
      init() {
        if (this.isLoaded) {
          console.log('routerManager is loaded.');
          // this.registSystemEventListener()
          //   this.router.push({ path: '/home' });
        }
        this.isLoaded = false;
      },
      registSystemEventListener() {
        this.nodeapi.onNoInternet((e, args) => {
          console.log('onNoInternet', args);
          this.router.push({ path: '/connect' }); // wireless
        });
        // this.nodeapi.oninternetAvailable((_, args) => {
        //     console.log("onInternetAvailable", args)
        //     // this.nodeapi.getToken()
        //     // this.router.push({ path: "/login" })
        // })
        this.nodeapi.onGetToken((_, token) => {
          console.log('onGetToken', token);
          // const peerHelper = usePeerjsHelper(token)
          // peerHelper.peer.on('regist', (data: any) => {
          //     console.log(data)
          //     this.router.push({ path: "/welcome" })
          // })
          // if(this.router.currentRoute.value.name == "regist") {}
          // else{
          //     this.router.push({ path: "/home" })
          // }
          // this.router.push({ path: "/login" })
        });
        this.nodeapi.on(ipcApiMessage.deviceInfo, (_, obj) => {
          if (obj == null || obj.isactived == 0) {
            this.router.push({ path: '/regist' });
          } else {
            this.router.push({ path: '/home' });
          }
        });
      },
      goBack() {
        this.router.back();
      },
    };
  }
  return routerManager;
};

export default useRouterManager;
