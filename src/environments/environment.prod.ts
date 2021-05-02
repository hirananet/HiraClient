import { globalData } from './version';

export const environment = {
  production: true,
  prodEndpoint: 'https://web.hirana.net',
  electron: false,
  version: globalData.version+'-w',
  codename: globalData.codename,
  hiranaTools: 'https://thira.tandilserver.com',
  maxCommandHistory: 50,
  intervalWHOX: 10000,
  webIRCGateway: 'wss://wircg.tandilserver.com/webirc/websocket/',
  rockola: 'wss://rockola.hirana.net',
  ipstackApiKey: '',
  cacheLabels: 180000 // 3 minutos
};
