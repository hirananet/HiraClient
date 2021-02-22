import { globalData } from './version';

export const environment = {
  production: true,
  electron: false,
  version: globalData.version+'-w',
  codename: globalData.codename,
  hiranaTools: 'https://thira.tandilserver.com',
  maxCommandHistory: 50,
  intervalWHOX: 10000,
  webIRCGateway: 'wss://wircg.tandilserver.com/webirc/websocket/',
  rockola: 'wss://rockola.hirana.net'
};
