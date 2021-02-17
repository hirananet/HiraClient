import { globalData } from './version';

export const environment = {
  production: true,
  electron: true,
  version: globalData.version+'-e',
  codename: globalData.codename,
  hiranaTools: 'https://thira.tandilserver.com',
  maxCommandHistory: 50,
  intervalWHOX: 10000,
  webIRCGateway: 'wss://wircg.tandilserver.com/webirc/websocket/',
  rockola: 'ws://rockola.hirana.net:3091'
};
